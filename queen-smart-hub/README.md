# Queen Smart Light - Professional IoT Dashboard

Modern IoT Dashboard untuk mengontrol dan memonitor lampu kantor berbasis ESP32 dan MQTT dengan interface yang elegant dan responsive.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-brightgreen)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Fitur Utama

✨ **Real-time Device Control** - Kontrol lampu secara realtime melalui MQTT  
📊 **Live Monitoring** - Monitor status perangkat, WiFi signal, dan latency  
📈 **Advanced Analytics** - Visualisasi penggunaan energi dengan grafik interaktif  
📱 **Fully Responsive** - Optimal untuk desktop, tablet, dan mobile  
🎨 **Modern Design** - Clean, professional, dan elegant interface  
🌙 **Dark Mode** - Theme gelap untuk kenyamanan mata  
⚡ **Smooth Animations** - Framer Motion animations yang halus  
🔐 **Secure MQTT** - WebSocket secure connection support  

## 📋 Requirements

- Node.js 16.0 atau lebih tinggi
- npm 8.0 atau yarn
- MQTT Broker (default: broker.hivemq.com)

## ⚙️ Quick Start

### Installation

```bash
# Clone atau extract project
cd queen-smart-hub

# Install dependencies
npm install

# Run development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure

```
queen-smart-hub/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Sidebar/            # Navigation sidebar
│   │   ├── Header/             # Top header
│   │   ├── DeviceCard/         # Device control
│   │   ├── StatusCard/         # Statistics
│   │   └── ...
│   ├── pages/                  # Page components
│   │   ├── Dashboard/          # Main dashboard
│   │   ├── Devices/            # Device list
│   │   ├── Monitoring/         # Real-time monitoring
│   │   ├── Analytics/          # Usage charts
│   │   └── Settings/           # Configuration
│   ├── services/
│   │   └── mqttService.js      # MQTT client
│   ├── hooks/
│   │   └── useMQTT.js          # MQTT hook
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── public/                      # Static assets
├── tailwind.config.js          # Tailwind config
├── vite.config.js              # Vite config
└── package.json                # Dependencies
```

## 🔧 MQTT Configuration

### Default Settings

```javascript
Broker: wss://broker.hivemq.com:8884/mqtt
Protocol: MQTT over WebSocket Secure
```

### Device Topics

```
queen/lampu/1/control   → Control Lampu Ruang 1
queen/lampu/1/status    ← Status Lampu Ruang 1
queen/lampu/2/control   → Control Lampu Ruang 2
queen/lampu/2/status    ← Status Lampu Ruang 2
queen/lampu/3/control   → Control Lampu Ruang 3
queen/lampu/3/status    ← Status Lampu Ruang 3
```

### Message Format

**Turn ON:**
```json
{"state":"ON"}
```

**Turn OFF:**
```json
{"state":"OFF"}
```

## 📱 Pages Overview

### 1. Dashboard
- 4 Statistics Cards (Total Device, Online, Active Lights, Energy)
- 3 Device Control Cards dengan real-time toggle
- Quick tips section
- Responsive grid layout

### 2. Devices
- Device list dengan search & filter
- Location-based organization
- Connection status indicator
- Device information display

### 3. Monitoring
- Real-time status monitoring
- Device activity log
- WiFi signal strength bars
- Connection statistics
- Ping latency display

### 4. Analytics
- Daily usage line chart
- Weekly comparison bar chart
- Monthly trend analysis
- Usage peak information
- Average consumption metrics

### 5. Settings
- MQTT broker configuration
- Device name customization
- Dark mode toggle
- Security guidelines
- Configuration hints

## 🎨 Design System

### Color Palette
```
Primary Blue:    #0A66FF
Secondary Red:   #E53935
Background:      #FFFFFF
Text Dark:       #1F2937
Text Light:      #6B7280
Border:          #E5E7EB
```

### Typography
```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell
Heading:     Bold (500-700)
Body:        Regular (400)
Small:       Regular (400) - 12px - 14px
```

### Spacing & Radius
```
Card Border Radius:  20px
Button Radius:       8px
Component Padding:   16px - 24px
Shadow:              0 2px 8px rgba(0, 0, 0, 0.1)
```

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 19 |
| **Vite** | Build Tool | 8 |
| **Tailwind CSS** | Styling | 3 |
| **Framer Motion** | Animations | 12+ |
| **Lucide React** | Icons | 1+ |
| **Recharts** | Charts | 3+ |
| **mqtt.js** | MQTT Client | 5+ |
| **React Router** | Routing | 7+ |
| **React Hot Toast** | Notifications | 2+ |

## 🎯 Component Architecture

### Responsive Sidebar
- Mobile: Toggle menu with overlay
- Desktop: Fixed sidebar navigation
- Smooth animations
- Active link highlighting

### Responsive Header
- Real-time clock
- MQTT connection status
- ESP32 device status
- User profile section
- Error indicators

### Device Cards
- Loading state with spinner
- Real-time status updates
- Last updated timestamp
- WiFi signal indicator
- Smooth toggle animation
- Toast notifications

### Status Cards
- Gradient backgrounds
- Trend indicators
- Hover scale effects
- Icon animations
- Responsive grid

## 📊 State Management

```javascript
// Dashboard state
- totalDevices: number
- onlineDevices: number
- activeLights: number
- energyUsage: number

