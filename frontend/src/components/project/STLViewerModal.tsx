import { FC } from 'react';
import { StlViewer } from 'react-stl-viewer';
import styles from './STLViewerModal.module.css';

interface STLViewerModalProps {
	fileUrl: string;
	onClose: () => void;
	fileName: string;
}

export const STLViewerModal: FC<STLViewerModalProps> = ({
	fileUrl,
	onClose,
	fileName,
}) => {
	const style = {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#262626',
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.header}>
					<h3>{fileName}</h3>
					<button onClick={onClose} className={styles.closeButton}>
						×
					</button>
				</div>
				<div className={styles.viewerContainer}>
					<StlViewer url={fileUrl} style={style} orbitControls />
				</div>
			</div>
		</div>
	);
};
