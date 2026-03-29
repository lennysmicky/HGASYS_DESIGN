import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  DirectionsCar,
  People,
  BadgeOutlined,
  ShoppingCart,
  PersonAdd,
  Close,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { hasAccess } from '../utils/roles';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, key: 'dashboard' },
  { path: '/users', label: 'Utilisateurs', icon: <PersonAdd fontSize="small" />, key: 'users' },
  { path: '/employees', label: 'Employés RH', icon: <BadgeOutlined fontSize="small" />, key: 'employees' },
  { path: '/vehicles', label: 'Véhicules', icon: <DirectionsCar fontSize="small" />, key: 'vehicles' },
  { path: '/clients', label: 'Clients', icon: <People fontSize="small" />, key: 'clients' },
  { path: '/sales', label: 'Ventes', icon: <ShoppingCart fontSize="small" />, key: 'sales' },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  //  Sidebar réduite par défaut
  const [collapsed, setCollapsed] = useState(true);

  const filteredMenu = menuItems.filter((item) =>
    hasAccess(user?.role, item.key)
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'w-[70px]' : 'w-[240px]'}
          bg-[#1565C0] text-white flex flex-col shadow-xl`} //  couleur changée
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="HGASYS" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold tracking-wide">HGASYS</span>
            </div>
          )}

          {collapsed && (
            <img src="/logo.png" alt="HGASYS" className="w-8 h-8 object-contain mx-auto" />
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block text-white/60 hover:text-white p-1"
            >
              {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
            </button>

            <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
              <Close fontSize="small" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                  ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className={isActive ? 'text-white' : 'text-white/60'}>
                  {item.icon}
                </span>

                {!collapsed && item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-[10px] text-white/50 text-center">
              HGASYS v1.0 © 2025
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;