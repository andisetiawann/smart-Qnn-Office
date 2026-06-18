import mqtt from 'mqtt';
import { logDeviceActivity, updateDeviceStatus } from './dbService';

class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.listeners = new Map();

    // Public HiveMQ broker
    this.brokerURL = 'wss://broker.hivemq.com:8884/mqtt';

    this.username = '';   
    this.password = '';
  }

  connect(options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const clientOptions = {
          clientId: `queen-hub-${Date.now()}`,
          clean: true,
          connectTimeout: 10000,
          reconnectPeriod: 5000,

          ...options,
        };

        console.log('Connecting MQTT...');

        this.client = mqtt.connect(
          this.brokerURL,
          clientOptions
        );

        this.client.on('connect', () => {
          console.log('MQTT Connected');
          this.isConnected = true;

          this.notifyListeners(
            'connectionStatus',
            { connected: true }
          );

          resolve(true);
        });

        this.client.on('message', (topic, message) => {
          let payloadStr = message.toString();
          let finalState = null;
          let parsedPayload = null;

          try {
            parsedPayload = JSON.parse(payloadStr);
            if (parsedPayload.state) finalState = parsedPayload.state;
          } catch {
            finalState = payloadStr.trim();
          }

          // === FIX HARDWARE RELAY TERBALIK ===
          // Membalik status pesan dari ESP agar UI Web & Database tetap sinkron
          if (finalState === 'ON') {
            finalState = 'OFF';
          } else if (finalState === 'OFF') {
            finalState = 'ON';
          }

          if (parsedPayload && parsedPayload.state) {
            parsedPayload.state = finalState;
          } else {
            payloadStr = finalState;
          }

          // --- SIMPAN LOG KE SUPABASE OTOMATIS ---
          let deviceId = null;
          if (topic === 'queen/lampu') deviceId = 'lampu1';
          else if (topic.includes('lampuDapur')) deviceId = 'lampuDapur';
          else if (topic.includes('lampu2')) deviceId = 'lampu2';
          else if (topic.includes('lampu3')) deviceId = 'lampu3';

          if (deviceId && (finalState === 'ON' || finalState === 'OFF')) {
            logDeviceActivity(deviceId, finalState);
            updateDeviceStatus(deviceId, finalState, true);
          }
          // ---------------------------------------

          this.notifyListeners(topic, parsedPayload || payloadStr);
        });

        this.client.on('error', (error) => {
          console.error(
            'MQTT Error:',
            error
          );

          this.notifyListeners(
            'error',
            error
          );

          reject(error);
        });

        this.client.on('reconnect', () => {
          console.log(
            'MQTT Reconnecting...'
          );

          this.notifyListeners(
            'connectionStatus',
            { connecting: true }
          );
        });

        this.client.on('close', () => {
          console.log('MQTT Closed');

          this.isConnected = false;

          this.notifyListeners(
            'connectionStatus',
            { connected: false }
          );
        });

        this.client.on('offline', () => {
          console.log('MQTT Offline');

          this.isConnected = false;
        });
      } catch (error) {
        console.error(
          'Failed to connect MQTT:',
          error
        );

        reject(error);
      }
    });
  }

  subscribe(topic, callback) {
    if (!this.client) {
      console.warn(
        'MQTT client not initialized'
      );
      return;
    }

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(
          `Subscribe failed: ${topic}`,
          err
        );
      } else {
        console.log(
          `Subscribed: ${topic}`
        );
      }
    });

    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, []);
    }

    this.listeners
      .get(topic)
      .push(callback);
  }

  unsubscribe(topic, callback) {
    if (!this.client) return;

    if (this.listeners.has(topic)) {
      const callbacks =
        this.listeners.get(topic);

      const index =
        callbacks.indexOf(callback);

      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }

    if (
      !this.listeners.has(topic) ||
      this.listeners.get(topic)
        .length === 0
    ) {
      this.client.unsubscribe(topic);
      this.listeners.delete(topic);
    }
  }

  publish(topic, payload) {
    if (!this.client?.connected) {
      console.warn(
        'MQTT client not connected'
      );
      return false;
    }

    try {
      console.log(
        'Publishing MQTT'
      );
      console.log(
        'Topic:',
        topic
      );
      console.log(
        'Payload:',
        payload
      );

      // === FIX HARDWARE RELAY TERBALIK ===
      // Membalik perintah dari tombol sebelum dikirim ke ESP
      let messageToSend = payload;
      if (typeof payload === 'string') {
        if (payload === 'ON') messageToSend = 'OFF';
        else if (payload === 'OFF') messageToSend = 'ON';
      } else if (payload && payload.state) {
        const clonedPayload = { ...payload };
        if (clonedPayload.state === 'ON') clonedPayload.state = 'OFF';
        else if (clonedPayload.state === 'OFF') clonedPayload.state = 'ON';
        messageToSend = clonedPayload;
      }

      const messageStr = typeof messageToSend === 'string' 
        ? messageToSend 
        : JSON.stringify(messageToSend);

      this.client.publish(
        topic,
        messageStr
      );

      return true;
    } catch (error) {
      console.error(
        'Publish failed:',
        error
      );

      return false;
    }
  }

  notifyListeners(topic, message) {
    const callbacks =
      this.listeners.get(topic);

    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error(
            'Listener Error:',
            error
          );
        }
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners
      .get(event)
      .push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks =
        this.listeners.get(event);

      const index =
        callbacks.indexOf(callback);

      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export default new MQTTService();