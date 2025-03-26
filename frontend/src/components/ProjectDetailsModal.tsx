import { useState, useEffect } from 'react';
import { apiClient } from '../services/api.service';
import { authService } from '../services/auth.service';
import { Project, FileWithPreview } from '../types/project.types';
import { ProjectInfo } from './project/ProjectInfo';
import { CollaboratorList } from './project/CollaboratorList';
import { VersionForm } from './project/VersionForm';
import { VersionList } from './project/VersionList';
import styles from './ProjectDetailsModal.module.css';

interface ProjectDetailsModalProps {
	projectId: string;
	onClose: () => void;
}

export const ProjectDetailsModal = ({
	projectId,
	onClose,
}: ProjectDetailsModalProps) => {
	const [project, setProject] = useState<Project | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [versionCreated, setVersionCreated] = useState(false);

	const userInfo = authService.getUserInfo();
	const canEdit = userInfo?.role === 'admin' || userInfo?.role === 'maker';

	// Reset the versionCreated flag after it's consumed
	useEffect(() => {
		if (versionCreated) {
			// Reset after a short delay to ensure it's consumed by child components
			const timer = setTimeout(() => {
				setVersionCreated(false);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [versionCreated]);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				setError(null);
				setIsLoading(true);
				const response = await apiClient.get(`/projects/${projectId}`);
				setProject(response.data);
			} catch (err: any) {
				setError(
					err.response?.data?.message ||
						'Failed to load project details',
				);
				console.error('Error fetching project:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProject();
	}, [projectId]);

	const handleProjectChange = (updatedProject: Project) => {
		setProject(updatedProject);
	};

	const handleSave = async () => {
		if (!project) return;

		setIsSubmitting(true);
		try {
			await apiClient.put('/projects', {
				id: project.id,
				name: project.name,
				description: project.description,
				collaboratorIds: project.collaborators.map((c) => c.id),
				tags: project.tags,
			});
			onClose();
		} catch (err) {
			setError('Failed to save project details');
			console.error('Error saving project:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCreateVersion = async (data: {
		version_tag: string;
		description: string;
		files: FileWithPreview[];
	}) => {
		if (!project) return;

		setIsSubmitting(true);
		try {
			const filesData = await Promise.all(
				data.files.map(async (file) => ({
					name: file.name,
					description: '',
					mime_type: file.type,
					file_type: file.type.split('/')[0],
					content: await new Promise<string>((resolve) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							const base64String = reader.result as string;
							resolve(base64String.split(',')[1]);
						};
						reader.readAsDataURL(file);
					}),
				})),
			);

			await apiClient.post('/versions', {
				project_id: project.id,
				version_tag: data.version_tag,
				description: data.description,
				files: filesData,
			});

			// Set flag to indicate successful version creation
			setVersionCreated(true);

			// Refresh project data using new endpoint
			const response = await apiClient.get(`/projects/${projectId}`);
			setProject(response.data);
		} catch (err: any) {
			setError('Failed to create version');
			console.error('Error creating version:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCollaboratorAdd = (collaborator: {
		id: string;
		name: string;
		email: string;
	}) => {
		if (!project) return;

		setProject({
			...project,
			collaborators: [...project.collaborators, collaborator],
		});
	};

	if (isLoading) {
		return (
			<div className={styles.modalOverlay}>
				<div className={styles.modalContent}>
					<div className={styles.loading}>
						Loading project details...
					</div>
				</div>
			</div>
		);
	}

	if (error || !project) {
		return (
			<div className={styles.modalOverlay}>
				<div className={styles.modalContent}>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
					<div className={styles.error}>
						{error || 'Project not found'}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>

				<div className={styles.modalLayout}>
					<div className={styles.leftPanel}>
						<ProjectInfo
							project={project}
							onProjectChange={handleProjectChange}
							canEdit={canEdit}
						/>
						<CollaboratorList
							collaborators={project.collaborators}
							onCollaboratorAdd={handleCollaboratorAdd}
							canEdit={canEdit}
						/>
						{canEdit && (
							<div className={styles.buttonGroup}>
								<button
									onClick={handleSave}
									className={styles.saveButton}
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Saving...' : 'Save'}
								</button>
							</div>
						)}
					</div>

					<div className={styles.rightPanel}>
						{canEdit && (
							<VersionForm
								onSubmit={handleCreateVersion}
								isSubmitting={isSubmitting}
								previousVersions={project.versions}
								projectId={project.id}
								versionCreated={versionCreated}
							/>
						)}
						<VersionList versions={project.versions} />
					</div>
				</div>
			</div>
		</div>
	);
};
