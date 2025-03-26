import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../services/api.service';
import styles from './UserSearch.module.css';

interface User {
	id: string;
	name: string;
	email: string;
}

interface UserSearchProps {
	onUserSelect: (user: User) => void;
	currentCollaboratorIds: string[];
}

export const UserSearch: React.FC<UserSearchProps> = ({
	onUserSelect,
	currentCollaboratorIds,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const searchUsers = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setUsers([]);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);
				const response = await apiClient.get('/users', {
					params: {
						search: query,
						fields: 'name;email',
						page: 0,
						pageSize: 5,
					},
				});

				// Filter out users who are already collaborators
				const filteredUsers = response.data.list.filter(
					(user: User) => !currentCollaboratorIds.includes(user.id),
				);

				setUsers(filteredUsers);
			} catch (err) {
				setError('Failed to search users');
				console.error('Error searching users:', err);
			} finally {
				setIsLoading(false);
			}
		},
		[currentCollaboratorIds],
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery) {
				searchUsers(searchQuery);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, searchUsers]);

	return (
		<div className={styles.container}>
			<div className={styles.searchInputContainer}>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search users by name or email..."
					className={styles.searchInput}
				/>
			</div>

			{isLoading && <div className={styles.loading}>Searching...</div>}
			{error && <div className={styles.error}>{error}</div>}

			{users.length > 0 && (
				<div className={styles.usersList}>
					{users.map((user) => (
						<div
							key={user.id}
							className={styles.userItem}
							onClick={() => {
								onUserSelect(user);
								setSearchQuery('');
								setUsers([]);
							}}
						>
							<div className={styles.userName}>{user.name}</div>
							<div className={styles.userEmail}>{user.email}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
