import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../database/supabaseClient';
import type { User } from '../assets/types/userTypes';
import type { AuthContextType } from '../assets/types/authTypes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para registrar usuario
  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Crear perfil de usuario en la tabla users (opcional)
        console.log('📝 Intentando crear perfil en tabla users...');
        
        // Usar Promise.race para evitar que se cuelgue
        const insertPromise = supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name: fullName,
              username: fullName,
              email: data.user.email!,
              phone: phone ? parseInt(phone) : null,
              password: null,
            },
          ]);

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Inserción en tabla users')), 5000)
        );

        try {
          const { error: profileError } = await Promise.race([insertPromise, timeoutPromise]) as any;

          if (profileError) {
            console.warn('⚠️ No se pudo crear perfil en tabla users:', profileError.message);
            console.log('✅ Usuario registrado en auth.users (perfil se puede crear después)');
          } else {
            console.log('✅ Perfil de usuario creado exitosamente');
          }
        } catch (insertError) {
          console.warn('⚠️ Error al insertar en tabla users:', insertError);
          console.log('✅ Usuario registrado en auth.users (perfil se puede crear después)');
        }
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Iniciando sesión:', { email });

      // Verificar conexión a Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        const errorMsg = 'Variables de entorno de Supabase no configuradas';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error en signIn de Supabase:', error);
        throw error;
      }

      console.log('Usuario autenticado:', data.user);

      if (data.user) {
        // Obtener datos del usuario desde la tabla users
        console.log('Obteniendo datos del usuario...');
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw new Error(`Error al obtener datos del usuario: ${userError.message}`);
        } else {
          console.log('✅ Datos del usuario obtenidos:', userData);
          setUser(userData);
        }
      }
    } catch (err) {
      console.error('Error signing in:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear contraseña
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err.message : 'Error al resetear contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Obtener datos del usuario desde la tabla users
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
