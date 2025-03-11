// src/components/BlogList.tsx
import { FC } from 'react';
import { BlogPost } from '../models/BlogPost';
import { useNavigate } from 'react-router-dom';

interface BlogListProps {
  posts: BlogPost[];
  onDelete: (id: number) => void;
}

export const BlogList: FC<BlogListProps> = ({ posts, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="blog-item">
              <div className="blog-item-content">
                <h3>{post.title}</h3>
                <p>By {post.author} on {post.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="blog-item-actions">
                <button onClick={() => navigate(`/blogs/${post.id}`)}>View</button>
                <button onClick={() => navigate(`/blogs/edit/${post.id}`)}>Edit</button>
                <button onClick={() => onDelete(post.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/blogs/new')}>Add New Post</button>
    </div>
  );
};