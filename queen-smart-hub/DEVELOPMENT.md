# Queen Smart Light - Development Guide

## Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Start dev server (auto-reload on changes)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Architecture

### Component Hierarchy

```
App (Router)
├── Sidebar (Navigation)
├── Header (Status Bar)
└── Routes
    ├── Dashboard
    │   ├── StatusCard (x4)
    │   └── DeviceCard (x3)
    ├── Devices
    │   └── DeviceCard (x3)
    ├── Monitoring
    │   ├── Status Cards
    │   ├── Device Table
    │   └── Activity Log
    ├── Analytics
    │   ├── LineChart (Daily)
    │   ├── BarChart (Weekly)
    │   └── LineChart (Monthly)
    └── Settings
        └── Configuration Forms
```

### Data Flow

```
MQTT Service
    ↓
useMQTT Hook
    ↓
Component State
    ↓
UI Render
    ↓
User Interaction
    ↓
Publish to MQTT
```

## Code Style Guidelines

### File Structure
```
ComponentName/
├── ComponentName.jsx    # Main component file
└── [index.jsx]          # Optional: for barrel exports
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.jsx`)
- **Hooks**: camelCase with `use` prefix (`useMQTT.js`)
- **Services**: camelCase (`mqttService.js`)
- **Utils**: camelCase (`helper.js`)
- **Constants**: UPPER_SNAKE_CASE (`MQTT_TOPICS.js`)
- **CSS Classes**: kebab-case (`.my-class`)

### React Best Practices

```javascript
// Use functional components
export const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects here
  }, []);
  
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
};

export default MyComponent;
```

### Props Validation

```javascript
export const MyComponent = ({ title, count, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

## MQTT Development

### Testing MQTT Locally

```bash
# Using mosquitto
mosquitto -p 1883

# Or connect to public broker
# broker.hivemq.com:8884 (WebSocket)
# test.mosquitto.org:8884 (WebSocket)
```

### Testing Device Commands

Use MQTT Client or CLI:
```bash
# Subscribe to status
mosquitto_sub -h broker.hivemq.com -t "queen/lampu/+/status" -p 8884

# Publish control
mosquitto_pub -h broker.hivemq.com -t "queen/lampu/1/control" \
  -m '{"state":"ON"}' -p 8884
```

## Styling Guidelines

### Tailwind Utility Usage

```jsx
// ✅ DO: Use Tailwind classes
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>

// ✅ DO: Use custom component classes
<div className="card-base">
  Content
</div>

// ❌ DON'T: Mix inline styles with Tailwind
<div style={{ color: 'red' }} className="text-blue-600">
  Wrong approach
</div>
```

### Color Variables

Use Tailwind config colors:
```
primary:   bg-primary / text-primary
secondary: bg-secondary / text-secondary
```

## State Management

### Local Component State
```javascript
const [isLoading, setIsLoading] = useState(false);
```

### Shared State (MQTT)
```javascript
const { isConnected, publish, subscribe } = useMQTT();
```

### Effects and Cleanup
```javascript
useEffect(() => {
  const handleMessage = (msg) => {
    // Handle message
  };
  
  subscribe(topic, handleMessage);
  
  return () => {
    unsubscribe(topic, handleMessage);
  };
}, []);
```

## Performance Optimization

### Code Splitting
```javascript
const Analytics = lazy(() => import('./pages/Analytics'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
```

### Memoization
```javascript
import { memo } from 'react';

export const OptimizedComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

### Callback Optimization
```javascript
const handleAction = useCallback(() => {
  // Action here
}, []);
```

## Error Handling

### Try-Catch Pattern
```javascript
const handleToggle = async () => {
  try {
    const success = publish(topic, payload);
    if (success) {
      toast.success('Device toggled successfully');
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};
```

### MQTT Error Handling
```javascript
mqttService.addEventListener('error', (error) => {
  console.error('MQTT Error:', error);
  toast.error('Connection failed');
});
```

## Testing

### Unit Testing Example
```javascript
// __tests__/components/DeviceCard.test.jsx
import { render, screen } from '@testing-library/react';
import { DeviceCard } from '../DeviceCard';

describe('DeviceCard', () => {
  it('renders device name', () => {
    render(<DeviceCard name="Lampu 1" />);
    expect(screen.getByText('Lampu 1')).toBeInTheDocument();
  });
});
```

## Debugging

### Browser DevTools
```javascript
// Log MQTT messages
window.__MQTT__ = {
  messages: []
};

// Access from console
console.log(window.__MQTT__.messages);
```

### VS Code Debugging
Add `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## Common Issues & Solutions

### Issue: MQTT Connection Failed
```
Solution:
1. Check broker URL in Settings page
2. Verify internet connection
3. Check if WebSocket port is correct (8884 for HiveMQ)
4. Try different broker (test.mosquitto.org)
```

### Issue: Device Not Responding
```
Solution:
1. Check MQTT topic names match ESP32 firmware
2. Verify device is online
3. Check MQTT message format ({"state":"ON"})
4. Monitor MQTT messages in browser console
```

### Issue: Performance Issues
```
Solution:
1. Use React DevTools Profiler
2. Optimize re-renders with memo()
3. Check for unnecessary subscriptions
4. Monitor network requests in DevTools
```

## Build & Deploy

### Production Build
```bash
npm run build

# Check bundle size
npm run build -- --analyze
```

### Environment Variables
Create `.env.local`:
```
VITE_MQTT_BROKER=wss://your-broker.com:8884/mqtt
VITE_MQTT_USERNAME=username
VITE_MQTT_PASSWORD=password
```

### Deploy to Vercel
```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import repository
# 3. Set environment variables
# 4. Deploy
```

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [MQTT.js Docs](https://github.com/mqttjs/MQTT.js)
- [Framer Motion](https://www.framer.com/motion)

## Questions?

Check the README.md for general project information or open an issue on the repository.
