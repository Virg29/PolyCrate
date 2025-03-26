import React, { useState } from 'react';
import { apiClient } from '../services/api.service';
import styles from './CreateProjectModal.module.css';

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [tagsInput, setTagsInput] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			// Convert tagsInput to array (split by comma, trim spaces, filter empty)
			const tags = tagsInput
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			await apiClient.put('/projects', {
				name,
				description,
				tags,
				collaboratorIds: [],
			});
			onSuccess();
			onClose();
			setName('');
			setDescription('');
			setTagsInput('');
		} catch (err) {
			setError('Failed to create project. Please try again.');
			console.error('Error creating project:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h2>Create New Project</h2>
				{error && <div className={styles.error}>{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="name">Project Name</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={isSubmitting}
							placeholder="Enter project name"
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="description">Description</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							disabled={isSubmitting}
							placeholder="Enter project description"
							rows={4}
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="tags">Tags (comma separated)</label>
						<input
							id="tags"
							type="text"
							value={tagsInput}
							onChange={(e) => setTagsInput(e.target.value)}
							disabled={isSubmitting}
							placeholder="e.g. web, app, backend"
						/>
					</div>
					<div className={styles.buttonGroup}>
						<button
							type="button"
							onClick={onClose}
							className={styles.cancelButton}
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating...' : 'Create Project'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
