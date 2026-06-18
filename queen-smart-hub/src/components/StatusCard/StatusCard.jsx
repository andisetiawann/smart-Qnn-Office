import { motion } from 'framer-motion';

export const StatusCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'from-blue-50 to-blue-100 text-primary',
    secondary: 'from-red-50 to-red-100 text-secondary',
    green: 'from-green-50 to-green-100 text-green-600',
    purple: 'from-purple-50 to-purple-100 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-base hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} group-hover:scale-110`}>
          <Icon size={28} />
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>

      {trend && (
        <p className="text-xs text-gray-500 mt-3">
          {trend > 0 ? 'Increased' : 'Decreased'} compared to last week
        </p>
      )}
    </motion.div>
  );
};
