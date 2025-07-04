import type React from "react";
import { useAuth } from '../contexts/AuthContext';

const TaskList: React.FC = () => {
	const { user, logout } = useAuth();

	const handleSignOut = () => {
		logout();
	};

	return (
		<div className="task-list-container">
			<header>
				<h1>Task List</h1>
				<div className="user-info">
					<span>Welcome, {user?.name}!</span>
					<button type="button" onClick={handleSignOut}>
						Sign Out
					</button>
				</div>
			</header>

			<main>
				<div className="task-actions">
					<button type="button">Add New Task</button>
				</div>

				<div className="tasks">
					{/* TODO: Implement task list */}
					<p>Tasks will be displayed here</p>
				</div>
			</main>
		</div>
	);
};

export default TaskList;
