import { useState, useEffect, useCallback } from 'react';
import mqttService from '../services/mqttService';

export const useMQTT = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleConnectionStatus = (status) => {
      setIsConnected(status.connected);
      setError(null);
    };

    const handleError = (err) => {
      setError(err.message);
    };

    if (!mqttService.getConnectionStatus()) {
      mqttService.connect().catch((err) => {
        console.error('MQTT connection failed:', err);
        setError(err.message);
      });
    } else {
      setIsConnected(true);
    }

    mqttService.addEventListener('connectionStatus', handleConnectionStatus);
    mqttService.addEventListener('error', handleError);

    return () => {
      mqttService.removeEventListener('connectionStatus', handleConnectionStatus);
      mqttService.removeEventListener('error', handleError);
    };
  }, []);

  const publish = useCallback((topic, payload) => {
    return mqttService.publish(topic, payload);
  }, []);

  const subscribe = useCallback((topic, callback) => {
    mqttService.subscribe(topic, callback);
  }, []);

  const unsubscribe = useCallback((topic, callback) => {
    mqttService.unsubscribe(topic, callback);
  }, []);

  return {
    isConnected,
    error,
    publish,
    subscribe,
    unsubscribe,
  };
};

export default useMQTT;
