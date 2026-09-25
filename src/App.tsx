import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Welcome } from './pages/Welcome';
import { Survey } from './pages/Survey';
import { Success } from './pages/Success';
import { Stats } from './pages/Stats';
import { Feedback } from './pages/Feedback';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { auth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

const ADMIN_EMAIL = "hainguyenbtm.070589@gmail.com";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#0759A6] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Strictly verify admin identity
  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Welcome />} />
          <Route path="survey" element={<Survey />} />
          <Route path="success" element={<Success />} />
          <Route path="stats" element={<Stats />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
