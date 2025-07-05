import type { FastifyInstance } from "fastify";

export default async function taskRoutes(fastify: FastifyInstance) {
	// All routes in this file require authentication
	fastify.addHook("preHandler", fastify.authenticate);

	// Get all tasks for the authenticated user
	fastify.get("/tasks", async (request, reply) => {
		// TODO: Implement Firestore integration
		return reply.send({
			tasks: [],
			message: `Tasks endpoint - user: ${request.user?.email}`,
		});
	});

	// Create a new task
	fastify.post("/tasks", async (request, reply) => {
		// TODO: Implement task creation
		return reply.send({
			message: "Task created",
			user: request.user?.email,
		});
	});

	// Update a task
	fastify.put("/tasks/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		// TODO: Implement task update
		return reply.send({
			message: `Task ${id} updated`,
			user: request.user?.email,
		});
	});

	// Delete a task
	fastify.delete("/tasks/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		// TODO: Implement task deletion
		return reply.send({
			message: `Task ${id} deleted`,
			user: request.user?.email,
		});
	});
}
