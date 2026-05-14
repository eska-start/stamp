import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import BottomNav from './components/BottomNav';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useApp();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 float-anim">🦕</div>
          <div className="text-purple-600 font-black text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GlobalBottomNav() {
  const location = useLocation();
  const { currentUser } = useApp();
  if (!currentUser) return null;

  if (location.pathname === '/home') return <BottomNav active="home" />;
  if (location.pathname === '/stampbook') return <BottomNav active="stampbook" />;
  if (location.pathname === '/rewards') return <BottomNav active="rewards" />;
  return null;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/child" element={<ChildRegisterPage />} />
        <Route path="/home"           element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/stampbook"      element={<ProtectedRoute><StampBookPage /></ProtectedRoute>} />
        <Route path="/rewards"        element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/parent"         element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/parent/missions" element={<ProtectedRoute><MissionEditor /></ProtectedRoute>} />
        <Route path="/parent/rewards"  element={<ProtectedRoute><RewardEditor /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalBottomNav />
    </>
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
