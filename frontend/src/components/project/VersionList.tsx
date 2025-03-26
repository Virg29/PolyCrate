import { FC, useState } from 'react';
import { Version } from '../../types/project.types';
import { apiClient } from '../../services/api.service';
import { STLViewerModal } from './STLViewerModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { PDFViewerModal } from './PDFViewerModal';
import { ExcelViewerModal } from './ExcelViewerModal';
import { WordViewerModal } from './WordViewerModal';
import { isPreviewableFile, previewableMimeTypes } from '../../utils/fileTypes';
import styles from './VersionList.module.css';
import previewStyles from './PreviewBadge.module.css';

interface VersionListProps {
	versions: Version[];
}

export const VersionList: FC<VersionListProps> = ({ versions }) => {
	const [imageData, setImageData] = useState<{ [key: string]: string }>({});
	const [selectedSTLFile, setSelectedSTLFile] = useState<{
		url: string;
		name: string;
	} | null>(null);
	const [selectedImage, setSelectedImage] = useState<{
		data: string;
		name: string;
	} | null>(null);
	const [selectedPDF, setSelectedPDF] = useState<{
		url: string;
		name: string;
	} | null>(null);
	const [selectedExcel, setSelectedExcel] = useState<{
		url: string;
		name: string;
	} | null>(null);
	const [selectedWord, setSelectedWord] = useState<{
		url: string;
		name: string;
	} | null>(null);

	const loadImagePreview = async (fileId: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});

			// Convert blob to base64
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				setImageData((prev) => ({ ...prev, [fileId]: base64String }));
			};
			reader.readAsDataURL(response.data);
		} catch (error) {
			console.error('Error loading image preview:', error);
		}
	};

	const handleFileDownload = async (fileId: string, fileName: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});

			// Create blob link to download
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);

			// Append to html page
			document.body.appendChild(link);
			link.click();

			// Clean up and remove the link
			link.parentNode?.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading file:', error);
		}
	};

	const handleDownloadZip = async (versionId: string) => {
		try {
			const response = await apiClient.get(
				`/versions/${versionId}/download`,
				{
					responseType: 'blob',
				},
			);

			// Get filename from content-disposition header or use default
			let filename = 'files.zip';
			const disposition = response.headers?.['content-disposition'];

			if (disposition) {
				// Try to get the filename* parameter first (UTF-8 encoded)
				const filenameMatch = disposition.match(
					/filename\*=UTF-8''([^;]+)/,
				);
				if (filenameMatch) {
					filename = decodeURIComponent(filenameMatch[1]);
				} else {
					// Fallback to regular filename parameter
					const matches = /filename="([^"]+)"/.exec(disposition);
					if (matches) {
						filename = decodeURIComponent(matches[1]);
					}
				}
			}

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading ZIP:', error);
		}
	};

	const isImageFile = (mimeType: string) => {
		return mimeType.startsWith('image/');
	};

	const isSTLFile = (mimeType: string, fileName: string) => {
		return (
			(mimeType === 'application/octet-stream' ||
				mimeType === 'model/stl') &&
			fileName.toLowerCase().endsWith('.stl')
		);
	};

	const isPDFFile = (mimeType: string) => {
		return mimeType === 'application/pdf';
	};

	const isPlainTextFile = (mimeType: string, fileName: string) => {
		return (
			mimeType === 'text/plain' && fileName.toLowerCase().endsWith('.txt')
		);
	};

	const isExcelFile = (mimeType: string, fileName: string) => {
		return (
			[
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			].includes(mimeType) || /\.(xls|xlsx)$/i.test(fileName)
		);
	};

	const isWordFile = (mimeType: string, fileName: string) => {
		return (
			[
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			].includes(mimeType) || /\.(doc|docx)$/i.test(fileName)
		);
	};

	const handleSTLPreview = async (fileId: string, fileName: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});
			const url = URL.createObjectURL(response.data);
			setSelectedSTLFile({ url, name: fileName });
		} catch (error) {
			console.error('Error loading STL file:', error);
		}
	};

	const handlePDFPreview = async (fileId: string, fileName: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});
			const url = URL.createObjectURL(response.data);
			setSelectedPDF({ url, name: fileName });
		} catch (error) {
			console.error('Error loading PDF file:', error);
		}
	};

	const handleExcelPreview = async (fileId: string, fileName: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});
			const url = URL.createObjectURL(response.data);
			setSelectedExcel({ url, name: fileName });
		} catch (error) {
			console.error('Error loading Excel file:', error);
		}
	};

	const handleWordPreview = async (fileId: string, fileName: string) => {
		try {
			const response = await apiClient.get(`/files/${fileId}/download`, {
				responseType: 'blob',
			});
			const url = URL.createObjectURL(response.data);
			setSelectedWord({ url, name: fileName });
		} catch (error) {
			console.error('Error loading Word document:', error);
		}
	};

	const getPreviewLabel = (
		mimeType: string,
		fileName: string,
	): string | null => {
		for (const [key, category] of Object.entries(previewableMimeTypes)) {
			if (category.types.includes(mimeType)) {
				if (key === 'stl' && !category.checkExtension?.(fileName)) {
					continue;
				}
				return category.label;
			}
		}
		return null;
	};

	return (
		<div className={styles.versionList}>
			{versions.map((version) => (
				<div key={version.id} className={styles.versionItem}>
					<div className={styles.versionHeader}>
						<div className={styles.versionInfo}>
							<span className={styles.versionTag}>
								{version.version_tag}
							</span>
							<span className={styles.versionDate}>
								{new Date(
									version.created_at,
								).toLocaleDateString()}
							</span>
						</div>
						{version.files && version.files.length > 0 && (
							<button
								className={styles.downloadZipButton}
								onClick={(e) => {
									e.stopPropagation();
									handleDownloadZip(version.id);
								}}
								title="Download all files"
							>
								⯆
							</button>
						)}
					</div>
					{version.description && (
						<p className={styles.versionDescription}>
							{version.description}
						</p>
					)}
					{version.files && version.files.length > 0 && (
						<div className={styles.filesList}>
							{version.files.map((file) => (
								<div
									key={file.id}
									className={styles.fileItem}
									onClick={() =>
										handleFileDownload(file.id, file.name)
									}
								>
									{isImageFile(file.mime_type) ? (
										<div className={styles.filePreview}>
											{imageData[file.id] ? (
												<img
													src={imageData[file.id]}
													alt={file.name}
													onClick={(e) => {
														e.stopPropagation();
														setSelectedImage({
															data: imageData[
																file.id
															],
															name: file.name,
														});
													}}
												/>
											) : (
												<div
													className={
														styles.filePlaceholder
													}
													onClick={(e) => {
														e.stopPropagation();
														loadImagePreview(
															file.id,
														);
													}}
												>
													Click to preview
												</div>
											)}
										</div>
									) : isSTLFile(file.mime_type, file.name) ? (
										<div className={styles.filePreview}>
											<div
												className={
													styles.filePlaceholder
												}
												onClick={(e) => {
													e.stopPropagation();
													handleSTLPreview(
														file.id,
														file.name,
													);
												}}
											>
												Preview 3D Model
											</div>
										</div>
									) : isPDFFile(file.mime_type) ? (
										<div className={styles.filePreview}>
											<div
												className={
													styles.filePlaceholder
												}
												onClick={(e) => {
													e.stopPropagation();
													handlePDFPreview(
														file.id,
														file.name,
													);
												}}
											>
												Preview PDF
											</div>
										</div>
									) : isExcelFile(
											file.mime_type,
											file.name,
									  ) ? (
										<div className={styles.filePreview}>
											<div
												className={
													styles.filePlaceholder
												}
												onClick={(e) => {
													e.stopPropagation();
													handleExcelPreview(
														file.id,
														file.name,
													);
												}}
											>
												Preview Excel
											</div>
										</div>
									) : isWordFile(
											file.mime_type,
											file.name,
									  ) ? (
										<div className={styles.filePreview}>
											<div
												className={
													styles.filePlaceholder
												}
												onClick={(e) => {
													e.stopPropagation();
													handleWordPreview(
														file.id,
														file.name,
													);
												}}
											>
												Preview Word
											</div>
										</div>
									) : isPlainTextFile(
											file.mime_type,
											file.name,
									  ) ? (
										<div className={styles.filePreview}>
											<div
												className={
													styles.filePlaceholder
												}
											>
												Text File
											</div>
										</div>
									) : (
										<div className={styles.fileIcon}>
											📄
										</div>
									)}
									<div className={styles.fileInfo}>
										<span className={styles.fileName}>
											{file.name}
											{isPreviewableFile(
												file.mime_type,
												file.name,
											) && (
												<span
													className={
														previewStyles.previewBadge
													}
												>
													{getPreviewLabel(
														file.mime_type,
														file.name,
													)}
												</span>
											)}
										</span>
										<span className={styles.fileSize}>
											{(file.size / 1024).toFixed(1)} KB
										</span>
									</div>
									<div className={styles.fileType}>
										{file.mime_type}
									</div>
								</div>
							))}
						</div>
					)}
					<div className={styles.versionMeta}>
						{version._count.files} files
					</div>
				</div>
			))}

			{selectedSTLFile && (
				<STLViewerModal
					fileUrl={selectedSTLFile.url}
					fileName={selectedSTLFile.name}
					onClose={() => {
						URL.revokeObjectURL(selectedSTLFile.url);
						setSelectedSTLFile(null);
					}}
				/>
			)}
			{selectedImage && (
				<ImagePreviewModal
					imageUrl={selectedImage.data}
					fileName={selectedImage.name}
					onClose={() => setSelectedImage(null)}
				/>
			)}
			{selectedPDF && (
				<PDFViewerModal
					fileUrl={selectedPDF.url}
					fileName={selectedPDF.name}
					onClose={() => {
						URL.revokeObjectURL(selectedPDF.url);
						setSelectedPDF(null);
					}}
				/>
			)}
			{selectedExcel && (
				<ExcelViewerModal
					fileUrl={selectedExcel.url}
					fileName={selectedExcel.name}
					onClose={() => {
						URL.revokeObjectURL(selectedExcel.url);
						setSelectedExcel(null);
					}}
				/>
			)}
			{selectedWord && (
				<WordViewerModal
					fileUrl={selectedWord.url}
					fileName={selectedWord.name}
					onClose={() => {
						URL.revokeObjectURL(selectedWord.url);
						setSelectedWord(null);
					}}
				/>
			)}
		</div>
	);
};
