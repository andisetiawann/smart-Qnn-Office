import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedLayout } from './components/ProtectedRoute/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Devices } from './pages/Devices/Devices';
import { Automation } from './pages/Automation/Automation';
import { Monitoring } from './pages/Monitoring/Monitoring';
import { Analytics } from './pages/Analytics/Analytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;