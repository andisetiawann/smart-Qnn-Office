import { useState } from 'react';
import { DeviceCard } from '../../components/DeviceCard/DeviceCard';
import { motion } from 'framer-motion';

export const Devices = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kontrol Perangkat
          </h1>
          <p className="text-gray-600">
            Kelola dan kontrol perangkat Anda yang terhubung secara realtime.
          </p>
        </motion.div>

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
    </div>
  );
};