import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../database/supabaseClient';
import type { Post } from '../assets/types/postTypes';
import type { PostsContextType } from '../assets/types/contextTypes';

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Provider
export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Función para obtener posts con filtro por categoría
  const fetchPosts = async (category: string = 'All') => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Si no es "All", filtrar por categoría
      if (category !== 'All') {
        query = query.eq('categories', category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener categorías únicas desde Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('categories')
        .not('categories', 'is', null);

      if (error) {
        throw error;
      }

      // Obtener categorías únicas
      const uniqueCategories = ['All', ...new Set(data?.map(item => item.categories) || [])];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Función para buscar posts
  const searchPosts = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => {
      const searchTerm = query.toLowerCase();
      return (
        post.post_name.toLowerCase().includes(searchTerm) ||
        post.post_professions.toLowerCase().includes(searchTerm) ||
        post.post_skills.toLowerCase().includes(searchTerm) ||
        post.categories.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredPosts(filtered);
  };

  // Función para resetear la búsqueda
  const resetSearch = () => {
    setSearchQuery('');
    setFilteredPosts(posts);
  };

  // Función para cambiar categoría
  const setCategory = (category: string) => {
    setCurrentCategory(category);
    fetchPosts(category);
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
        setFilteredPosts(prev => [data[0], ...prev]);
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
        setFilteredPosts(prev => prev.map(p => p.id === id ? data[0] : p));
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
      setFilteredPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar post');
    } finally {
      setLoading(false);
    }
  };

  // Cargar posts y categorías al montar el componente
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const value: PostsContextType = {
    posts,
    filteredPosts,
    loading,
    error,
    currentCategory,
    categories,
    searchQuery,
    fetchPosts,
    setCategory,
    searchPosts,
    resetSearch,
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