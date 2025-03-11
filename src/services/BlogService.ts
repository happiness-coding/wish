// src/services/BlogService.ts
import { BlogPost } from '../models/BlogPost';

// In a real app, this would connect to a backend
let blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React",
    content: "React is a JavaScript library for building user interfaces.",
    author: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const BlogService = {
  listPosts: (): BlogPost[] => {
    return [...blogPosts];
  },

  getPost: (id: number): BlogPost | undefined => {
    return blogPosts.find(post => post.id === id);
  },

  addPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
    const newPost = {
      ...post,
      id: blogPosts.length ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    blogPosts.push(newPost);
    return newPost;
  },

  updatePost: (id: number, updatedPost: Partial<BlogPost>): BlogPost | undefined => {
    const index = blogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      blogPosts[index] = {
        ...blogPosts[index],
        ...updatedPost,
        updatedAt: new Date()
      };
      return blogPosts[index];
    }
    return undefined;
  },

  deletePost: (id: number): boolean => {
    const initialLength = blogPosts.length;
    blogPosts = blogPosts.filter(post => post.id !== id);
    return blogPosts.length < initialLength;
  }
};