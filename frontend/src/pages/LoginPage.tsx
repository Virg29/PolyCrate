import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { authService } from '../services/auth.service';

interface LocationState {
	from?: {
		pathname: string;
	};
}

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Redirect if user is already authenticated
		if (authService.isAuthenticated()) {
			const locationState = location.state as LocationState;
			const destination = locationState?.from?.pathname || '/projects';
			navigate(destination, { replace: true });
		}
	}, [navigate, location]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			await authService.login({ email, password });
			const locationState = location.state as LocationState;
			const destination = locationState?.from?.pathname || '/projects';
			navigate(destination, { replace: true });
		} catch (err) {
			setError('Invalid email or password');
			console.error('Login error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	// Don't render the form if already authenticated
	if (authService.isAuthenticated()) {
		return null;
	}

	return (
		<div className={styles.loginContainer}>
			<form className={styles.loginForm} onSubmit={handleLogin}>
				<h2>Login</h2>
				{error && <div className={styles.error}>{error}</div>}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
				/>
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Logging in...' : 'Log In'}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
