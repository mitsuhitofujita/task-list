import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("authToken");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
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
