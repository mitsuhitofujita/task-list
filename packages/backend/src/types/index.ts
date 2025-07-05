export interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

export interface JWTPayload {
	user: User;
	iat?: number;
	exp?: number;
}
