// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import { ROLES, PERMISSIONS, getRoleLabel } from '../utils/roles';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ═══ Chargement session sauvegardée ═══
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hgasys_user');
      if (saved) {
        const parsed = JSON.parse(saved);

        // Vérifier que le rôle sauvegardé existe toujours
        if (parsed.role && PERMISSIONS[parsed.role]) {
          setUser(parsed);
        } else {
          // Rôle invalide → déconnecter
          localStorage.removeItem('hgasys_user');
        }
      }
    } catch (error) {
      console.error('Erreur chargement session:', error);
      localStorage.removeItem('hgasys_user');
    }
    setLoading(false);
  }, []);

  // ═══ Connexion ═══
  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Email et mot de passe requis' };
    }

    const found = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Vérifier que le compte est actif
    if (found.status === 'inactif') {
      return { success: false, message: 'Ce compte est désactivé. Contactez l\'administrateur.' };
    }

    // Vérifier que le rôle est valide
    if (!PERMISSIONS[found.role]) {
      return { success: false, message: 'Rôle utilisateur non reconnu' };
    }

    const userData = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      avatar: found.avatar,
      status: found.status,
      createdAt: found.createdAt,
      // Infos du rôle
      roleLabel: getRoleLabel(found.role),
      roleColor: PERMISSIONS[found.role]?.color,
    };

    setUser(userData);
    localStorage.setItem('hgasys_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  // ═══ Déconnexion ═══
  const logout = () => {
    setUser(null);
    localStorage.removeItem('hgasys_user');
  };

  // ═══ Inscription ═══
  const register = (name, email, password, role = ROLES.COMMERCIAL) => {
    if (!name || !email || !password) {
      return { success: false, message: 'Tous les champs sont requis' };
    }

    // Vérifier email unique
    const exists = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Cet email existe déjà' };
    }

    // Vérifier que le rôle est valide
    const validRole = PERMISSIONS[role] ? role : ROLES.COMMERCIAL;

    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: validRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      status: 'actif',
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockUsers.push(newUser);

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      status: newUser.status,
      createdAt: newUser.createdAt,
      roleLabel: getRoleLabel(newUser.role),
      roleColor: PERMISSIONS[newUser.role]?.color,
    };

    setUser(userData);
    localStorage.setItem('hgasys_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  // ═══ Mise à jour profil ═══
  const updateProfile = (updates) => {
    if (!user) return { success: false, message: 'Non connecté' };

    const updatedUser = { ...user, ...updates };

    // Mettre à jour le mock aussi
    const mockIndex = mockUsers.findIndex((u) => u.id === user.id);
    if (mockIndex !== -1) {
      Object.assign(mockUsers[mockIndex], updates);
    }

    setUser(updatedUser);
    localStorage.setItem('hgasys_user', JSON.stringify(updatedUser));

    return { success: true, user: updatedUser };
  };

  // ═══ Vérification rapide de permission ═══
  const hasPermission = (permission) => {
    if (!user?.role || !PERMISSIONS[user.role]) return false;
    return PERMISSIONS[user.role][permission] || false;
  };

  // ═══ Vérification accès page ═══
  const canAccessPage = (page) => {
    if (!user?.role || !PERMISSIONS[user.role]) return false;
    return PERMISSIONS[user.role].pages.includes(page);
  };

  // ═══ Vérification accès service ═══
  const canAccessService = (service) => {
    if (!user?.role || !PERMISSIONS[user.role]) return false;
    return PERMISSIONS[user.role].services.includes(service);
  };

  // ═══ Valeur du contexte ═══
  const value = {
    // État
    user,
    loading,

    // Actions auth
    login,
    logout,
    register,
    updateProfile,

    // Helpers permissions
    hasPermission,
    canAccessPage,
    canAccessService,

    // Info rapide
    isAdmin: user?.role === ROLES.ADMIN,
    isManager: user?.role === ROLES.MANAGER,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};