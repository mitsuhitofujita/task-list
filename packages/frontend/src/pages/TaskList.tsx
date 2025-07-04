import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Check authentication
    const isAuthenticated = false; // Placeholder
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleSignOut = () => {
    // TODO: Implement sign out
    console.log('Sign out');
    navigate('/');
  };

  return (
    <div className="task-list-container">
      <header>
        <h1>Task List</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </header>
      
      <main>
        <div className="task-actions">
          <button>Add New Task</button>
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