// Device state
- id: string
- name: string
- isOn: boolean
- isOnline: boolean
- lastUpdated: Date

// MQTT state
- isConnected: boolean
- error: Error | null
- brokerSettings: object
```

## 🔄 MQTT Flow

```
1. Connect to Broker
   ↓
2. Subscribe to status topics
   ↓
3. Listen for messages
   ↓
4. Update local state
   ↓
5. Render UI changes
   ↓
6. User clicks toggle
   ↓
7. Publish control message
   ↓
8. Device responds with status
   ↓
9. UI updates automatically
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Build project
npm run build

# Connect to Vercel
# Push to GitHub and deploy via Vercel dashboard
```

### Other Platforms

```bash
# Build for production
npm run build

# Dist folder contains optimized files
# Deploy dist/ to your hosting provider
# Examples: Netlify, Firebase, AWS S3, etc.
```

### Environment Variables

Create `.env.local` for custom settings:
```
VITE_MQTT_BROKER=wss://your-broker.com:8884/mqtt
VITE_MQTT_USERNAME=your_username
VITE_MQTT_PASSWORD=your_password
```

## 🔐 Security Best Practices

✅ **For Production:**
- Use secured MQTT broker with TLS/SSL (WSS)
- Implement proper authentication (username/password)
- Store credentials in environment variables
- Regular firmware updates for ESP32
- Use strong, unique passwords
- Implement rate limiting
- Enable CORS properly
- Regular security audits

❌ **Avoid:**
- Plain HTTP (use HTTPS/WSS)
- Hardcoded credentials
- Insecure MQTT brokers
- Outdated firmware versions
- Weak passwords

## 📈 Performance Optimization

- Code splitting with React Router
- Lazy loading components
- Optimized Tailwind CSS
- MQTT connection pooling
- Efficient re-renders with React
- Image optimization
- Gzip compression
- CDN deployment

## 🧪 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| Mobile | ✅ iOS 12+ / Android 8+ |

## 🐛 Troubleshooting

### MQTT Connection Failed
```
Solution:
1. Check broker URL is correct
2. Verify internet connection
3. Check firewall/proxy settings
4. Try different MQTT broker
```

### Device Not Responding
```
Solution:
1. Verify ESP32 is powered on
2. Check WiFi connection
3. Verify topic names match
4. Check device firmware
```

### UI Not Updating
```
Solution:
1. Check browser console for errors
2. Clear cache and reload
3. Check MQTT messages in browser DevTools
4. Verify state management logic
```

## 📚 Documentation

- [MQTT.js Documentation](https://github.com/mqttjs/MQTT.js)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

Queen Smart Light Development Team

## 🙏 Acknowledgments

- MQTT.js community
- Tailwind CSS team
- React community
- Framer Motion creators

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: June 9, 2026  

For issues and questions, please open an issue on the repository.

