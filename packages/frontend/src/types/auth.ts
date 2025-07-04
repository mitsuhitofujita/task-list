export interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (idToken: string) => Promise<void>;
	logout: () => void;
}

export interface GoogleCredentialResponse {
	credential?: string;
	select_by?: string;
}