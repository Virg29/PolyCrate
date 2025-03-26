import { FC, useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import styles from './DocViewerModal.module.css';

interface WordViewerModalProps {
	fileUrl: string;
	onClose: () => void;
	fileName: string;
}

export const WordViewerModal: FC<WordViewerModalProps> = ({
	fileUrl,
	onClose,
	fileName,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const loadDocument = async () => {
			try {
				const response = await fetch(fileUrl);
				const blob = await response.blob();

				if (containerRef.current) {
					// Clear any existing content
					containerRef.current.innerHTML = '';

					await renderAsync(
						blob,
						containerRef.current,
						containerRef.current,
						{
							className: styles.wordDocument,
							inWrapper: true,
						},
					);
				}
			} catch (error) {
				console.error('Error loading Word document:', error);
				if (containerRef.current) {
					containerRef.current.innerHTML = 'Error loading document';
				}
			}
		};

		loadDocument();
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
					<div ref={containerRef} className={styles.wordContainer} />
				</div>
			</div>
		</div>
	);
};
