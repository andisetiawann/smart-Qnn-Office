import { useState } from 'react';
import { Activity, Wifi, Signal, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import useMQTT from '../../hooks/useMQTT';
import { useDevices } from '../../contexts/DeviceContext';

export const Monitoring = () => {
  const { isConnected } = useMQTT();
  const { devices } = useDevices();

  const [activities] = useState([
    { id: 1, device: 'System', action: 'Monitoring initialized', time: 'Just now', status: 'info' },
  ]);

  const timeAgo = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const devicesList = [
    { id: 'lampu1', name: 'Lampu Ruang 1' },
    { id: 'lampu2', name: 'Lampu Ruang 2' },
    { id: 'lampu3', name: 'Lampu Ruang 3' },
  ].map((d) => ({
    name: d.name,
    status: devices[d.id]?.online ? 'Online' : 'Offline',
    state: devices[d.id]?.state || 'OFF',
    lastSeen: timeAgo(devices[d.id]?.lastUpdate),
  }));

  const activeDevicesCount = Object.values(devices).filter(d => d.online).length;
  const isAllOnline = activeDevicesCount === 3;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring of your devices</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-base bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">MQTT Status</h3>
              <Activity className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
            <p className="text-xs text-gray-600 mt-2">broker.hivemq.com</p>
          </div>

          <div className="card-base bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">System Status</h3>
              <Wifi className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-blue-600">{activeDevicesCount > 0 ? 'Online' : 'Offline'}</p>
            <p className="text-xs text-gray-600 mt-2">Hub connectivity</p>
          </div>

          <div className="card-base bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Network</h3>
              <Signal className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-purple-600">{isConnected ? 'Stable' : 'Unstable'}</p>
            <p className="text-xs text-gray-600 mt-2">Connection quality</p>
          </div>

          <div className="card-base bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Active Devices</h3>
              <Eye className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-orange-600">{activeDevicesCount}</p>
            <p className="text-xs text-gray-600 mt-2">{isAllOnline ? 'All devices online' : 'Some devices offline'}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card-base">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Device Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">State</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Connection</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {devicesList.map((device, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{device.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${device.state === 'ON' ? 'text-blue-600' : 'text-gray-500'}`}>
                          {device.state}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={device.status === 'Online' ? 'badge-online' : 'badge-offline'}>
                          <span className={`w-2 h-2 rounded-full ${device.status === 'Online' ? 'bg-green-600' : 'bg-gray-400'}`} />
                          {device.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{device.lastSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-base">
            <h2 className="text-xl font-bold text-gray-900 mb-4">WiFi Signal</h2>
            <div className="space-y-4">
              {['Lampu 1', 'Lampu 2', 'Lampu 3'].map((device, idx) => {
                const deviceKey = `lampu${idx + 1}`;
                const signal = 0;
                
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">{device}</p>
                      <p className="text-sm text-gray-600">{signal}%</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all"
                        style={{ width: `${signal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-base">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Device Activity Log</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-500' : activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{activity.device}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0">{activity.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
