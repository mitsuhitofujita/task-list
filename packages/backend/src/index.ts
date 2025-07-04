import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({ logger: true });

// Get port from environment variable or use default
const port = Number(process.env.PORT) || 3000;

// Register CORS
await server.register(fastifyCors, {
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true,
});

// Register JWT plugin
await server.register(jwtPlugin);

// Serve static files from the React build directory
await server.register(fastifyStatic, {
	root: path.join(__dirname, "../../frontend/build"),
	prefix: "/",
});

// API routes
server.get("/api/ping", async (_request, _reply) => {
	return "pong\n";
});

// Register auth routes
await server.register(authRoutes, { prefix: "/api" });

// Register task routes (protected)
await server.register(taskRoutes, { prefix: "/api" });

// Serve the React app for all non-API routes
server.setNotFoundHandler(async (request, reply) => {
	if (request.url.startsWith("/api/")) {
		reply.code(404).send({
			message: `Route ${request.method}:${request.url} not found`,
			error: "Not Found",
			statusCode: 404,
		});
	} else {
		return reply.sendFile("index.html");
	}
});

server.listen({ port, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
