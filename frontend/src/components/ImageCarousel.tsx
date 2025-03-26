import { FC, useState, useEffect } from 'react';
import { apiClient } from '../services/api.service';
import styles from './ImageCarousel.module.css';

interface ImageFile {
	id: string;
	name: string;
	mime_type: string;
}

interface ImageCarouselProps {
	files: ImageFile[];
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ files }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
	const imageFiles = files.filter((file) =>
		file.mime_type.startsWith('image/'),
	);

	useEffect(() => {
		// Reset state when files change
		setCurrentIndex(0);
		setImageUrls({});

		// Load first image if available
		if (imageFiles.length > 0) {
			loadImage(imageFiles[0].id);
		}
	}, [files]);

	const loadImage = async (fileId: string) => {
		if (imageUrls[fileId]) return;

		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});
			const url = URL.createObjectURL(new Blob([response.data]));
			setImageUrls((prev) => ({ ...prev, [fileId]: url }));
		} catch (error) {
			console.error('Error loading image:', error);
		}
	};

	const nextImage = () => {
		const nextIndex = (currentIndex + 1) % imageFiles.length;
		setCurrentIndex(nextIndex);
		loadImage(imageFiles[nextIndex].id);
	};

	const prevImage = () => {
		const prevIndex =
			(currentIndex - 1 + imageFiles.length) % imageFiles.length;
		setCurrentIndex(prevIndex);
		loadImage(imageFiles[prevIndex].id);
	};

	if (imageFiles.length === 0) {
		return <div className={styles.placeholder}>No images available</div>;
	}

	return (
		<div className={styles.carousel}>
			<button
				className={`${styles.navButton} ${styles.prevButton}`}
				onClick={(e) => {
					e.stopPropagation();
					prevImage();
				}}
				disabled={imageFiles.length <= 1}
			>
				‹
			</button>

			<div className={styles.imageContainer}>
				{imageUrls[imageFiles[currentIndex].id] ? (
					<img
						src={imageUrls[imageFiles[currentIndex].id]}
						alt={imageFiles[currentIndex].name}
						className={styles.image}
					/>
				) : (
					<div className={styles.loading}>Loading...</div>
				)}
			</div>

			<button
				className={`${styles.navButton} ${styles.nextButton}`}
				onClick={(e) => {
					e.stopPropagation();
					nextImage();
				}}
				disabled={imageFiles.length <= 1}
			>
				›
			</button>

			{imageFiles.length > 1 && (
				<div className={styles.pagination}>
					{currentIndex + 1} / {imageFiles.length}
				</div>
			)}
		</div>
	);
};
