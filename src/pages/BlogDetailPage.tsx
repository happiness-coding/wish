// src/pages/BlogDetailPage.tsx
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogDetail } from '../components/BlogDetail';
import { BlogService } from '../services/BlogService';
import { BlogPost } from '../models/BlogPost';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #f9fafb;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 2.5rem 2rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.2rem;
  color: #718096;
`;

export const BlogDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      try {
        const foundPost = BlogService.getPost(Number(id));
        if (foundPost) {
          setPost(foundPost);
        } else {
          navigate('/blogs', { replace: true });
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate]);

  const handleDelete = (id: number) => {
    if (BlogService.deletePost(id)) {
      navigate('/blogs');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Loading post content...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!post) {
    return (
      <PageContainer>
        <LoadingContainer>Post not found</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BlogDetail post={post} onDelete={handleDelete} />
    </PageContainer>
  );
};