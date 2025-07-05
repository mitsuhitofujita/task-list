import { Link } from "react-router-dom";

function TaskList() {
	return (
		<div>
			<h1>Task List Page</h1>
			<p>This is the task list page!</p>
			<Link to="/">Go to Home</Link>
		</div>
	);
}

export default TaskList;
