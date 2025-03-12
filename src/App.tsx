// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { TaskFormPage } from './pages/TaskFormPage.tsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <h1>Task Manager</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/new" element={<TaskFormPage key="new-task" />} />
            <Route path="/tasks/edit/:id" element={<TaskFormPage key="edit-task" />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <footer>
          <p>© 2024 Task Manager</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;