import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('hgasys_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('hgasys_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: 'Email ou mot de passe incorrect' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hgasys_user');
  };

  const register = (name, email, password) => {
    const exists = mockUsers.find((u) => u.email === email);
    if (exists) {
      return { success: false, message: 'Cet email existe déjà' };
    }
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: 'employe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      status: 'actif',
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockUsers.push(newUser);
    const userData = { ...newUser };
    delete userData.password;
    setUser(userData);
    localStorage.setItem('hgasys_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};