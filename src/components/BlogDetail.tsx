// src/components/BlogDetail.tsx - Updated for better responsiveness
import { FC } from 'react';
import { BlogPost } from '../models/BlogPost';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
import { PencilIcon, TrashIcon, ArrowLeftIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface BlogDetailProps {
  post: BlogPost;
  onDelete: (id: number) => void;
}

const DetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const BlogHeader = styled.header`
  padding: 2rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  
  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 2.75rem;
    line-height: 1.2;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconWrapper = styled.span`
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.75;
`;

const ContentArea = styled.div`
  padding: 1.5rem;
  line-height: 1.8;
  color: #334155;
  font-size: 1.05rem;
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
  
  @media (min-width: 768px) {
    padding: 2.5rem 3rem;
    font-size: 1.1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #1e293b;
    font-weight: 700;
    line-height: 1.3;
  }
  
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
    margin: 2rem auto;
  }
  
  blockquote {
    border-left: 5px solid #3b82f6;
    margin: 1.5em 0;
    padding: 1em 1.5em;
    background-color: #f0f9ff;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #334155;
    position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }
  
  pre {
    border-radius: 8px;
    padding: 1em;
    margin: 1.5em 0;
    background: #1e293b;
    color: #e2e8f0;
    overflow: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  code {
    background: #f1f5f9;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: #dc2626;
  }
  
  a {
    color: #3b82f6;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: from-font;
    transition: color 0.2s;
    
    &:hover {
      color: #2563eb;
    }
  }
  
  ul, ol {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    border: 1px solid #e2e8f0;
  }
  
  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f8fafc;
  }
`;

const ActionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  
  @media (min-width: 640px) {
    padding: 1.5rem 2rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem 3rem;
  }
`;

const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => {
    if (props.variant === 'delete') return '#fee2e2';
    if (props.variant === 'edit') return '#e2e8f0';
    return '#e2e8f0';
  }};
  
  color: ${props => {
    if (props.variant === 'delete') return '#dc2626';
    if (props.variant === 'edit') return '#334155';
    return '#334155';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'delete') return '#fecaca';
      if (props.variant === 'edit') return '#cbd5e0';
      return '#cbd5e0';
    }};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const BlogDetail: FC<BlogDetailProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  return (
    <DetailContainer>
      <BlogHeader>
        <Title>{post.title}</Title>
        <MetaInfo>
          <MetaItem>
            <IconWrapper><UserIcon /></IconWrapper>
            {post.author}
          </MetaItem>
          <MetaItem>
            <IconWrapper><CalendarIcon /></IconWrapper>
            Published {format(post.createdAt, 'MMM dd, yyyy')}
          </MetaItem>
          {post.updatedAt > post.createdAt && (
            <MetaItem>
              <IconWrapper><CalendarIcon /></IconWrapper>
              Updated {format(post.updatedAt, 'MMM dd, yyyy')}
            </MetaItem>
          )}
        </MetaInfo>
      </BlogHeader>

      <ContentArea dangerouslySetInnerHTML={{ __html: post.content }} />

      <ActionBar>
        <ActionButton onClick={() => navigate('/blogs')}>
          <IconWrapper><ArrowLeftIcon /></IconWrapper>
          Back to Posts
        </ActionButton>
        <ActionButton
          variant="edit"
          onClick={() => navigate(`/blogs/edit/${post.id}`)}
        >
          <IconWrapper><PencilIcon /></IconWrapper>
          Edit Post
        </ActionButton>
        <ActionButton variant="delete" onClick={handleDelete}>
          <IconWrapper><TrashIcon /></IconWrapper>
          Delete Post
        </ActionButton>
      </ActionBar>
    </DetailContainer>
  );
};