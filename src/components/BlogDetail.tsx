// src/components/BlogDetail.tsx
import { FC } from 'react';
import { BlogPost } from '../models/BlogPost';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BlogDetailProps {
  post: BlogPost;
  onDelete: (id: number) => void;
}

const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1rem;
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ContentArea = styled.div`
  line-height: 1.7;
  color: #4a5568;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: #2d3748;
  }
  
  p {
    margin-bottom: 1.25rem;
  }
  
  img {
    max-width: 100%;
    border-radius: 4px;
  }
  
  blockquote {
    padding-left: 1rem;
    border-left: 4px solid #e2e8f0;
    color: #718096;
    font-style: italic;
  }
  
  a {
    color: #4299e1;
    text-decoration: underline;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => {
    if (props.variant === 'delete') return '#fed7d7';
    if (props.variant === 'edit') return '#e2e8f0';
    return '#e2e8f0';
  }};
  
  color: ${props => {
    if (props.variant === 'delete') return '#e53e3e';
    if (props.variant === 'edit') return '#4a5568';
    return '#4a5568';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'delete') return '#feb2b2';
      if (props.variant === 'edit') return '#cbd5e0';
      return '#cbd5e0';
    }};
  }
`;

const IconWrapper = styled.span`
  width: 1.25rem;
  height: 1.25rem;
`;

export const BlogDetail: FC<BlogDetailProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
      navigate('/blogs');
    }
  };

  return (
    <DetailContainer>
      <Title>{post.title}</Title>
      <MetaInfo>
        <span>By {post.author}</span>
        <span>•</span>
        <span>Created {format(post.createdAt, 'MMM dd, yyyy')}</span>
        {post.updatedAt > post.createdAt && (
          <>
            <span>•</span>
            <span>Updated {format(post.updatedAt, 'MMM dd, yyyy')}</span>
          </>
        )}
      </MetaInfo>

      <ContentArea dangerouslySetInnerHTML={{ __html: post.content }} />

      <ActionBar>
        <ActionButton onClick={() => navigate('/blogs')}>
          <IconWrapper><ArrowLeftIcon /></IconWrapper>
          Back to List
        </ActionButton>
        <ActionButton
          variant="edit"
          onClick={() => navigate(`/blogs/edit/${post.id}`)}
        >
          <IconWrapper><PencilIcon /></IconWrapper>
          Edit
        </ActionButton>
        <ActionButton variant="delete" onClick={handleDelete}>
          <IconWrapper><TrashIcon /></IconWrapper>
          Delete
        </ActionButton>
      </ActionBar>
    </DetailContainer>
  );
};