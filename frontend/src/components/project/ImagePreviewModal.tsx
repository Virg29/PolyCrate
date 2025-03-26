import { FC } from 'react';
import styles from './ImagePreviewModal.module.css';

interface ImagePreviewModalProps {
	imageUrl: string;
	onClose: () => void;
	fileName: string;
}

export const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
	imageUrl,
	onClose,
	fileName,
}) => {
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.header}>
					<h3>{fileName}</h3>
					<button onClick={onClose} className={styles.closeButton}>
						×
					</button>
				</div>
				<div className={styles.imageContainer}>
					<img src={imageUrl} alt={fileName} />
				</div>
			</div>
		</div>
	);
};
