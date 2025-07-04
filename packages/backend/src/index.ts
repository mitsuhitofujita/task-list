import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

// Serve static files from the React build directory
await server.register(fastifyStatic, {
	root: path.join(__dirname, "../../frontend/build"),
	prefix: "/",
});

// API routes
server.get("/api/ping", async (_request, _reply) => {
	return "pong\n";
});

// Serve the React app for all non-API routes
server.setNotFoundHandler(async (request, reply) => {
	if (request.url.startsWith('/api/')) {
		reply.code(404).send({ message: `Route ${request.method}:${request.url} not found`, error: 'Not Found', statusCode: 404 });
	} else {
		return reply.sendFile('index.html');
	}
});

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
