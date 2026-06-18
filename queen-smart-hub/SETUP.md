# 🚀 Queen Smart Light - Setup Guide

Complete setup instructions untuk menjalankan Queen Smart Light IoT Dashboard.

## ✅ Prerequisites

Pastikan Anda memiliki:
- **Node.js** v16.0 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** v8.0 atau yarn
- **Git** (opsional, untuk clone repository)
- MQTT Broker (default: broker.hivemq.com)

Cek versi:
```bash
node --version    # v16.0.0 atau lebih
npm --version     # v8.0.0 atau lebih
```

## 📦 Installation Steps

### 1. Clone atau Extract Project

```bash
# Jika dari GitHub
git clone https://github.com/yourusername/queen-smart-hub.git
cd queen-smart-hub

# Atau jika sudah di-extract
cd queen-smart-hub
```

### 2. Install Dependencies

```bash
npm install
```

Proses ini akan menginstall semua dependencies yang diperlukan:
- React 19
- Vite 8
- Tailwind CSS 3
- Framer Motion
- MQTT.js
- Recharts
- Dan lainnya...

### 3. Configure Environment (Optional)

Buat file `.env.local` untuk konfigurasi custom:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_MQTT_BROKER=wss://broker.hivemq.com:8884/mqtt
VITE_MQTT_USERNAME=
VITE_MQTT_PASSWORD=
VITE_DEVICE_NAME=Queen Smart Light
```

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di:
- Local: http://localhost:5173
- Network: Lihat console output untuk IP address

**Features:**
- ✅ Hot reload on file changes
- ✅ Error display in browser
- ✅ Source maps for debugging

### Production Build

```bash
npm run build
```

Output akan di-save ke folder `dist/`

**Check bundle size:**
```bash
npm run build
ls -lh dist/
```

### Preview Production Build

```bash
npm run preview
```

Untuk test build sebelum deploy.

## 📝 Initial Configuration

Setelah aplikasi berjalan, konfigurasi MQTT:

1. Buka http://localhost:5173
2. Klik menu **Settings**
3. Konfigurasikan:
   - **MQTT Broker**: `wss://broker.hivemq.com:8884/mqtt`
   - **Device Name**: `Queen Smart Light`
   - **Base Topic**: `queen/lampu`
4. Klik **Save Settings**

## 🧪 Testing

### Test MQTT Connection

1. Buka aplikasi di browser
2. Cek header untuk status "MQTT: Connected"
3. Jika offline, check:
   - Internet connection
   - Firewall/proxy settings
   - Broker URL di Settings

### Test Device Control

1. Pergi ke Dashboard
2. Klik tombol "Turn ON" pada salah satu device card
3. Lihat status berubah menjadi "ON"
4. Klik "Turn OFF" untuk mematikan

### Test Monitoring

1. Buka halaman **Monitoring**
2. Lihat status real-time semua devices
3. Check WiFi signal strength
4. Monitor activity log

### Test Analytics

1. Buka halaman **Analytics**
2. Lihat grafik penggunaan
3. Check peak usage dan average

## 🔧 Advanced Configuration

### Custom MQTT Broker

Edit `.env.local`:
```
VITE_MQTT_BROKER=wss://your-broker.com:8884/mqtt
VITE_MQTT_USERNAME=your_username
VITE_MQTT_PASSWORD=your_password
```

### Custom Device Topics

Edit dalam kode atau config:
```javascript
// src/pages/Dashboard/Dashboard.jsx
const devices = [
  { id: 'lamp-001', name: 'Lampu Ruang 1', topic: 'custom/topic/1/control' },
  // ...
];
```

## 📱 Mobile Responsiveness

Aplikasi fully responsive untuk:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

Test menggunakan Chrome DevTools (F12 → Toggle device toolbar)

## 🐛 Troubleshooting

### Issue: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Alternative: use yarn
yarn install
```

### Issue: MQTT connection fails

```
1. Check internet connection
2. Test broker: mosquitto_sub -h broker.hivemq.com -t "test" -p 8884
3. Check firewall/proxy
4. Try different broker (test.mosquitto.org)
5. Check browser console for errors (F12)
```

### Issue: Port already in use

```bash
# If port 5173 is in use, Vite will auto-select another
# Or specify custom port:
npm run dev -- --port 3000
```

### Issue: Build fails

```bash
# Clear build cache
rm -rf dist node_modules/.vite

# Try again
npm run build

# Check Node version
node --version  # Should be v16+
```

### Issue: MQTT messages not updating

```
1. Check topic names match device firmware
2. Verify message format: {"state":"ON"} or {"state":"OFF"}
3. Check browser console (F12) for errors
4. Verify devices are online
5. Check MQTT broker is accessible
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import repository
5. Set environment variables (if needed)
6. Click "Deploy"

### Deploy to Netlify

```bash
# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Firebase

```bash
npm install -g firebase-tools

firebase init hosting
firebase deploy
```

### Manual Deployment

```bash
# Build
npm run build

# Upload dist/ folder to:
# - AWS S3 + CloudFront
# - Heroku
# - DigitalOcean
# - Any static hosting service
```

## ✨ Final Checklist

Before going to production:

- [ ] Test all device controls
- [ ] Verify MQTT connection stable
- [ ] Check responsive design on mobile
- [ ] Test dark mode (if implemented)
- [ ] Verify analytics graphs display
- [ ] Check monitoring page real-time updates
- [ ] Test settings configuration
- [ ] Verify error handling
- [ ] Check performance (DevTools Lighthouse)
- [ ] Test on different browsers

## 📚 Additional Resources

- **Project README**: See `README.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **MQTT Reference**: [mqtt.js docs](https://github.com/mqttjs/MQTT.js)
- **React**: [react.dev](https://react.dev)
- **Tailwind**: [tailwindcss.com](https://tailwindcss.com)
- **Vite**: [vitejs.dev](https://vitejs.dev)

## 🆘 Getting Help

1. Check error messages in browser console (F12)
2. Read DEVELOPMENT.md for debugging tips
3. Check MQTT connections
4. Review README.md for architecture info

## 🎉 Success!

If everything works:
- ✅ App running at http://localhost:5173
- ✅ MQTT connected
- ✅ Devices controllable
- ✅ Analytics displaying

You're ready to use Queen Smart Light!

---

**Questions?** Open an issue or check the documentation.

Happy coding! 🚀
