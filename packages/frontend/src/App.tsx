import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TaskList from './pages/TaskList'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task-list" element={<TaskList />} />
    </Routes>
  )
}

export default App
