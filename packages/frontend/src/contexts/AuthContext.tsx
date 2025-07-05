import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

interface AuthContextType {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is already authenticated on app load
		const checkAuthStatus = async () => {
			const token = localStorage.getItem("authToken");
			if (token) {
				try {
					// Verify token with backend
					const response = await fetch("/api/auth/verify", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.ok) {
						const jwtPayload = await response.json();
						// Extract user data from JWT payload
						const userData = jwtPayload.user;
						setUser(userData);
					} else {
						// Token is invalid, remove it
						localStorage.removeItem("authToken");
					}
				} catch (error) {
					console.error("Auth verification failed:", error);
					localStorage.removeItem("authToken");
				}
			}
			setIsLoading(false);
		};

		checkAuthStatus();
	}, []);

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = async () => {
		try {
			// Call server logout endpoint
			const token = localStorage.getItem("authToken");
			if (token) {
				await fetch("/api/auth/logout", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			// Always clear local state
			setUser(null);
			localStorage.removeItem("authToken");
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
