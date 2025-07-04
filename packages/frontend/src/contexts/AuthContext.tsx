import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to all requests if available
axios.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Check for existing token on mount
	useEffect(() => {
		const storedToken = localStorage.getItem(TOKEN_KEY);
		if (storedToken) {
			// Verify token and get user info
			axios.get('/auth/me')
				.then(response => {
					setUser(response.data.user);
					setToken(storedToken);
				})
				.catch(() => {
					// Token is invalid, clear it
					localStorage.removeItem(TOKEN_KEY);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (idToken: string) => {
		try {
			const response = await axios.post('/auth/google', { idToken });
			const { token, user } = response.data;
			
			localStorage.setItem(TOKEN_KEY, token);
			setToken(token);
			setUser(user);
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		token,
		loading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};