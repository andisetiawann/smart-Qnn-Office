import { useEffect, useState, useRef } from 'react';
import { Clock, Wifi, AlertCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useMQTT from '../../hooks/useMQTT';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [time, setTime] = useState(new Date());
  const { isConnected, error } = useMQTT();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4 max-w-full">
        <div className="flex items-center gap-4">
          <img src="/logo qnn.png" alt="QNN Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Queen Smart Light</h1>
            <p className="text-sm text-gray-500">Dasbor Manajemen IoT</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden md:flex items-center gap-2"
          >
            <Clock size={18} className="text-primary" />
            <span className="font-mono text-sm">
              {time.toLocaleTimeString('id-ID')}
            </span>
          </motion.div>

          <div className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg border ${isConnected ? 'bg-gradient-to-r from-blue-50 to-transparent border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <Wifi
              size={18}
              className={isConnected ? 'text-green-500' : 'text-gray-400'}
            />
            <span className="text-sm font-medium">
              MQTT: <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </span>
          </div>

          {error && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={18} className="text-red-500" />
              <span className="text-sm text-red-600">Error</span>
            </div>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-sm">
                {user?.username ? user.username.charAt(0) : 'Q'}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {user?.username || 'Pengguna'}
                </span>
                <span className="text-xs text-gray-500 leading-tight">Admin</span>
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      <User size={16} />
                      Profil Saya
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
