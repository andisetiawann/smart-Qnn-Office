import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session from Supabase on mount
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_session'); // clear legacy
    sessionStorage.removeItem('auth_session'); // clear legacy
  };

  const register = async (username, password) => {
    try {
      const email = `${username}@queensmarthub.local`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error('Gagal mendaftar: ' + error.message);
        return false;
      }
      
      toast.success('Pendaftaran berhasil!');
      return true;
    } catch (err) {
      toast.error('Terjadi kesalahan saat mendaftar');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
