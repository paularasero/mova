import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Activity from './pages/Activity';
import CreatePlan from './pages/CreatePlan';
import Community from './pages/Community';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/Map';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Onboarding from './pages/Onboarding';
import PlanDetail from './pages/PlanDetail';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Rewards from './pages/Rewards';
import Saved from './pages/Saved';
import { getCurrentUser } from './lib/auth';
import Settings from './pages/Settings';
import SetupOnboarding from './pages/SetupOnboarding';

const hideNavbarRoutes = ['/', '/login', '/register', '/setup'];

export default function App() {
  const location = useLocation();
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const currentUser = getCurrentUser();

  function PrivateRoute({ children }) {
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/home" replace /> : <Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<PrivateRoute><SetupOnboarding /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
        <Route path="/plan/:id" element={<PrivateRoute><PlanDetail /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreatePlan /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/saved" element={<PrivateRoute><Saved /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
        <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNavbar && currentUser && <Navbar />}
    </div>
  );
}
