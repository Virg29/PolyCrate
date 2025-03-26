import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api.service';
import { authService } from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';
import { UserProjects } from '../components/UserProjects';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { RegisterUserModal } from '../components/RegisterUserModal';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';
import { ImageCarousel } from '../components/ImageCarousel';
import styles from './ProjectsPage.module.css';

interface ProjectVersion {
	files: {
		id: string;
		name: string;
		mime_type: string;
	}[];
}

interface Project {
	id: string;
	name: string;
	description: string;
	created_at: string;
	creator: {
		id: string;
		name: string;
	};
	collaborators: any[];
	versions: ProjectVersion[];
	tags: string[];
}

const ITEMS_PER_PAGE = 20;

const ProjectsPage = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const navigate = useNavigate();
	const userInfo = authService.getUserInfo();
	const { theme, toggleTheme } = useTheme();

	const canCreateProject =
		userInfo?.role === 'admin' || userInfo?.role === 'maker';
	const isAdmin = userInfo?.role === 'admin';

	const fetchProjects = useCallback(
		async (query: string, page: number, abortSignal?: AbortSignal) => {
			try {
				const isFirstPage = page === 0;
				if (isFirstPage) {
					setIsLoading(true);
				} else {
					setIsLoadingMore(true);
				}
				setError(null);

				const response = await apiClient.get('/feed/projects', {
					params: {
						search: query || undefined,
						fields: 'name;description',
						page,
						pageSize: ITEMS_PER_PAGE,
					},
					signal: abortSignal,
				});

				const newProjects = response.data.list || [];
				setHasMore(newProjects.length === ITEMS_PER_PAGE);

				if (isFirstPage) {
					setProjects(newProjects);
				} else {
					setProjects((prev) => [...prev, ...newProjects]);
				}
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					setError('Failed to load projects. Please try again.');
					console.error('Error fetching projects:', err);
				}
			} finally {
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[],
	);

	const loadMore = useCallback(() => {
		if (!isLoadingMore && hasMore) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			fetchProjects(searchQuery, nextPage);
		}
	}, [currentPage, fetchProjects, hasMore, isLoadingMore, searchQuery]);

	const handleScroll = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, clientHeight, scrollHeight } =
				event.currentTarget;
			if (scrollHeight - scrollTop <= clientHeight * 1.5) {
				loadMore();
			}
		},
		[loadMore],
	);

	useEffect(() => {
		const abortController = new AbortController();

		const timer = setTimeout(() => {
			setCurrentPage(0);
			fetchProjects(searchQuery, 0, abortController.signal);
		}, 300);

		return () => {
			clearTimeout(timer);
			abortController.abort();
		};
	}, [searchQuery, fetchProjects]);

	const handleSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(event.target.value);
		},
		[],
	);

	const handleLogout = () => {
		authService.logout();
		navigate('/', { replace: true });
	};

	const handleCreateProject = () => {
		setIsCreateModalOpen(true);
	};

	const handleCreateSuccess = () => {
		fetchProjects(searchQuery, 0);
	};

	const handleRegisterUser = () => {
		setShowRegisterModal(true);
	};

	const handleProjectClick = (projectId: string) => {
		setSelectedProjectId(projectId);
	};

	return (
		<div className={styles.pageContainer}>
			<aside className={styles.sidebar}>
				<UserProjects />
			</aside>

			<main className={styles.mainContent}>
				<header className={styles.header}>
					<div className={styles.headerContent}>
						<div className={styles.searchContainer}>
							<input
								type="text"
								placeholder="Search projects..."
								value={searchQuery}
								onChange={handleSearchChange}
								className={styles.searchInput}
							/>
						</div>
						<div className={styles.userSection}>
							<span className={styles.userName}>
								{userInfo?.name}
							</span>
							<button
								onClick={toggleTheme}
								className={styles.themeToggle}
							>
								{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
							</button>
							{isAdmin && (
								<button
									onClick={handleRegisterUser}
									className={styles.newProjectButton}
								>
									Register User
								</button>
							)}
							{canCreateProject && (
								<button
									onClick={handleCreateProject}
									className={styles.newProjectButton}
								>
									<span className={styles.plusIcon}>+</span>
									New Project
								</button>
							)}
							<button
								onClick={handleLogout}
								className={styles.logoutButton}
							>
								Logout
							</button>
						</div>
					</div>
				</header>

				<div className={styles.projectsList} onScroll={handleScroll}>
					{error ? (
						<div className={styles.error}>{error}</div>
					) : projects.length === 0 && !isLoading ? (
						<div className={styles.empty}>No projects found</div>
					) : (
						<>
							{projects.map((project) => (
								<div
									key={project.id}
									className={styles.projectCard}
									onClick={() =>
										handleProjectClick(project.id)
									}
								>
									<div className={styles.projectImage}>
										{project.versions?.[0]?.files ? (
											<ImageCarousel
												files={
													project.versions[0].files
												}
											/>
										) : (
											<div className={styles.noImages}>
												No images
											</div>
										)}
									</div>
									<div className={styles.projectInfo}>
										<h3>{project.name}</h3>
										<p>{project.description}</p>
										{project.tags &&
											project.tags.length > 0 && (
												<div
													className={styles.tagsList}
												>
													{project.tags.map(
														(tag, index) => (
															<span
																key={index}
																className={
																	styles.tag
																}
															>
																{tag}
															</span>
														),
													)}
												</div>
											)}
									</div>
									<div className={styles.projectMeta}>
										<span>
											Created by: {project.creator.name}
										</span>
										<span>
											Collaborators:{' '}
											{project.collaborators.length}
										</span>
										<span>
											Created:{' '}
											{new Date(
												project.created_at,
											).toLocaleDateString()}
										</span>
									</div>
								</div>
							))}
							{isLoadingMore && (
								<div className={styles.loading}>
									Loading more projects...
								</div>
							)}
							{!hasMore && projects.length > 0 && (
								<div className={styles.noMore}>
									No more projects to load
								</div>
							)}
						</>
					)}
				</div>
			</main>

			<CreateProjectModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={handleCreateSuccess}
			/>

			{showRegisterModal && (
				<RegisterUserModal
					onClose={() => setShowRegisterModal(false)}
				/>
			)}

			{selectedProjectId && (
				<ProjectDetailsModal
					projectId={selectedProjectId}
					onClose={() => setSelectedProjectId(null)}
				/>
			)}
		</div>
	);
};

export default ProjectsPage;
