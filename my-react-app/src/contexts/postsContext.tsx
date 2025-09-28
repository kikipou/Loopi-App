import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../database/supabaseClient';

// Tipos para los posts
export interface Post {
  id: string;
  post_name: string;
  post_description: string;
  post_professions: string;
  post_skills: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Contexto
interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Provider
export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un post
  const addPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(prev => [data[0], ...prev]);
      }
    } catch (err) {
      console.error('Error adding post:', err);
      setError(err instanceof Error ? err.message : 'Error al agregar post');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un post
  const updatePost = async (id: string, post: Partial<Post>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(prev => prev.map(p => p.id === id ? data[0] : p));
      }
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar post');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un post
  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar post');
    } finally {
      setLoading(false);
    }
  };

  // Cargar posts al montar el componente
  useEffect(() => {
    fetchPosts();
  }, []);

  const value: PostsContextType = {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

// Hook para usar el contexto
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};