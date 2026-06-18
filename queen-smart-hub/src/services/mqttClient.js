```javascript
import mqtt from "mqtt";

const client = mqtt.connect(
  "ws://broker.hivemq.com:8000/mqtt"
);

client.on("connect", () => {
  console.log("MQTT Connected");
});

client.on("error", (err) => {
  console.log("MQTT Error:", err);
});

export default client;
```
