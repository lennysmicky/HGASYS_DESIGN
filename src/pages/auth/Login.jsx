// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  DirectionsCar,
  PeopleOutline,
  Assessment,
  Security,
  CheckCircleOutline,
  ErrorOutline,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getRoleColor } from '../../utils/roles';
import '../../styles/auth.css';
import logo from '../../assets/images/logo.png';

// ═══════════════════════════════════════════
// COMPTES DÉMO — tous les rôles
// ═══════════════════════════════════════════
const demoAccounts = [
  {
    label: 'Admin',
    email: 'admin@hgasys.com',
    password: 'admin123',
    color: '#d32f2f',
  },
  {
    label: 'Manager',
    email: 'manager@hgasys.com',
    password: 'manager123',
    color: '#1976D2',
  },
  {
    label: 'Commercial',
    email: 'karim@hgasys.com',
    password: 'karim123',
    color: '#FF9800',
  },
  {
    label: 'Technicien',
    email: 'youcef@hgasys.com',
    password: 'youcef123',
    color: '#7B1FA2',
  },
  {
    label: 'Stock',
    email: 'nadir@hgasys.com',
    password: 'nadir123',
    color: '#00796B',
  },
  {
    label: 'Agent Client',
    email: 'amina@hgasys.com',
    password: 'amina123',
    color: '#388e3c',
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        setSuccessMessage(`Bienvenue ${result.user.name} !`);
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  const fillDemoAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setSuccessMessage(`Compte ${acc.label} sélectionné`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ═══ Branding gauche ═══ */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <img
              src={logo}
              alt="HGASYS"
              className="auth-branding-logo"
            />
            <h1 className="auth-branding-title">HGASYS</h1>
            <p className="auth-branding-subtitle">
              Système de Gestion Administrative
              <br />
              & Automobile
            </p>

            <div className="auth-branding-features">
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <DirectionsCar style={{ fontSize: '1rem' }} />
                </div>
                <span>Gestion complète du parc automobile</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <PeopleOutline style={{ fontSize: '1rem' }} />
                </div>
                <span>CRM clients et suivi des ventes</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <Assessment style={{ fontSize: '1rem' }} />
                </div>
                <span>Tableau de bord et analytics</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <Security style={{ fontSize: '1rem' }} />
                </div>
                <span>Sécurité et gestion des accès</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Formulaire droit ═══ */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-card-header">
              <img
                src={logo}
                alt="HGASYS"
                className="auth-card-logo auth-card-logo-mobile"
              />
              <h2 className="auth-card-title">Bienvenue</h2>
              <p className="auth-card-subtitle">
                Connectez-vous à votre espace HGASYS
              </p>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error">
                <ErrorOutline
                  className="auth-alert-icon"
                  style={{ fontSize: '1rem' }}
                />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert auth-alert-success">
                <CheckCircleOutline
                  className="auth-alert-icon"
                  style={{ fontSize: '1rem' }}
                />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrapper">
                  <Email
                    className="auth-input-icon"
                    style={{ fontSize: '1.1rem' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@hgasys.com"
                    required
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Mot de passe</label>
                <div className="auth-input-wrapper">
                  <Lock
                    className="auth-input-icon"
                    style={{ fontSize: '1.1rem' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="auth-input auth-input-password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                  >
                    {showPassword ? (
                      <VisibilityOff style={{ fontSize: '1.1rem' }} />
                    ) : (
                      <Visibility style={{ fontSize: '1.1rem' }} />
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-form-options">
                <label className="auth-remember">
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? (
                  <span className="auth-btn-loading">
                    <svg className="auth-spinner" viewBox="0 0 24 24">
                      <circle
                        className="auth-spinner-circle"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="auth-spinner-path"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* ─── Comptes démo ─── */}
            <div className="auth-demo-section">
              <div className="auth-divider">
                <span>Comptes de démonstration</span>
              </div>
              <div className="auth-demo-accounts">
                {demoAccounts.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    className="auth-demo-btn"
                    onClick={() => fillDemoAccount(acc)}
                    style={{ '--accent-color': acc.color }}
                  >
                    <span className="auth-demo-role">{acc.label}</span>
                    <span className="auth-demo-email">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-card-footer">
              Pas encore de compte ?
              <Link to="/register">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;