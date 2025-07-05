import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { user, login, logout } = useAuth()

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      login({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      })
    }
  }

  const handleLoginError = () => {
    console.error('Login Failed')
  }

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          {user.picture && <img src={user.picture} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
          <br />
          <button onClick={logout}>Logout</button>
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
  )
}

export default Home