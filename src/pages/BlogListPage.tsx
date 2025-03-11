// src/pages/BlogListPage.tsx
import { FC, useEffect, useState } from 'react';
import { BlogPost } from '../models/BlogPost';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BlogService } from '../services/BlogService';

const PageContainer = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 1rem;
`;

const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

const HeaderContent = styled.div`
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  max-width: 500px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
  
  &:hover {
    background-color: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(79, 70, 229, 0.25);
  }
`;

const BlogsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BlogCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  }
`;

const BlogImage = styled.div`
  height: 180px;
  background-color: #e2e8f0;
  background-image: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%);
  position: relative;
  overflow: hidden;
`;

const BlogContent = styled.div`
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BlogCategory = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #5a67d8;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const BlogTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a202c;
  line-height: 1.4;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogExcerpt = styled.div`
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
`;

const BlogAuthor = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const BlogDate = styled.div`
  font-size: 0.8125rem;
  color: #a0aec0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.75rem;
  background-color: #f7fafc;
  border-top: 1px solid #edf2f7;
  justify-content: space-between;
`;

const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => {
    if (props.variant === 'delete') return '#FED7D7';
    if (props.variant === 'edit') return '#E2E8F0';
    if (props.variant === 'view') return '#E9D8FD';
    return '#E2E8F0';
  }};
  
  color: ${props => {
    if (props.variant === 'delete') return '#E53E3E';
    if (props.variant === 'edit') return '#4A5568';
    if (props.variant === 'view') return '#6B46C1';
    return '#4A5568';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'delete') return '#FEB2B2';
      if (props.variant === 'edit') return '#CBD5E0';
      if (props.variant === 'view') return '#D6BCFA';
      return '#CBD5E0';
    }};
  }
`;

const IconWrapper = styled.span`
  width: 1rem;
  height: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const EmptyStateButton = styled(AddButton)`
  margin: 0 auto;
`;

export const BlogListPage: FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch blog posts
    setPosts(BlogService.listPosts());
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      BlogService.deletePost(id);
      setPosts(BlogService.listPosts());
    }
  };

  // Function to extract plain text from HTML content for the excerpt
  const extractExcerpt = (html: string, maxLength: number = 120): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Get a random category for visual interest
  const getRandomCategory = () => {
    const categories = ['TECHNOLOGY', 'INSIGHTS', 'TUTORIAL', 'NEWS', 'UPDATES'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  return (
    <PageContainer>
      <ListContainer>
        <ListHeader>
          <HeaderContent>
            <Title>Blog Posts</Title>
            <Subtitle>Discover our latest articles, insights, and updates</Subtitle>
          </HeaderContent>
          <AddButton onClick={() => navigate('/blogs/new')}>
            <IconWrapper><PlusIcon /></IconWrapper>
            Add New Post
          </AddButton>
        </ListHeader>

        {posts.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No posts available</EmptyStateTitle>
            <EmptyStateText>Share your thoughts by creating your first blog post!</EmptyStateText>
            <EmptyStateButton onClick={() => navigate('/blogs/new')}>
              <IconWrapper><PlusIcon /></IconWrapper>
              Create Your First Post
            </EmptyStateButton>
          </EmptyState>
        ) : (
          <BlogsGrid>
            {posts.map((post) => (
              <BlogCard key={post.id}>
                <BlogImage />
                <BlogContent>
                  <BlogCategory>{getRandomCategory()}</BlogCategory>
                  <BlogTitle>{post.title}</BlogTitle>
                  <BlogExcerpt>
                    {extractExcerpt(post.content)}
                  </BlogExcerpt>
                  <BlogMeta>
                    <BlogAuthor>By {post.author}</BlogAuthor>
                    <BlogDate>{format(post.createdAt, 'MMM dd, yyyy')}</BlogDate>
                  </BlogMeta>
                </BlogContent>
                <CardActions>
                  <ActionButton
                    variant="view"
                    onClick={() => navigate(`/blogs/${post.id}`)}
                  >
                    <IconWrapper><EyeIcon /></IconWrapper>
                    View
                  </ActionButton>
                  <ActionButton
                    variant="edit"
                    onClick={() => navigate(`/blogs/edit/${post.id}`)}
                  >
                    <IconWrapper><PencilIcon /></IconWrapper>
                    Edit
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    onClick={() => handleDelete(post.id)}
                  >
                    <IconWrapper><TrashIcon /></IconWrapper>
                    Delete
                  </ActionButton>
                </CardActions>
              </BlogCard>
            ))}
          </BlogsGrid>
        )}
      </ListContainer>
    </PageContainer>
  );
};