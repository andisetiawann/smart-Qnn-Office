import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Lightbulb, Clock, 
  Activity, BarChart3, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Beranda', icon: LayoutDashboard },
    { path: '/devices', label: 'Kontrol Perangkat', icon: Lightbulb },
    { path: '/automation', label: 'Otomatisasi', icon: Clock },
    { path: '/monitoring', label: 'Pemantauan', icon: Activity },
    { path: '/analytics', label: 'Analitik', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-white shadow-md"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isMobileOpen ? 0 : (window.innerWidth >= 768 ? 0 : -300),
          width: isCollapsed ? '80px' : '256px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-white shadow-xl z-40 md:static border-r border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between h-20 shrink-0">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xl font-bold text-gradient">Queen Smart Light</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-medium transition-all duration-200 group relative ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-primary'
                }`}
              >
                <Icon size={20} className={`min-w-[20px] ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                   <div className="absolute left-14 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                     {item.label}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="w-full flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors hidden md:flex"
           >
             {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
           </button>
        </div>
      </motion.aside>
    </>
  );
};