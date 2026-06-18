import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Nama pengguna dan password wajib diisi');
      return;
    }

    try {
      const email = `${username}@queensmarthub.local`;

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        toast.error('Username atau password salah');
        return;
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          username,
          userId: data.user.id,
        })
      );

      toast.success('Login berhasil!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto flex items-center justify-center mb-4"
            >
              <img src="/logo qnn.png" alt="QNN Logo" className="w-full h-full object-contain drop-shadow-md" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900">Queen Smart Light</h1>
            <p className="text-gray-500 mt-2">Sistem Monitoring dan Kontrol Lampu IoT</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pengguna</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                  placeholder="Masukkan nama pengguna"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ingat Saya
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors gap-2"
            >
              <LogIn className="w-5 h-5" />
              Masuk
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-blue-700 transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
