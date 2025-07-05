import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import TaskList from './pages/TaskList'
import './App.css'

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    return <div>Error: VITE_GOOGLE_CLIENT_ID is not set in environment variables</div>
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task-list" element={<TaskList />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
