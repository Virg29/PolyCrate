import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useLocation,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExamplePage from './pages/ExamplePage';
import ProjectsPage from './pages/ProjectsPage';
import { authService } from './services/auth.service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();

	if (!authService.isAuthenticated()) {
		// Redirect to login while preserving the attempted URL
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route
					path="/example"
					element={
						<ProtectedRoute>
							<ExamplePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/projects"
					element={
						<ProtectedRoute>
							<ProjectsPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
};

export default AppRouter;
