import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
	const { user, login, logout, isLoading } = useAuth();

	const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential) {
			try {
				// Send ID token to backend for verification and user persistence
				const response = await fetch("/api/auth/google", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						idToken: credentialResponse.credential,
					}),
				});

				if (!response.ok) {
					throw new Error("Authentication failed");
				}

				const { user, token } = await response.json();

				// Store JWT token in localStorage
				localStorage.setItem("authToken", token);

				// Update auth context
				login(user);
			} catch (error) {
				console.error("Login error:", error);
				handleLoginError();
			}
		}
	};

	const handleLoginError = () => {
		console.error("Login Failed");
	};

	if (isLoading) {
		return (
			<div>
				<h1>Home Page</h1>
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Home Page</h1>
			{user ? (
				<div>
					<p>Welcome, {user.name}!</p>
					<p>Email: {user.email}</p>
					{user.picture && (
						<img
							src={user.picture}
							alt="Profile"
							style={{ width: 50, height: 50, borderRadius: "50%" }}
						/>
					)}
					<br />
					<button type="button" onClick={logout}>
						Logout
					</button>
					<br />
					<Link to="/task-list">Go to Task List</Link>
				</div>
			) : (
				<div>
					<p>Please sign in to continue</p>
					<GoogleLogin
						onSuccess={handleLoginSuccess}
						onError={handleLoginError}
					/>
				</div>
			)}
		</div>
	);
}

export default Home;
