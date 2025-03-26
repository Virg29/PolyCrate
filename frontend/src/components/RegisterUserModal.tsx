import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient, type Role } from '../services/api.service';
import styles from './RegisterUserModal.module.css';

interface User {
	id: string;
	name: string;
	email: string;
	role?: {
		id: string;
		name: string;
	};
}

interface RegisterUserModalProps {
	onClose: () => void;
}

export const RegisterUserModal = ({ onClose }: RegisterUserModalProps) => {
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		password: '',
		role_id: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [roles, setRoles] = useState<Role[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentPage, setCurrentPage] = useState(0); // Changed to start from 0
	const [hasMore, setHasMore] = useState(true);
	const [pageSize] = useState(10);
	const observerTarget = useRef<HTMLDivElement>(null);

	const loadUsers = useCallback(
		async (page: number) => {
			try {
				const response = await apiClient.get<{
					list: User[];
					total: number;
				}>('/users', {
					params: {
						page,
						pageSize, // Changed from 'limit' to 'pageSize'
					},
				});

				const newUsers = response.data.list;
				const total = response.data.total;

				setUsers((prev) =>
					page === 0 ? newUsers : [...prev, ...newUsers],
				);
				setHasMore((page + 1) * pageSize < total); // Adjusted for zero-based page
				return response.data;
			} catch (err: any) {
				console.error('Error loading users:', err);
				setError(err.response?.data?.message || 'Failed to load users');
				return null;
			}
		},
		[pageSize],
	);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					setIsLoadingMore(true);
					loadUsers(currentPage + 1).then(() => {
						setCurrentPage((prev) => prev + 1);
						setIsLoadingMore(false);
					});
				}
			},
			{ threshold: 0.5 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => observer.disconnect();
	}, [hasMore, isLoadingMore, currentPage, loadUsers]);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchInitialData = async () => {
			try {
				const [rolesResponse] = await Promise.all([
					apiClient.get<Role[]>('/roles', {
						signal: abortController.signal,
					}),
				]);

				const rolesList = rolesResponse.data;
				if (!rolesList || rolesList.length === 0) {
					throw new Error('No roles available');
				}
				setRoles(rolesList);
				setFormData((prev) => ({
					...prev,
					role_id: rolesList[0].id,
				}));

				await loadUsers(0); // Changed from 1 to 0 for zero-based pagination
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					console.error('Error fetching data:', err);
					setError(
						err.message ||
							err.response?.data?.message ||
							'Failed to load data. Please try again.',
					);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialData();

		return () => {
			abortController.abort();
		};
	}, [loadUsers]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await apiClient.post('/auth/register', formData);
			// Reset page and reload users
			setCurrentPage(0);
			await loadUsers(0);
			setSuccess(true);
			// Reset form
			setFormData({
				email: '',
				name: '',
				password: '',
				role_id: roles[0]?.id || '',
			});
		} catch (err: any) {
			console.error('Error registering user:', err);
			setError(
				err.response?.data?.message ||
					'Failed to register user. Please try again.',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className={styles.modalOverlay}>
				<div className={styles.modalContent}>
					<h2>Loading...</h2>
				</div>
			</div>
		);
	}

	if (!isLoading && (!roles || roles.length === 0)) {
		return (
			<div className={styles.modalOverlay}>
				<div className={styles.modalContent}>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
					<h2>Error</h2>
					<div className={styles.error}>
						{error ||
							'No roles are available. Please try again later.'}
					</div>
					<div className={styles.buttonGroup}>
						<button
							onClick={onClose}
							className={styles.cancelButton}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.modalOverlay}>
			<div className={`${styles.modalContent} ${styles.splitLayout}`}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>

				<div className={styles.formSection}>
					<h2>Register New User</h2>
					{success ? (
						<div className={styles.success}>
							User registered successfully!
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							{error && (
								<div className={styles.error}>{error}</div>
							)}

							<div className={styles.formGroup}>
								<label htmlFor="name">Name:</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									disabled={isSubmitting}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="email">Email:</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									disabled={isSubmitting}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="password">Password:</label>
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									minLength={8}
									disabled={isSubmitting}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="role_id">Role:</label>
								<select
									id="role_id"
									name="role_id"
									value={formData.role_id}
									onChange={handleChange}
									required
									disabled={isSubmitting}
								>
									{roles.map((role) => (
										<option key={role.id} value={role.id}>
											{role.name}
										</option>
									))}
								</select>
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
									{isSubmitting
										? 'Registering...'
										: 'Register User'}
								</button>
							</div>
						</form>
					)}
				</div>

				<div className={styles.userListSection}>
					<h3>Registered Users</h3>
					<div className={styles.userList}>
						{users.map((user) => (
							<div key={user.id} className={styles.userItem}>
								<div className={styles.userName}>
									{user.name}
								</div>
								<div className={styles.userEmail}>
									{user.email}
								</div>
								<div className={styles.userRole}>
									{user.role?.name}
								</div>
							</div>
						))}
						<div
							ref={observerTarget}
							className={styles.loadingMore}
						>
							{isLoadingMore && 'Loading more...'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
