import { useState } from 'react';
import { Lightbulb, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import useMQTT from '../../hooks/useMQTT';
import { useDevices } from '../../contexts/DeviceContext';
import { toast } from 'react-hot-toast';

export const DeviceCard = ({ id, name, topic, location = "Ruang Kerja 1" }) => {
  const { devices } = useDevices();
  const deviceData = devices[id] || { online: false, state: 'OFF', lastUpdate: null };
  const isOn = deviceData.state === 'ON';
  const isOnline = deviceData.online;
  const lastUpdated = deviceData.lastUpdate;

  const [isLoading, setIsLoading] = useState(false);
  const { publish } = useMQTT();

  const handleCommand = async (command) => {
    setIsLoading(true);

    // Tidak ada batasan isOnline. Tombol bebas ditekan untuk memancing ESP
    const success = publish(topic, command);

    if (success) {
      toast.success(`Perintah ${command} dikirim ke ${name}`);
    } else {
      toast.error('Failed to send command');
    }

    setTimeout(() => setIsLoading(false), 500);
  };

  const timeAgo = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);

    if (diff < 60) return 'Just Now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m Ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h Ago`;
    return `${Math.floor(diff / 86400)}d Ago`;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden"
    >
      {/* Lokasi & Status Online/Offline */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {location}
        </span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${isOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      {/* Ikon Lampu & Identitas Perangkat */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isOn ? 'bg-blue-50 text-primary' : 'bg-gray-50 text-gray-400'}`}>
          <Lightbulb size={24} className={isOn ? 'drop-shadow-sm' : ''} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{name}</h3>
          <p className="text-xs text-gray-400 mt-1 font-mono">ID: {id}</p>
        </div>
      </div>

      {/* Grid Status & Updated Time */}
      <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 bg-gray-50/50 rounded-xl border border-gray-50">
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-1">Status</p>
          <p className={`text-sm font-extrabold ${isOn ? 'text-primary' : 'text-gray-600'}`}>
            {deviceData.state || 'OFF'}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-1">Updated</p>
          <p className="text-sm font-bold text-gray-600">
            {timeAgo()}
          </p>
        </div>
      </div>

      {/* Area Kontrol Bawah (Tombol ON dan OFF) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3 mt-2">
          <span className="text-sm font-bold text-gray-700">Power Control</span>
          {isOnline && (
            <div className="flex items-center gap-1 text-gray-400 ml-2 bg-gray-50 px-1.5 py-0.5 rounded" title="Signal Strength">
              <Wifi size={10} />
              <span className="text-[10px] font-medium">98%</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleCommand('ON')}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              isOn 
                ? 'bg-primary text-white shadow-md scale-[1.02]' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            ON
          </button>
          <button
            onClick={() => handleCommand('OFF')}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              !isOn 
                ? 'bg-red-500 text-white shadow-md scale-[1.02]' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            OFF
          </button>
        </div>
      </div>
    </motion.div>
  );
};
