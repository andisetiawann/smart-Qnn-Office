Queen Smart Home IoT

Queen Smart Home IoT adalah sistem Smart Home berbasis ESP8266 (NodeMCU) dan MQTT yang memungkinkan pengguna mengontrol beberapa perangkat listrik secara real-time melalui dashboard web. Sistem ini dilengkapi dengan tampilan LCD, status perangkat, konektivitas WiFi, serta dirancang agar mudah dikembangkan untuk kebutuhan Smart Home yang lebih kompleks.

🚀 Fitur Utama
✅ Kontrol Lampu melalui Web Dashboard
✅ Kontrol Terminal/Kipas melalui Web Dashboard
✅ Komunikasi Real-Time menggunakan MQTT
✅ LCD I2C 16x2 sebagai display status sistem
✅ Menampilkan status Lampu dan Terminal
✅ Menampilkan status koneksi WiFi
✅ Menampilkan jam real-time (NTP)
✅ Auto reconnect WiFi dan MQTT
✅ Multi Relay (4 Channel)
✅ Dashboard berbasis React + Vite
✅ Monitoring status perangkat secara real-time
✅ Arsitektur modular sehingga mudah dikembangkan
Arsitektur Sistem
                    WEB DASHBOARD
                    React + Vite
                           │
                    MQTT Publish/Subscribe
                           │
                   broker.hivemq.com
                           │
                    NodeMCU ESP8266
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
      Relay 1           Relay 2            LCD I2C
      Lampu             Terminal          16x2 Display
Hardware yang Digunakan
Komponen	Jumlah
NodeMCU ESP8266	1
Relay Module 4 Channel	1
LCD I2C 16x2	1
PCB Matrix	1
Kabel Jumper	Secukupnya
Box/Casing	1
Power Supply 5V	1
Breadboard (Prototype)	1
Software yang Digunakan
Arduino IDE
Visual Studio Code
React + Vite
MQTT.js
PubSubClient
LiquidCrystal_I2C
NTPClient
ESP8266WiFi
HiveMQ Public Broker
MQTT Topic
Lampu
queen/lampu

Payload:

ON
OFF
Terminal
queen/terminal

Payload:

ON
OFF
LCD Display
Halaman 1
Queen Smart
System Ready
Halaman 2
L:ON T:OFF
14:35 WiFi OK

Halaman berganti otomatis setiap 3 detik.

Struktur Project
Queen-Smart-Home/
│
├── hardware/
│   ├── NodeMCU ESP8266
│   ├── Relay 4 Channel
│   ├── LCD I2C 16x2
│   └── PCB Layout
│
├── firmware/
│   ├── QueenSmartHome.ino
│   └── library
│
├── web-dashboard/
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── hooks
│   └── mqttService.js
│
├── images/
├── README.md
└── LICENSE
Cara Menjalankan
1. Clone Repository
git clone https://github.com/username/Queen-Smart-Home.git
2. Install Dependencies
npm install
3. Jalankan Dashboard
npm run dev

Dashboard akan berjalan di:

http://localhost:5173
Upload Firmware ESP8266

Buka:

firmware/QueenSmartHome.ino

Upload menggunakan Arduino IDE.

Library yang diperlukan:

ESP8266WiFi
PubSubClient
LiquidCrystal_I2C
NTPClient
WiFiUdp
Pengembangan Selanjutnya
Monitoring Energi

Menggunakan:

PZEM-004T V3

Menampilkan:

Tegangan (Volt)
Arus (Ampere)
Daya (Watt)
Energi (kWh)
Sensor Lingkungan
DHT11
DHT22

Monitoring:

Suhu
Kelembaban
Sistem Otomatisasi
Timer ON/OFF
Scheduler
Sunset/Sunrise Mode
Kontrol Manual

Penambahan push button sehingga perangkat dapat dikontrol dari:

Web Dashboard
Saklar Manual

Tanpa saling mengganggu.

Integrasi Mobile
Flutter
React Native
Integrasi Cloud
HiveMQ Cloud
Firebase
Supabase
Notifikasi
Telegram Bot
WhatsApp Notification
Email Alert
Monitoring Real-Time
Grafik konsumsi daya
Riwayat penggunaan
Logging aktivitas perangkat
Future Development
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
Author

Andi Setiawan

Politeknik Negeri Lampung
Internet Engineering Technology

Interests:

IoT Development
Network Engineer
Cloud Computing
Cyber Security
Blue Team SOC
License

This project is open source and available under the MIT License.
