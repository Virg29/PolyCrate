import { FC } from 'react';
import styles from './CollaboratorList.module.css';
import { UserSearch } from './UserSearch';

interface Collaborator {
	id: string;
	name: string;
	email: string;
}

interface CollaboratorListProps {
	collaborators: Collaborator[];
	onCollaboratorAdd: (collaborator: Collaborator) => void;
	canEdit: boolean;
}

export const CollaboratorList: FC<CollaboratorListProps> = ({
	collaborators,
	onCollaboratorAdd,
	canEdit,
}) => {
	return (
		<div className={styles.collaboratorsSection}>
			<h3>Collaborators</h3>
			{canEdit && (
				<UserSearch
					onUserSelect={onCollaboratorAdd}
					currentCollaboratorIds={collaborators.map((c) => c.id)}
				/>
			)}
			<div className={styles.collaboratorsList}>
				{collaborators.map((collaborator) => (
					<div key={collaborator.id} className={styles.collaborator}>
						<div className={styles.collaboratorInfo}>
							<span className={styles.collaboratorName}>
								{collaborator.name}
							</span>
							<span className={styles.collaboratorEmail}>
								{collaborator.email}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
