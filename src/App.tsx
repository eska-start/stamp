import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChildRegisterPage from './pages/ChildRegisterPage';
import HomePage from './pages/HomePage';
import StampBookPage from './pages/StampBookPage';
import RewardsPage from './pages/RewardsPage';
import ParentDashboard from './pages/ParentDashboard';
import MissionEditor from './pages/MissionEditor';
import RewardEditor from './pages/RewardEditor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/child" element={<ChildRegisterPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/stampbook" element={<ProtectedRoute><StampBookPage /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
      <Route path="/parent/missions" element={<ProtectedRoute><MissionEditor /></ProtectedRoute>} />
      <Route path="/parent/rewards" element={<ProtectedRoute><RewardEditor /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
