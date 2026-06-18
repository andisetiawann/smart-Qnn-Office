import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (username.length < 4) {
      toast.error('Nama pengguna minimal 4 karakter');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      const email = `${username}@queensmarthub.local`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already exists')) {
          toast.error('Nama pengguna sudah terdaftar');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Registrasi berhasil');

      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat registrasi');
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
            <h1 className="text-3xl font-bold text-gray-900">Daftar Akun Baru</h1>
            <p className="text-gray-500 mt-2">Buat akun untuk Queen Smart Light</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
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
                  placeholder="Minimal 4 karakter"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Daftar
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-700 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
