// src/pages/BlogDetailPage.tsx
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogDetail } from '../components/BlogDetail';
import { BlogService } from '../services/BlogService';
import { BlogPost } from '../models/BlogPost';

export const BlogDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundPost = BlogService.getPost(Number(id));
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/not-found', { replace: true });
      }
    }
  }, [id, navigate]);

  const handleDelete = (id: number) => {
    BlogService.deletePost(id);
    navigate('/blogs');
  };

  if (!post) return <div>Loading...</div>;

  return <BlogDetail post={post} onDelete={handleDelete} />;
};