import { apiClient } from './api.service';

export interface UserInfo {
	id: string;
	name: string;
	role: string;
}

export interface LoginResponse {
	access_token: string;
	userInfo: UserInfo;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

class AuthService {
	private static TOKEN_KEY = 'auth_token';
	private static USER_INFO_KEY = 'user_info';

	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>(
			'/auth/login',
			credentials,
		);
		const { access_token, userInfo } = response.data;
		this.setToken(access_token);
		this.setUserInfo(userInfo);
		return response.data;
	}

	logout(): void {
		localStorage.removeItem(AuthService.TOKEN_KEY);
		localStorage.removeItem(AuthService.USER_INFO_KEY);
	}

	getToken(): string | null {
		const token = localStorage.getItem(AuthService.TOKEN_KEY);
		if (!token) return null;

		try {
			// Basic JWT validation (check if token is well-formed)
			const [header, payload, signature] = token.split('.');
			if (!header || !payload || !signature) {
				this.logout();
				return null;
			}

			// Check if token is expired
			const decodedPayload = JSON.parse(atob(payload));
			if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
				this.logout();
				return null;
			}

			return token;
		} catch (error) {
			this.logout();
			return null;
		}
	}

	getUserInfo(): UserInfo | null {
		const userInfo = localStorage.getItem(AuthService.USER_INFO_KEY);
		return userInfo ? JSON.parse(userInfo) : null;
	}

	private setToken(token: string): void {
		localStorage.setItem(AuthService.TOKEN_KEY, token);
	}

	private setUserInfo(userInfo: UserInfo): void {
		localStorage.setItem(
			AuthService.USER_INFO_KEY,
			JSON.stringify(userInfo),
		);
	}

	isAuthenticated(): boolean {
		return !!this.getToken() && !!this.getUserInfo();
	}
}

export const authService = new AuthService();
