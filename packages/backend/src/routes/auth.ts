import type { FastifyInstance } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { firestoreService } from "../services/firestore";
import type { JWTPayload, User } from "../types";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
	process.env.GOOGLE_REDIRECT_URI ||
	"http://localhost:3000/auth/google/callback";

export default async function authRoutes(fastify: FastifyInstance) {
	const oAuth2Client = new OAuth2Client(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GOOGLE_REDIRECT_URI,
	);

	// Verify Google ID token from frontend
	fastify.post("/auth/google", async (request, reply) => {
		const { idToken } = request.body as { idToken: string };

		if (!idToken) {
			return reply.code(400).send({ error: "ID token is required" });
		}

		try {
			const ticket = await oAuth2Client.verifyIdToken({
				idToken,
				audience: GOOGLE_CLIENT_ID,
			});

			const payload = ticket.getPayload();
			if (!payload) {
				return reply.code(401).send({ error: "Invalid token" });
			}

			const user: User = {
				id: payload.sub,
				email: payload.email || "",
				name: payload.name || "",
				picture: payload.picture,
			};

			// Persist user to Firestore
			await firestoreService.createOrUpdateUser(user);

			// Generate JWT token
			const token = fastify.jwt.sign({ user } as JWTPayload);

			return reply.send({
				token,
				user,
			});
		} catch (error) {
			console.error("Google auth error:", error);
			return reply.code(401).send({ error: "Authentication failed" });
		}
	});

	// OAuth flow endpoint (optional, for server-side flow)
	fastify.get("/auth/google", async (_request, reply) => {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: "online",
			scope: ["profile", "email"],
		});

		return reply.redirect(authUrl);
	});

	// OAuth callback endpoint (optional, for server-side flow)
	fastify.get("/auth/google/callback", async (request, reply) => {
		const { code } = request.query as { code: string };

		if (!code) {
			return reply.code(400).send({ error: "Authorization code is required" });
		}

		try {
			const { tokens } = await oAuth2Client.getToken(code);
			oAuth2Client.setCredentials(tokens);

			// Get user info
			const ticket = await oAuth2Client.verifyIdToken({
				idToken: tokens.id_token || "",
				audience: GOOGLE_CLIENT_ID,
			});

			const payload = ticket.getPayload();
			if (!payload) {
				return reply.code(401).send({ error: "Invalid token" });
			}

			const user: User = {
				id: payload.sub,
				email: payload.email || "",
				name: payload.name || "",
				picture: payload.picture,
			};

			// Persist user to Firestore
			await firestoreService.createOrUpdateUser(user);

			// Generate JWT token
			const token = fastify.jwt.sign({ user } as JWTPayload);

			// Redirect to frontend with token
			return reply.redirect(
				`http://localhost:5173/auth/callback?token=${token}`,
			);
		} catch (error) {
			console.error("OAuth callback error:", error);
			return reply.code(401).send({ error: "Authentication failed" });
		}
	});

	// Verify JWT and get user info
	fastify.get(
		"/auth/me",
		{
			preHandler: [fastify.authenticate],
		},
		async (request, reply) => {
			return reply.send({ user: request.user });
		},
	);

	// Logout (client should remove token)
	fastify.post("/auth/logout", async (_request, reply) => {
		return reply.send({ message: "Logged out successfully" });
	});
}
