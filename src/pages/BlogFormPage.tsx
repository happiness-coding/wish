// src/pages/BlogFormPage.tsx
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogForm } from '../components/BlogForm';
import { BlogService } from '../services/BlogService';
import { BlogPost } from '../models/BlogPost';

export const BlogFormPage: FC = () => {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<Partial<BlogPost>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    console.log("BlogFormPage mounted, id:", id);

    // Reset post when navigating between new/edit
    setPost({});

    if (id) {
      try {
        const foundPost = BlogService.getPost(Number(id));
        console.log("Found post:", foundPost);
        if (foundPost) {
          setPost(foundPost);
        } else {
          console.error("Post not found with id:", id);
          navigate('/not-found', { replace: true });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    } else {
      console.log("Creating new post");
    }

    setLoading(false);
  }, [id, navigate]);

  const handleSave = (updatedPost: Partial<BlogPost>) => {
    console.log("Saving post:", updatedPost, "isEditing:", isEditing);

    try {
      if (!updatedPost.title || !updatedPost.author || !updatedPost.content) {
        throw new Error("Missing required fields");
      }

      if (isEditing && id) {
        const updated = BlogService.updatePost(Number(id), updatedPost);
        console.log("Updated post:", updated);
        if (updated) {
          navigate(`/blogs/${id}`);
        } else {
          throw new Error("Failed to update post");
        }
      } else {
        const newPost = BlogService.addPost(updatedPost as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
        console.log("Created new post:", newPost);
        navigate(`/blogs/${newPost.id}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };
  if (loading) return <div>Loading form...</div>;

  return (
    <>
      <div style={{ padding: '10px', color: '#666', fontSize: '14px' }}>
        {isEditing ? `Editing post #${id}` : 'Creating new post'}
      </div>
      <BlogForm initialPost={post} onSave={handleSave} />
    </>
  );
};