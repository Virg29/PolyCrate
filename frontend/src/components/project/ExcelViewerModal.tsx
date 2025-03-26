import { FC, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import styles from './DocViewerModal.module.css';

interface ExcelViewerModalProps {
	fileUrl: string;
	onClose: () => void;
	fileName: string;
}

export const ExcelViewerModal: FC<ExcelViewerModalProps> = ({
	fileUrl,
	onClose,
	fileName,
}) => {
	const [data, setData] = useState<any[][]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadExcelFile = async () => {
			try {
				const response = await fetch(fileUrl);
				const blob = await response.blob();
				const reader = new FileReader();

				reader.onload = (e) => {
					try {
						const data = new Uint8Array(
							e.target?.result as ArrayBuffer,
						);
						const workbook = XLSX.read(data, { type: 'array' });
						const firstSheet =
							workbook.Sheets[workbook.SheetNames[0]];
						const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
							header: 1,
						}) as any[][];
						setData(jsonData);
					} catch (err) {
						setError('Error parsing Excel file');
						console.error('Excel parse error:', err);
					}
				};

				reader.readAsArrayBuffer(blob);
			} catch (err) {
				setError('Error loading Excel file');
				console.error('Excel load error:', err);
			}
		};

		loadExcelFile();
	}, [fileUrl]);

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.header}>
					<h3>{fileName}</h3>
					<button onClick={onClose} className={styles.closeButton}>
						×
					</button>
				</div>
				<div className={styles.docContainer}>
					{error ? (
						<div className={styles.error}>{error}</div>
					) : (
						<div className={styles.excelTable}>
							<table>
								<tbody>
									{data.map((row, rowIndex) => (
										<tr key={rowIndex}>
											{row.map(
												(
													cell: any,
													cellIndex: number,
												) => (
													<td key={cellIndex}>
														{cell}
													</td>
												),
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
