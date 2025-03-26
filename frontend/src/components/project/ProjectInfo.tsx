import { FC, useState, KeyboardEvent } from 'react';
import { Project } from '../../types/project.types';
import styles from './ProjectInfo.module.css';

interface ProjectInfoProps {
	project: Project;
	onProjectChange: (updatedProject: Project) => void;
	canEdit: boolean;
}

export const ProjectInfo: FC<ProjectInfoProps> = ({
	project,
	onProjectChange,
	canEdit,
}) => {
	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(project.description);
	const [tagsInput, setTagsInput] = useState('');
	const [tags, setTags] = useState<string[]>(project.tags || []);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		onProjectChange({ ...project, name: e.target.value });
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescription(e.target.value);
		onProjectChange({ ...project, description: e.target.value });
	};

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			const newTags = [...tags, trimmedTag];
			setTags(newTags);
			onProjectChange({ ...project, tags: newTags });
			setTagsInput('');
		}
	};

	const removeTag = (tagToRemove: string) => {
		const newTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(newTags);
		onProjectChange({ ...project, tags: newTags });
	};

	const handleTagsKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag(tagsInput);
		} else if (e.key === 'Backspace' && !tagsInput && tags.length > 0) {
			removeTag(tags[tags.length - 1]);
		}
	};

	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.endsWith(',')) {
			addTag(value.slice(0, -1));
		} else {
			setTagsInput(value);
		}
	};

	return (
		<div className={styles.projectInfo}>
			<div className={styles.header}>
				<input
					type="text"
					value={name}
					onChange={handleNameChange}
					className={styles.input}
					disabled={!canEdit}
				/>
				<textarea
					value={description}
					onChange={handleDescriptionChange}
					className={styles.textarea}
					disabled={!canEdit}
				/>
				<div className={styles.tagsContainer}>
					<label className={styles.label}>Tags</label>
					<div
						className={`${styles.tagsWrapper} ${
							!canEdit ? styles.disabled : ''
						}`}
					>
						{tags.map((tag) => (
							<span key={tag} className={styles.tag}>
								{tag}
								{canEdit && (
									<button
										onClick={() => removeTag(tag)}
										className={styles.tagRemove}
									>
										×
									</button>
								)}
							</span>
						))}
						{canEdit && (
							<input
								type="text"
								value={tagsInput}
								onChange={handleTagsChange}
								onKeyDown={handleTagsKeyDown}
								placeholder={
									tags.length === 0
										? 'Enter tags (press comma or Enter to add)'
										: ''
								}
								className={styles.tagInput}
							/>
						)}
					</div>
				</div>
			</div>
			<div className={styles.projectDetails}>
				<div className={styles.detailsGrid}>
					<div className={styles.detailItem}>
						<span className={styles.label}>Created by</span>
						<span>{project.creator.name}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.label}>Created</span>
						<span>
							{new Date(project.created_at).toLocaleDateString()}
						</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.label}>Total versions</span>
						<span>{project._count.versions}</span>
					</div>
					<div className={styles.detailItem}>
						<span className={styles.label}>
							Total collaborators
						</span>
						<span>{project._count.collaborators}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
