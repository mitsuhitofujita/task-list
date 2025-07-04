import type React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import type { GoogleCredentialResponse } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        navigate('/task-list');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign in failed');
    alert('Google sign in failed. Please try again.');
  };

  return (
    <div className="home-container">
      <h1>Task Management Application</h1>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
      />
    </div>
  );
};

export default Home;