import { GoogleOAuthProvider } from "@react-oauth/google";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import Home from "./pages/Home";
import TaskList from "./pages/TaskList";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

console.log("Google Client ID:", googleClientId);

function App() {
	return (
		<GoogleOAuthProvider clientId={googleClientId}>
			<AuthProvider>
				<Router>
					<div className="App">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/task-list"
								element={
									<ProtectedRoute>
										<TaskList />
									</ProtectedRoute>
								}
							/>
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</div>
				</Router>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
