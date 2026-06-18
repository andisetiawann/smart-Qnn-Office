import React, { createContext, useContext, useState, useEffect } from 'react';
import useMQTT from '../hooks/useMQTT';
import { supabase } from '../services/supabaseClient';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState({
    lampu1: { online: false, state: 'OFF', lastUpdate: null },
    lampuDapur: { online: false, state: 'OFF', lastUpdate: null },
    lampu2: { online: false, state: 'OFF', lastUpdate: null },
    lampu3: { online: false, state: 'OFF', lastUpdate: null },
  });

  const { isConnected, subscribe, unsubscribe } = useMQTT();

  // Ambil data status perangkat terakhir dari Supabase saat web pertama kali dibuka
  useEffect(() => {
    const fetchInitialDevicesState = async () => {
      try {
        const { data, error } = await supabase.from('devices').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDevices((prev) => {
            const updatedDevices = { ...prev };
            data.forEach((dbDevice) => {
              // Pastikan ID perangkat di database cocok dengan state kita (lampu1, lampu2, dst)
              if (updatedDevices[dbDevice.id]) {
                updatedDevices[dbDevice.id] = {
                  ...updatedDevices[dbDevice.id],
                  state: dbDevice.state || 'OFF',
                  online: dbDevice.is_online || false,
                };
              }
            });
            return updatedDevices;
          });
        }
      } catch (err) {
        console.error('Error fetching initial device state from Supabase:', err.message);
      }
    };

    fetchInitialDevicesState();
  }, []);

  // Offline detection check
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) => {
        let hasChanges = false;
        const now = new Date();
        const updatedDevices = { ...prev };

        Object.keys(updatedDevices).forEach((key) => {
          const device = updatedDevices[key];
          if (device.online && device.lastUpdate) {
            const diff = now - device.lastUpdate;
            if (diff > 60000) {
              updatedDevices[key] = { ...device, online: false };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? updatedDevices : prev;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const handleMessage = (deviceId) => (message) => {
      let payloadStr = '';
      if (typeof message === 'string') {
        payloadStr = message.trim();
      } else if (message && message.state) {
        payloadStr = message.state;
      } else {
        try {
          payloadStr = JSON.stringify(message);
        } catch {
          payloadStr = String(message);
        }
      }

      setDevices((prev) => {
        const currentDevice = prev[deviceId];
        const newDevice = { ...currentDevice, lastUpdate: new Date() };

        if (payloadStr === 'ON' || payloadStr === 'OFF') {
          newDevice.state = payloadStr;
          newDevice.online = true; // Assumed online when emitting state
        } else if (payloadStr === 'ONLINE') {
          newDevice.online = true;
        } else if (payloadStr === 'OFFLINE') {
          newDevice.online = false;
        }

        return {
          ...prev,
          [deviceId]: newDevice,
        };
      });
    };

    const topics = {
      lampu1: 'queen/lampu',
      lampuDapur: 'queen/device/lampuDapur/status',
      lampu2: 'queen/device/lampu2/status',
      lampu3: 'queen/device/lampu3/status',
    };

    const callbacks = {
      lampu1: handleMessage('lampu1'),
      lampuDapur: handleMessage('lampuDapur'),
      lampu2: handleMessage('lampu2'),
      lampu3: handleMessage('lampu3'),
    };

    subscribe(topics.lampu1, callbacks.lampu1);
    subscribe(topics.lampuDapur, callbacks.lampuDapur);
    subscribe(topics.lampu2, callbacks.lampu2);
    subscribe(topics.lampu3, callbacks.lampu3);

    return () => {
      unsubscribe(topics.lampu1, callbacks.lampu1);
      unsubscribe(topics.lampuDapur, callbacks.lampuDapur);
      unsubscribe(topics.lampu2, callbacks.lampu2);
      unsubscribe(topics.lampu3, callbacks.lampu3);
    };
  }, [isConnected, subscribe, unsubscribe]);

  return (
    <DeviceContext.Provider value={{ devices }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => useContext(DeviceContext);
