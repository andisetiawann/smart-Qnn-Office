# 🏠 Queen Smart Home IoT

Queen Smart Home IoT is a smart home system based on **ESP8266 (NodeMCU)** and **MQTT**, allowing users to control electrical devices in real time through a web dashboard. The system features LCD status display, WiFi connectivity, and is designed to be scalable for future smart home development.

---

## 🚀 Features

- ✅ Real-time device control using MQTT
- ✅ Smart Lamp Control
- ✅ Smart Terminal / Fan Control
- ✅ LCD I2C 16x2 Status Display
- ✅ WiFi Connection Monitoring
- ✅ Real-Time Clock (NTP)
- ✅ Automatic MQTT Reconnection
- ✅ Automatic WiFi Reconnection
- ✅ Multi Relay Support (4 Channel)
- ✅ Web Dashboard (React + Vite)
- ✅ Real-Time Device Monitoring
- ✅ Modular and Scalable Architecture

---

# 🏗️ System Architecture

```text
                 Web Dashboard
                  React + Vite
                        │
                 MQTT Publish/Subscribe
                        │
                broker.hivemq.com
                        │
                  NodeMCU ESP8266
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
   Relay 1          Relay 2            LCD I2C
 Smart Lamp      Smart Terminal         16x2
```

---

# 📦 Hardware Components

| Component | Quantity |
|------------|----------|
| NodeMCU ESP8266 | 1 |
| Relay Module 4 Channel | 1 |
| LCD I2C 16x2 | 1 |
| PCB Matrix Board | 1 |
| Jumper Wires | Several |
| Plastic Enclosure | 1 |
| Power Supply 5V | 1 |
| Breadboard (Prototype) | 1 |

---

# 💻 Software & Libraries

### Development Tools

- Arduino IDE
- Visual Studio Code
- React + Vite

### Arduino Libraries

- ESP8266WiFi
- PubSubClient
- LiquidCrystal_I2C
- NTPClient
- WiFiUdp

### Web Libraries

- React
- MQTT.js
- TailwindCSS
- React Router
- Framer Motion

---

# 📡 MQTT Topics

## Smart Lamp

**Topic**

```text
queen/lampu
```

**Payload**

```text
ON
OFF
```

---

## Smart Terminal / Fan

**Topic**

```text
queen/terminal
```

**Payload**

```text
ON
OFF
```

---

# 🖥 LCD Display

### Page 1

```text
Queen Smart
System Ready
```

### Page 2

```text
L:ON T:OFF
14:35 WiFi OK
```

LCD pages automatically change every 3 seconds.

---

# 📂 Project Structure

```bash
Queen-Smart-Home
│
├── firmware
│   └── QueenSmartHome.ino
│
├── web-dashboard
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── hardware
│   ├── NodeMCU ESP8266
│   ├── Relay 4CH
│   ├── LCD I2C
│   └── PCB Layout
│
├── images
├── README.md
└── LICENSE
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Queen-Smart-Home.git
```

## Go to Project Directory

```bash
cd Queen-Smart-Home
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Dashboard will be available at:

```text
http://localhost:5173
```

---

# 🔌 Upload Firmware

Open:

```text
firmware/QueenSmartHome.ino
```

Upload using Arduino IDE.

---

# 📈 Future Development

## 🔋 Energy Monitoring

Using:

- PZEM-004T V3

Features:

- Voltage Monitoring
- Current Monitoring
- Power Monitoring
- Energy Consumption (kWh)

---

## 🌡 Environmental Monitoring

Using:

- DHT11
- DHT22

Features:

- Temperature Monitoring
- Humidity Monitoring

---

## ⏰ Smart Automation

- Timer ON/OFF
- Scheduler
- Sunrise & Sunset Mode

---

## 🎛 Manual Override

Control devices from:

- Web Dashboard
- Physical Switch

Without interrupting each other.

---

## 📱 Mobile Application

Future support:

- Flutter
- React Native

---

## ☁ Cloud Integration

- HiveMQ Cloud
- Firebase
- Supabase

---

## 🔔 Notification System

- Telegram Bot
- WhatsApp Notification
- Email Alert

---

## 📊 Real-Time Monitoring

- Device Logs
- Energy Usage History
- Activity Statistics

---

# 🚀 Roadmap

```text
Queen Smart Home V2
│
├── Smart Lamp
├── Smart Terminal
├── Smart Fan
├── Smart Curtain
├── Smart Door Lock
├── Smart Energy Monitoring
├── Temperature Monitoring
├── Mobile Application
├── Cloud Database
└── AI Automation
```

---

# 👨‍💻 Author

**Andi Setiawan**

Internet Engineering Technology Student  
Politeknik Negeri Lampung

### Interests

- IoT Development
- Network Engineering
- Cloud Computing
- Cyber Security
- Blue Team SOC

---

# ⭐ Support

If you find this project useful, please consider giving it a **Star ⭐** on GitHub.

---

# 📜 License

This project is licensed under the **MIT License**.
