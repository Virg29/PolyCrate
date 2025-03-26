import { FC, FormEvent, useState, useEffect } from 'react';
import { FileUpload } from '../FileUpload';
import { FileWithPreview, Version } from '../../types/project.types';
import { apiClient } from '../../services/api.service';
import styles from './VersionForm.module.css';

interface VersionFormProps {
	onSubmit: (data: {
		version_tag: string;
		description: string;
		files: FileWithPreview[];
	}) => Promise<void>;
	isSubmitting: boolean;
	previousVersions?: Version[];
	projectId?: string;
	versionCreated?: boolean;
}

export const VersionForm: FC<VersionFormProps> = ({
	onSubmit,
	isSubmitting,
	previousVersions = [],
	projectId,
	versionCreated = false,
}) => {
	const [formData, setFormData] = useState({
		version_tag: '',
		description: '',
	});
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
	const [wasSubmitting, setWasSubmitting] = useState(false);

	// Track isSubmitting changes to detect successful form submission
	useEffect(() => {
		// If was submitting and now it's not, the operation completed
		if (wasSubmitting && !isSubmitting) {
			// Reset the form
			setFormData({ version_tag: '', description: '' });
			setFiles([]);
		}
		// Update the tracking state
		setWasSubmitting(isSubmitting);
	}, [isSubmitting]);

	// Reset form when versionCreated changes to true
	useEffect(() => {
		if (versionCreated) {
			console.log('Version created, resetting form');
			setFormData({ version_tag: '', description: '' });
			setFiles([]);
		}
	}, [versionCreated]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await onSubmit({
			...formData,
			files,
		});
		// Form will be reset in useEffect when isSubmitting changes to false
	};

	const handleUsePrevious = async () => {
		if (!projectId || previousVersions.length === 0) return;

		try {
			setIsLoadingPrevious(true);
			const latestVersion = previousVersions[0]; // Assuming versions are sorted newest first

			// Get existing filenames to avoid duplicates
			const existingFilenames = new Set(files.map((file) => file.name));

			// For each file in the previous version that isn't already in our list
			if (latestVersion.files) {
				const newFiles = await Promise.all(
					latestVersion.files
						.filter((file) => !existingFilenames.has(file.name))
						.map(async (file) => {
							try {
								const response = await apiClient.get(
									`/files/${file.id}/download`,
									{
										responseType: 'blob',
									},
								);

								// Create a File object
								const fileObject = new File(
									[response.data],
									file.name,
									{ type: file.mime_type },
								) as FileWithPreview;

								// Add required properties for FileWithPreview
								fileObject.id = Math.random()
									.toString(36)
									.substring(2);

								// Generate preview for images
								if (file.mime_type.startsWith('image/')) {
									const reader = new FileReader();
									const preview = await new Promise<string>(
										(resolve) => {
											reader.onloadend = () =>
												resolve(
													reader.result as string,
												);
											reader.readAsDataURL(response.data);
										},
									);
									fileObject.preview = preview;
								}

								return fileObject;
							} catch (error) {
								console.error(
									`Error downloading file ${file.name}:`,
									error,
								);
								return null;
							}
						}),
				);

				// Add the successfully downloaded files to our existing files
				setFiles((prev) => [
					...prev,
					...(newFiles.filter(Boolean) as FileWithPreview[]),
				]);
			}
		} catch (error) {
			console.error('Error loading previous version files:', error);
		} finally {
			setIsLoadingPrevious(false);
		}
	};

	const hasPreviousVersions = previousVersions && previousVersions.length > 0;

	return (
		<div className={styles.newVersionSection}>
			<form className={styles.newVersionForm} onSubmit={handleSubmit}>
				<div className={styles.formInputs}>
					<input
						type="text"
						placeholder="Version tag (e.g., v1.0.0)"
						value={formData.version_tag}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								version_tag: e.target.value,
							}))
						}
						required
						disabled={isSubmitting}
					/>
					<textarea
						placeholder="Version description or changelog"
						value={formData.description}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						disabled={isSubmitting}
						rows={2}
					/>
					<div className={styles.fileUploadContainer}>
						<FileUpload
							onFilesChange={setFiles}
							maxFileSize={5 * 1024 * 1024} // 5MB
							existingFiles={files}
						/>
						{hasPreviousVersions && (
							<button
								type="button"
								className={styles.usePreviousButton}
								onClick={handleUsePrevious}
								disabled={isSubmitting || isLoadingPrevious}
							>
								{isLoadingPrevious
									? 'Loading...'
									: 'Use Previous'}
							</button>
						)}
					</div>
				</div>
				<button
					type="submit"
					className={styles.createVersionButton}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Creating...' : '+ Add Version'}
				</button>
			</form>
		</div>
	);
};
