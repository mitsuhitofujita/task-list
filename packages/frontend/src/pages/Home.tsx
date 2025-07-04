import React from 'react';

const Home: React.FC = () => {
  const handleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log('Sign in with Google');
  };

  return (
    <div className="home-container">
      <h1>Task Management Application</h1>
      <button onClick={handleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Home;