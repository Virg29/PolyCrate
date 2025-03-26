import React, { useCallback, useState, useEffect, useRef } from 'react';
import styles from './FileUpload.module.css';

interface FileWithPreview extends File {
	id: string;
	preview?: string;
}

interface FileUploadProps {
	onFilesChange: (files: FileWithPreview[]) => void;
	maxFileSize?: number; // in bytes
	accept?: string;
	existingFiles?: FileWithPreview[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
	onFilesChange,
	maxFileSize = 5 * 1024 * 1024, // 5MB default
	accept = '*/*',
	existingFiles,
}) => {
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const isInternalUpdate = useRef(false);

	// Update local files when existingFiles changes from parent
	useEffect(() => {
		// Only update if this is not triggered by our own internal update
		if (existingFiles !== undefined && !isInternalUpdate.current) {
			setFiles(existingFiles);
		}
		// Reset the flag
		isInternalUpdate.current = false;
	}, [existingFiles]);

	// Call onFilesChange when files change internally
	useEffect(() => {
		// Set the flag to indicate this is our own update
		isInternalUpdate.current = true;
		onFilesChange(files);
	}, [files, onFilesChange]);

	const getMimeType = (file: File): string => {
		// If the file has a type, use it
		if (file.type) {
			return file.type;
		}

		// If no type is detected and no extension, treat as binary
		if (!file.name.includes('.')) {
			return 'application/octet-stream';
		}

		// Try to guess MIME type from extension
		const extension = file.name.split('.').pop()?.toLowerCase();
		const mimeTypes: { [key: string]: string } = {
			txt: 'text/plain',
			pdf: 'application/pdf',
			doc: 'application/msword',
			docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			md: 'text/markdown',
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			gif: 'image/gif',
			webp: 'image/webp',
			svg: 'image/svg+xml',
			stl: 'model/stl',
			obj: 'model/obj',
			gltf: 'model/gltf-binary',
			blend: 'application/x-blender',
		};

		return extension && extension in mimeTypes
			? mimeTypes[extension]
			: 'application/octet-stream';
	};

	const createFileWithPreview = async (
		file: File,
	): Promise<FileWithPreview> => {
		const id = Math.random().toString(36).substring(2);
		const mimeType = getMimeType(file);

		// Create a new File object with the desired MIME type
		const fileWithCustomType = new File([file], file.name, {
			type: mimeType,
		}) as FileWithPreview;

		// Add the ID
		fileWithCustomType.id = id;

		// Generate preview for images
		if (mimeType.startsWith('image/')) {
			const reader = new FileReader();
			const preview = await new Promise<string>((resolve) => {
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(file);
			});
			fileWithCustomType.preview = preview;
		}

		return fileWithCustomType;
	};

	const handleFiles = async (incomingFiles: FileList | File[]) => {
		const newFiles = await Promise.all(
			Array.from(incomingFiles)
				.filter((file) => file.size <= maxFileSize)
				.map(createFileWithPreview),
		);

		setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		handleFiles(e.dataTransfer.files);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
		},
		[],
	);

	const handlePaste = useCallback((e: ClipboardEvent) => {
		const items = e.clipboardData?.items;
		if (!items) return;

		const files = Array.from(items)
			.filter((item) => item.kind === 'file')
			.map((item) => item.getAsFile())
			.filter((file): file is File => file !== null);

		if (files.length > 0) {
			handleFiles(files);
		}
	}, []);

	const handleRemoveFile = (fileId: string) => {
		setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
	};

	useEffect(() => {
		document.addEventListener('paste', handlePaste);
		return () => {
			document.removeEventListener('paste', handlePaste);
		};
	}, [handlePaste]);

	// Cleanup previews on unmount
	useEffect(() => {
		return () => {
			files.forEach((file) => {
				if (file.preview) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
	}, []);

	return (
		<div className={styles.uploadContainer}>
			<div
				className={`${styles.dropzone} ${
					isDragging ? styles.dragging : ''
				}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<input
					type="file"
					onChange={(e) =>
						handleFiles(e.target.files || new FileList())
					}
					className={styles.fileInput}
					multiple
					accept={accept}
				/>
				<div className={styles.uploadMessage}>
					<span className={styles.icon}>📁</span>
					<p>Drag & drop files here or click to select</p>
					<p className={styles.subtitle}>
						You can also paste files or screenshots
					</p>
				</div>
			</div>

			{files.length > 0 && (
				<div className={styles.previewContainer}>
					{files.map((file) => (
						<div key={file.id} className={styles.previewItem}>
							{file.preview ? (
								<div className={styles.imagePreview}>
									<img src={file.preview} alt={file.name} />
								</div>
							) : (
								<div className={styles.fileIcon}>
									<span>📄</span>
								</div>
							)}
							<div className={styles.fileInfo}>
								<span className={styles.fileName}>
									{file.name}
								</span>
								<span className={styles.fileSize}>
									{(file.size / 1024).toFixed(1)} KB
								</span>
							</div>
							<button
								className={styles.removeButton}
								onClick={() => handleRemoveFile(file.id)}
							>
								×
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
