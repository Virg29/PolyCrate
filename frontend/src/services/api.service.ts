import axios, { AxiosError } from 'axios';
import { authService } from './auth.service';

declare global {
	interface Window {
		ENV?: {
			VITE_API_URL?: string;
		};
	}
}

const API_URL =
	window.ENV?.VITE_API_URL ||
	import.meta.env.VITE_API_URL ||
	'http://127.0.0.1:3000';

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
	(config) => {
		const token = authService.getToken();
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor
apiClient.interceptors.response.use(
	(response) => {
		// Expose Content-Disposition header
		if (response.headers['content-disposition']) {
			response.headers['content-disposition'] =
				response.headers['content-disposition'];
		}
		return response;
	},
	async (error: AxiosError) => {
		// Handle 401 errors (Unauthorized)
		if (error.response?.status === 401) {
			// If the token is invalid or expired, clear auth state and redirect to login
			authService.logout();
			window.location.replace('/');
			return Promise.reject(error);
		}

		// Handle network errors or server unavailable
		if (!error.response) {
			console.error('Network error or server unavailable');
			return Promise.reject(
				new Error('Network error or server unavailable'),
			);
		}

		return Promise.reject(error);
	},
);

export interface Role {
	id: string;
	name: string;
}

export const getRoles = async (): Promise<Role[]> => {
	const response = await apiClient.get<{ list: Role[] }>('/roles');
	return response.data.list;
};

export { apiClient };
