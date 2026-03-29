import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Person, Email, Lock, Visibility, VisibilityOff, DirectionsCar, CheckCircleOutline, ErrorOutline, Speed, BuildCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register(name, email, password);
      if (result.success) {
        setSuccessMessage('Compte créé avec succès !');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-reverse">

        <div className="auth-form-section auth-form-section-left">
          <div className="auth-card">
            <div className="auth-card-header">
              <img
                src="/src/assets/images/logo.png"
                alt="HGASYS"
                className="auth-card-logo auth-card-logo-mobile"
              />
              <h2 className="auth-card-title">Créer un compte</h2>
              <p className="auth-card-subtitle">Rejoignez HGASYS en quelques instants</p>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error">
                <ErrorOutline className="auth-alert-icon" style={{ fontSize: '1rem' }} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert auth-alert-success">
                <CheckCircleOutline className="auth-alert-icon" style={{ fontSize: '1rem' }} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-input-group">
                <label className="auth-label">Nom complet</label>
                <div className="auth-input-wrapper">
                  <Person className="auth-input-icon" style={{ fontSize: '1.1rem' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrapper">
                  <Email className="auth-input-icon" style={{ fontSize: '1.1rem' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@email.com"
                    required
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Mot de passe</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" style={{ fontSize: '1.1rem' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="auth-input auth-input-password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                  >
                    {showPassword ? <VisibilityOff style={{ fontSize: '1.1rem' }} /> : <Visibility style={{ fontSize: '1.1rem' }} />}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Confirmer le mot de passe</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" style={{ fontSize: '1.1rem' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="auth-input auth-input-password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle"
                  >
                    {showConfirmPassword ? <VisibilityOff style={{ fontSize: '1.1rem' }} /> : <Visibility style={{ fontSize: '1.1rem' }} />}
                  </button>
                </div>
              </div>

              <div className="auth-password-info">
                <p>Le mot de passe doit contenir :</p>
                <ul>
                  <li className={password.length >= 6 ? 'valid' : ''}>Au moins 6 caractères</li>
                  <li className={/[A-Z]/.test(password) ? 'valid' : ''}>Une lettre majuscule</li>
                  <li className={/[a-z]/.test(password) ? 'valid' : ''}>Une lettre minuscule</li>
                  <li className={/\d/.test(password) ? 'valid' : ''}>Un chiffre</li>
                </ul>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? (
                  <span className="auth-btn-loading">
                    <svg className="auth-spinner" viewBox="0 0 24 24">
                      <circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Création...
                  </span>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            <div className="auth-card-footer">
              Vous avez déjà un compte ?
              <Link to="/login">Se connecter</Link>
            </div>
          </div>
        </div>

        <div className="auth-branding auth-branding-right">
          <div className="auth-branding-content">
            <img
              src="/src/assets/images/logo.png"
              alt="HGASYS"
              className="auth-branding-logo"
            />
            <h1 className="auth-branding-title">HGASYS</h1>
            <p className="auth-branding-subtitle">
              Rejoignez notre plateforme<br />de gestion automobile
            </p>

            <div className="auth-branding-features">
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <DirectionsCar style={{ fontSize: '1rem' }} />
                </div>
                <span>Gestion de flotte simplifiée</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <CheckCircleOutline style={{ fontSize: '1rem' }} />
                </div>
                <span>Interface intuitive et moderne</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <Speed style={{ fontSize: '1rem' }} />
                </div>
                <span>Performance et rapidité</span>
              </div>
              <div className="auth-branding-feature">
                <div className="auth-branding-feature-icon">
                  <BuildCircle style={{ fontSize: '1rem' }} />
                </div>
                <span>Suivi maintenance complet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;