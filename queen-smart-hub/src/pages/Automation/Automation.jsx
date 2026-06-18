import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, Calendar, Sun, Palmtree, Save, Activity } from 'lucide-react';
import useMQTT from '../../hooks/useMQTT';
import { toast } from 'react-hot-toast';

export const Automation = () => {
  const { publish } = useMQTT();
  
  const [scheduleEnabled, setScheduleEnabled] = useState(() => {
    const saved = localStorage.getItem('scheduleEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [onTime, setOnTime] = useState(() => {
    return localStorage.getItem('onTime') || '18:00';
  });
  const [offTime, setOffTime] = useState(() => {
    return localStorage.getItem('offTime') || '22:00';
  });

  const [weeklySchedule, setWeeklySchedule] = useState(() => {
    const saved = localStorage.getItem('weeklySchedule');
    if (saved) return JSON.parse(saved);
    return {
      monday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      tuesday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      wednesday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      thursday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      friday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      saturday: { enabled: false, onTime: '18:00', offTime: '22:00' },
      sunday: { enabled: false, onTime: '18:00', offTime: '22:00' },
    };
  });

  useEffect(() => {
    localStorage.setItem('weeklySchedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  const [holidayMode, setHolidayMode] = useState(() => {
    const saved = localStorage.getItem('holidayMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sunsetMode, setSunsetMode] = useState(false);
  
  const [logs, setLogs] = useState([
    { id: 1, time: '18:00', message: 'Light ON (Schedule)' },
    { id: 2, time: '22:00', message: 'Light OFF (Schedule)' },
    { id: 3, time: '20:15', message: '15 Minute Timer Activated' },
  ]);

  // Helper untuk mengontrol semua lampu sekaligus
  const controlAllLamps = (action) => {
    publish('queen/lampu', action);
    publish('queen/device/lampuDapur/control', action);
    publish('queen/device/lampu2/control', action);
    publish('queen/device/lampu3/control', action);
  };

  // Handle Schedule Logic (Web-based Smart Hub)
  useEffect(() => {
    // Variabel untuk mencatat menit terakhir yang sudah diproses
    let lastProcessedTime = '';

    const interval = setInterval(() => {
      const now = new Date();

      // -- Quick Timer Check --
      const quickTimerStr = localStorage.getItem('quickTimerEnd');
      if (quickTimerStr) {
        const quickTimerEnd = parseInt(quickTimerStr, 10);
        if (now.getTime() >= quickTimerEnd) {
          controlAllLamps('OFF');
          toast.success('Timer Selesai: Semua Lampu Dimatikan');
          setLogs(prev => [{
            id: Date.now(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            message: 'Semua Lampu OFF (Timer Selesai)'
          }, ...prev]);
          localStorage.removeItem('quickTimerEnd');
        }
      }

      // JIKA HOLIDAY MODE AKTIF, JADWAL DIABAIKAN (DIBYPASS)
      if (holidayMode) return;

      // -- Schedule Check --
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const currentSeconds = now.getSeconds();

      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDayName = dayNames[now.getDay()];
      const todaySchedule = weeklySchedule[currentDayName];

      // Ganti logika dari cek detik ke cek perubahan menit agar tidak terlewat saat browser lag/throttle
      if (currentTime !== lastProcessedTime) {
        lastProcessedTime = currentTime;
        let action = null;
        let source = '';

        if (scheduleEnabled) {
          if (currentTime === onTime) { action = 'ON'; source = 'Daily Schedule'; }
          else if (currentTime === offTime) { action = 'OFF'; source = 'Daily Schedule'; }
        }

        if (todaySchedule && todaySchedule.enabled) {
          if (currentTime === todaySchedule.onTime) { action = 'ON'; source = `Weekly Schedule (${currentDayName})`; }
          else if (currentTime === todaySchedule.offTime) { action = 'OFF'; source = `Weekly Schedule (${currentDayName})`; }
        }

        if (action) {
          controlAllLamps(action);
          toast.success(`Jadwal Otomatis: Lampu ${action}`);
          setLogs(prev => [{
            id: Date.now(),
            time: currentTime,
            message: `Lampu ${action} (${source})`
          }, ...prev]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduleEnabled, onTime, offTime, weeklySchedule, holidayMode, publish]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSaveSchedule = () => {
    // Save to localStorage so it persists
    localStorage.setItem('scheduleEnabled', JSON.stringify(scheduleEnabled));
    localStorage.setItem('onTime', onTime);
    localStorage.setItem('offTime', offTime);

    // Publish to the ESP for sync
    publish('queen/automation/schedule', JSON.stringify({
      enabled: scheduleEnabled,
      onTime,
      offTime
    }));
    toast.success('Schedule saved & activated');
  };

  const handleQuickTimer = (duration) => {
    toast.success(`${duration} Minute Timer Activated`);
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      message: `${duration} Minute Timer Activated`
    };
    setLogs(prev => [newLog, ...prev]);

    // Save end time to local storage for the interval to check
    const endTime = Date.now() + (duration * 60 * 1000);
    localStorage.setItem('quickTimerEnd', endTime.toString());
    
    // Immediately turn the lamp ON as the timer starts
    controlAllLamps('ON');
  };

  const handleHolidayMode = (checked) => {
    setHolidayMode(checked);
    localStorage.setItem('holidayMode', JSON.stringify(checked));
    if(checked) {
      controlAllLamps('OFF');
      toast.success('Holiday Mode Active - All lights TURNED OFF');
      setLogs(prev => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: 'Holiday Mode Enabled (All Lights OFF)'
      }, ...prev]);
    } else {
      toast.success('Holiday Mode Disabled');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-6">
        
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Clock className="text-primary" size={32} />
            Automation Center
          </h1>
          <p className="text-gray-600">Manage smart schedules and automated routines.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Automatic Schedule */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="text-blue-500" /> Automatic Light Schedule
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={scheduleEnabled} onChange={(e) => setScheduleEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Turn ON Time</label>
                <input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Turn OFF Time</label>
                <input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
              </div>
            </div>

            <button onClick={handleSaveSchedule} className="w-full btn-primary flex items-center justify-center gap-2">
              <Save size={18} /> Save & Sync to ESP32
            </button>
          </motion.div>

          {/* Section 2: Quick Timer */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Timer className="text-orange-500" /> Auto Turn Off
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[5, 15, 30, 60].map((mins) => (
                <button key={mins} onClick={() => handleQuickTimer(mins)} className="p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-xl border border-orange-200 transition-colors flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">{mins}</span>
                  <span className="text-sm font-normal">Minutes</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Weekly Schedule */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Calendar className="text-purple-500" /> Weekly Schedule
            </h2>
            <div className="space-y-4">
              {Object.entries(weeklySchedule).map(([day, settings]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                  <div className="flex items-center gap-4 w-40">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.enabled} 
                        onChange={(e) => setWeeklySchedule({...weeklySchedule, [day]: {...settings, enabled: e.target.checked}})} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                    <span className="font-semibold text-gray-700 capitalize">{day}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <input 
                      type="time" 
                      disabled={!settings.enabled}
                      value={settings.onTime} 
                      onChange={(e) => setWeeklySchedule({...weeklySchedule, [day]: {...settings, onTime: e.target.value}})} 
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50" 
                    />
                    <span className="text-gray-400">to</span>
                    <input 
                      type="time" 
                      disabled={!settings.enabled}
                      value={settings.offTime} 
                      onChange={(e) => setWeeklySchedule({...weeklySchedule, [day]: {...settings, offTime: e.target.value}})} 
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4 & 5: Holiday Mode & Sunset Mode */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-white rounded-[20px] shadow-sm border border-red-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-red-700 flex items-center gap-2 mb-1">
                    <Palmtree size={24} /> Holiday Mode
                  </h2>
                  <p className="text-sm text-red-600/80">Turn off all lamps and disable schedules</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={holidayMode} onChange={(e) => handleHolidayMode(e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-[20px] shadow-sm border border-yellow-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-yellow-700 flex items-center gap-2 mb-1">
                    <Sun size={24} /> Sunset Automation
                  </h2>
                  <p className="text-sm text-yellow-600/80">Lamps turn ON automatically after sunset</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={sunsetMode} onChange={(e) => setSunsetMode(e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-yellow-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Section 6: Automation Logs */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Activity className="text-green-500" /> Automation Logs
            </h2>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-mono text-gray-500 pt-0.5">{log.time}</div>
                  <div className="text-sm font-medium text-gray-800">{log.message}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
