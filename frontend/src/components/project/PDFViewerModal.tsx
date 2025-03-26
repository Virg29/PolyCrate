import { FC, useState } from 'react';
import { Document, Page } from 'react-pdf';
import styles from './PDFViewerModal.module.css';

interface PDFViewerModalProps {
	fileUrl: string;
	onClose: () => void;
	fileName: string;
}

export const PDFViewerModal: FC<PDFViewerModalProps> = ({
	fileUrl,
	onClose,
	fileName,
}) => {
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
	}

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.header}>
					<h3>{fileName}</h3>
					<button onClick={onClose} className={styles.closeButton}>
						×
					</button>
				</div>
				<div className={styles.pdfContainer}>
					<Document
						file={fileUrl}
						onLoadSuccess={onDocumentLoadSuccess}
						loading={<div>Loading PDF...</div>}
						error={<div>Error loading PDF.</div>}
					>
						<Page
							pageNumber={pageNumber}
							renderTextLayer={false}
							renderAnnotationLayer={false}
						/>
					</Document>
				</div>
				{numPages && (
					<div className={styles.controls}>
						<button
							disabled={pageNumber <= 1}
							onClick={() => setPageNumber(pageNumber - 1)}
						>
							Previous
						</button>
						<span>
							Page {pageNumber} of {numPages}
						</span>
						<button
							disabled={pageNumber >= numPages}
							onClick={() => setPageNumber(pageNumber + 1)}
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
