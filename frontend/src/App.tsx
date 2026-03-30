import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DecisionDetail from './pages/DecisionDetail';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <div style={{ marginLeft: 240 }} className="p-8 min-h-screen">
        <div className="max-w-[1100px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/decisions/:id" element={
        <ProtectedRoute><DashboardLayout><DecisionDetail /></DashboardLayout></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
