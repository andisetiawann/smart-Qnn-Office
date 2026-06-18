import { Zap, Lightbulb, Wifi, TrendingUp } from 'lucide-react';
import { StatusCard } from '../../components/StatusCard/StatusCard';
import { DeviceCard } from '../../components/DeviceCard/DeviceCard';
import { motion } from 'framer-motion';
import { useDevices } from '../../contexts/DeviceContext';

export const Dashboard = () => {
  const { devices: devicesContext } = useDevices();

  const devicesArray = Object.values(devicesContext);
  const totalDevices = devicesArray.length;
  const onlineDevices = devicesArray.filter(d => d.online).length;
  const activeLights = devicesArray.filter(d => d.state === 'ON').length;

  const devicesList = [
    { id: 'lampu1', name: 'Lampu Ruang 1', location: 'Ruang Kerja 1', topic: 'queen/lampu' },
    { id: 'lampuDapur', name: 'Lampu Dapur', location: 'Dapur', topic: 'queen/device/lampuDapur/control' },
    { id: 'lampu2', name: 'Lampu Ruang 2', location: 'Ruang Kerja 2', topic: 'queen/device/lampu2/control' },
    { id: 'lampu3', name: 'Lampu Ruang 3', location: 'Ruang Kerja 3', topic: 'queen/device/lampu3/control' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your system overview.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatusCard
            title="Total Device"
            value={totalDevices}
            icon={Wifi}
            color="primary"
            trend={0}
          />
          <StatusCard
            title="Device Online"
            value={onlineDevices}
            icon={Zap}
            color="green"
            trend={0}
          />
          <StatusCard
            title="Lampu Aktif"
            value={activeLights}
            icon={Lightbulb}
            color="purple"
            trend={0}
          />
          <StatusCard
            title="Konsumsi Energi"
            value="0 W"
            icon={TrendingUp}
            color="secondary"
            trend={0}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kontrol Perangkat Pintar</h2>
            <p className="text-gray-600">Kelola dan kontrol perangkat Anda yang terhubung</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {devicesList.map((device) => (
              <motion.div key={device.id} variants={itemVariants}>
                <DeviceCard
                  id={device.id}
                  name={device.name}
                  topic={device.topic}
                  location={device.location}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 card-base bg-gradient-to-r from-primary/5 to-blue-100/20"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Use the toggle switches to control your lights remotely</li>
            <li>• Check the Monitoring page for real-time device status</li>
            <li>• View detailed analytics on the Analytics page</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};
