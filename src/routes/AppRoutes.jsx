import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAccess } from '../utils/roles';

import Layout from '../components/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/users/Users';
import Employees from '../pages/employees/Employees';
import Vehicles from '../pages/vehicles/Vehicles';
import Clients from '../pages/clients/Clients';
import Sales from '../pages/sales/Sales';

const ProtectedRoute = ({ children, page }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (page && !hasAccess(user.role, page)) return <Navigate to="/dashboard" replace />;

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-400 mt-3">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={
          <ProtectedRoute page="dashboard"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute page="users"><Users /></ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute page="employees"><Employees /></ProtectedRoute>
        } />
        <Route path="/vehicles" element={
          <ProtectedRoute page="vehicles"><Vehicles /></ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute page="clients"><Clients /></ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute page="sales"><Sales /></ProtectedRoute>
        } />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export default AppRoutes;