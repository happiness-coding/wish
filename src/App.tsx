// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogFormPage } from './pages/BlogFormPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <h1>Blog Management System</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/blogs" replace />} />
            <Route path="/blogs" element={<BlogListPage />} />
            {/* Add key props to ensure component remounts when routes change */}
            <Route path="/blogs/new" element={<BlogFormPage key="new-blog" />} />
            <Route path="/blogs/edit/:id" element={<BlogFormPage key="edit-blog" />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <footer>
          <p>© 2024 Blog Management System</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;