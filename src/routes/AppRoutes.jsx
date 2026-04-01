// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAccess } from '../utils/roles';

import Layout from '../components/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Administration & RH (existants)
import Users from '../pages/administration/users/Users';
import Employees from '../pages/administration/employees/Employees';

// Commercial & Parc Auto (existants)
import Vehicles from '../pages/commercial/vehicles/Vehicles';
import Sales from '../pages/commercial/sales/Sales';

// Clientèle (existant)
import Clients from '../pages/clientelle/clients/Clients';

// ═══════════════════════════════════════════
// PAGES PLACEHOLDER (temporaires)
// On les créera une par une aux prochaines étapes
// ═══════════════════════════════════════════
const Placeholder = ({ title }) => (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
  }}>
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '3rem 2rem',
      maxWidth: '500px',
      margin: '2rem auto',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: '#E3F2FD',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        fontSize: '1.5rem',
      }}>
        🚧
      </div>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.5rem',
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: '#64748b',
      }}>
        Cette page est en cours de développement
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// ROUTE PROTÉGÉE
// ═══════════════════════════════════════════
const ProtectedRoute = ({ children, page }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (page && !hasAccess(user.role, page)) return <Navigate to="/dashboard" replace />;

  return children;
};

// ═══════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #1976D2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            marginTop: '0.75rem',
          }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ═══ Auth (non protégé) ═══ */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* ═══ Routes protégées avec Layout ═══ */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* ─── Dashboard ─── */}
        <Route path="/dashboard" element={
          <ProtectedRoute page="dashboard">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* ─── Administration & RH ─── */}
        <Route path="/administration/users" element={
          <ProtectedRoute page="users">
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/administration/employees" element={
          <ProtectedRoute page="employees">
            <Employees />
          </ProtectedRoute>
        } />
        <Route path="/administration/hr-dossiers" element={
          <ProtectedRoute page="hrDossiers">
            <Placeholder title="Dossiers RH" />
          </ProtectedRoute>
        } />
        <Route path="/administration/roles" element={
          <ProtectedRoute page="rolesPermissions">
            <Placeholder title="Rôles & Permissions" />
          </ProtectedRoute>
        } />

        {/* ─── Commercial & Parc Auto ─── */}
        <Route path="/commercial/sales" element={
          <ProtectedRoute page="sales">
            <Sales />
          </ProtectedRoute>
        } />
        <Route path="/commercial/quotes" element={
          <ProtectedRoute page="quotes">
            <Placeholder title="Devis" />
          </ProtectedRoute>
        } />
        <Route path="/commercial/vehicles" element={
          <ProtectedRoute page="vehicles">
            <Vehicles />
          </ProtectedRoute>
        } />
        <Route path="/commercial/vehicle-stock" element={
          <ProtectedRoute page="vehicleStock">
            <Placeholder title="Stock Véhicules" />
          </ProtectedRoute>
        } />

        {/* ─── Service Clientèle ─── */}
        <Route path="/clientele/reception" element={
          <ProtectedRoute page="reception">
            <Placeholder title="Réception" />
          </ProtectedRoute>
        } />
        <Route path="/clientele/clients" element={
          <ProtectedRoute page="clients">
            <Clients />
          </ProtectedRoute>
        } />

        {/* ─── Service Technique ─── */}
        <Route path="/technique/revisions" element={
          <ProtectedRoute page="revisions">
            <Placeholder title="Révisions" />
          </ProtectedRoute>
        } />
        <Route path="/technique/repairs" element={
          <ProtectedRoute page="repairs">
            <Placeholder title="Réparations" />
          </ProtectedRoute>
        } />
        <Route path="/technique/interventions" element={
          <ProtectedRoute page="interventions">
            <Placeholder title="Interventions" />
          </ProtectedRoute>
        } />
        <Route path="/technique/technicians" element={
          <ProtectedRoute page="technicians">
            <Placeholder title="Techniciens" />
          </ProtectedRoute>
        } />

        {/* ─── Magasin & Pièces ─── */}
        <Route path="/magasin/parts" element={
          <ProtectedRoute page="parts">
            <Placeholder title="Pièces détachées" />
          </ProtectedRoute>
        } />
        <Route path="/magasin/parts-stock" element={
          <ProtectedRoute page="partsStock">
            <Placeholder title="Stock Pièces" />
          </ProtectedRoute>
        } />
        <Route path="/magasin/orders" element={
          <ProtectedRoute page="orders">
            <Placeholder title="Commandes" />
          </ProtectedRoute>
        } />
        <Route path="/magasin/suppliers" element={
          <ProtectedRoute page="suppliers">
            <Placeholder title="Fournisseurs" />
          </ProtectedRoute>
        } />

        {/* ─── Paramètres ─── */}
        <Route path="/settings/system" element={
          <ProtectedRoute page="settings">
            <Placeholder title="Système" />
          </ProtectedRoute>
        } />
        <Route path="/settings/company" element={
          <ProtectedRoute page="settings">
            <Placeholder title="Entreprise" />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute page="settings">
            <Placeholder title="Notifications" />
          </ProtectedRoute>
        } />

        {/* ─── Anciennes routes → Redirections ─── */}
        <Route path="/users" element={<Navigate to="/administration/users" replace />} />
        <Route path="/employees" element={<Navigate to="/administration/employees" replace />} />
        <Route path="/vehicles" element={<Navigate to="/commercial/vehicles" replace />} />
        <Route path="/clients" element={<Navigate to="/clientele/clients" replace />} />
        <Route path="/sales" element={<Navigate to="/commercial/sales" replace />} />
      </Route>

      {/* ═══ Catch-all ═══ */}
      <Route path="*" element={
        <Navigate to={user ? '/dashboard' : '/login'} replace />
      } />
    </Routes>
  );
};

export default AppRoutes;