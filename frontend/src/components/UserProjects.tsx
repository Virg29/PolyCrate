import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/api.service';
import { authService } from '../services/auth.service';
import { Project } from '../types/project.types';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import styles from './UserProjects.module.css';

const ITEMS_PER_PAGE = 20;

export const UserProjects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [currentPage, setCurrentPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const listRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);

	const userInfo = authService.getUserInfo();

	const fetchProjects = useCallback(
		async (page: number, checkAfterLoad = true) => {
			if (loadingRef.current) return;
			loadingRef.current = true;

			try {
				if (page === 0) {
					setIsLoading(true);
				}

				const response = await apiClient.get('/feed/projects', {
					params: {
						exact_match_filter: `creator_id:${userInfo?.id}`,
						page,
						pageSize: ITEMS_PER_PAGE,
					},
				});

				const newProjects = response.data.list || [];
				const hasMoreItems = newProjects.length === ITEMS_PER_PAGE;
				setHasMore(hasMoreItems);

				setProjects((prev) =>
					page === 0 ? newProjects : [...prev, ...newProjects],
				);

				if (checkAfterLoad && hasMoreItems) {
					// Check if we need more items after DOM update
					setTimeout(() => {
						if (listRef.current) {
							const { clientHeight, scrollHeight } =
								listRef.current;
							if (clientHeight >= scrollHeight) {
								setCurrentPage((prev) => prev + 1);
								fetchProjects(page + 1, true);
							}
						}
					}, 100);
				}
			} catch (error: any) {
				console.error('Error fetching user projects:', error);
			} finally {
				loadingRef.current = false;
				setIsLoading(false);
			}
		},
		[userInfo?.id],
	);

	const handleScroll = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, clientHeight, scrollHeight } =
				event.currentTarget;
			const scrollThreshold = 50; // pixels from bottom

			if (
				scrollHeight - (scrollTop + clientHeight) <= scrollThreshold &&
				!loadingRef.current &&
				hasMore
			) {
				setCurrentPage((prev) => prev + 1);
				fetchProjects(currentPage + 1, false);
			}
		},
		[currentPage, fetchProjects, hasMore],
	);

	useEffect(() => {
		fetchProjects(0, true);
	}, [fetchProjects]);

	const handleProjectClick = (projectId: string) => {
		setSelectedProjectId(projectId);
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>My Projects</h2>
			<div
				className={styles.projectList}
				onScroll={handleScroll}
				ref={listRef}
			>
				{isLoading && currentPage === 0 ? (
					<div className={styles.loading}>Loading projects...</div>
				) : projects.length === 0 ? (
					<div className={styles.emptyState}>No projects found</div>
				) : (
					<>
						{projects.map((project) => (
							<div
								key={project.id}
								className={styles.projectItem}
								onClick={() => handleProjectClick(project.id)}
								role="button"
								tabIndex={0}
							>
								<div className={styles.projectName}>
									{project.name}
								</div>
							</div>
						))}
						{loadingRef.current && (
							<div className={styles.loading}>
								Loading more...
							</div>
						)}
						{!hasMore && projects.length > 0 && (
							<div className={styles.noMore}>
								No more projects
							</div>
						)}
					</>
				)}
			</div>
			{selectedProjectId && (
				<ProjectDetailsModal
					projectId={selectedProjectId}
					onClose={() => setSelectedProjectId(null)}
				/>
			)}
		</div>
	);
};
