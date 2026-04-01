// src/components/Sidebar.jsx
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
  ExpandMore,
  ExpandLess,
  AdminPanelSettings,
  Storefront,
  Handshake,
  Build,
  Warehouse,
  Settings,
  Description,
  RequestQuote,
  Inventory,
  SupportAgent,
  ContactPhone,
  EventNote,
  Construction,
  Engineering,
  PrecisionManufacturing,
  Category,
  LocalShipping,
  Business,
  Notifications,
  Computer,
  FolderShared,
  Security,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { hasAccess, hasServiceAccess, getRoleLabel } from '../utils/roles';
import '../styles/sidebar.css';

// ═══════════════════════════════════════════
// CONFIGURATION DES SERVICES ET SOUS-MENUS
// ═══════════════════════════════════════════
const sidebarConfig = [
  // Dashboard (pas de sous-menu)
  {
    type: 'link',
    path: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon fontSize="small" />,
    page: 'dashboard',
    service: 'dashboard',
  },

  // ═══ Service Administration & RH ═══
  {
    type: 'service',
    label: 'Administration & RH',
    icon: <AdminPanelSettings fontSize="small" />,
    service: 'administration',
    children: [
      {
        path: '/administration/users',
        label: 'Utilisateurs',
        icon: <PersonAdd fontSize="small" />,
        page: 'users',
      },
      {
        path: '/administration/employees',
        label: 'Employés / RH',
        icon: <BadgeOutlined fontSize="small" />,
        page: 'employees',
      },
      {
        path: '/administration/hr-dossiers',
        label: 'Dossiers RH',
        icon: <FolderShared fontSize="small" />,
        page: 'hrDossiers',
      },
      {
        path: '/administration/roles',
        label: 'Rôles & Permissions',
        icon: <Security fontSize="small" />,
        page: 'rolesPermissions',
      },
    ],
  },

  // ═══ Service Commercial & Parc Auto ═══
  {
    type: 'service',
    label: 'Commercial & Parc',
    icon: <Storefront fontSize="small" />,
    service: 'commercial',
    children: [
      {
        path: '/commercial/sales',
        label: 'Ventes',
        icon: <ShoppingCart fontSize="small" />,
        page: 'sales',
      },
      {
        path: '/commercial/quotes',
        label: 'Devis',
        icon: <RequestQuote fontSize="small" />,
        page: 'quotes',
      },
      {
        path: '/commercial/vehicles',
        label: 'Véhicules',
        icon: <DirectionsCar fontSize="small" />,
        page: 'vehicles',
      },
      {
        path: '/commercial/vehicle-stock',
        label: 'Stock Véhicules',
        icon: <Inventory fontSize="small" />,
        page: 'vehicleStock',
      },
    ],
  },

  // ═══ Service Clientèle ═══
  {
    type: 'service',
    label: 'Service Clientèle',
    icon: <Handshake fontSize="small" />,
    service: 'clientele',
    children: [
      {
        path: '/clientele/reception',
        label: 'Réception',
        icon: <SupportAgent fontSize="small" />,
        page: 'reception',
      },
      {
        path: '/clientele/clients',
        label: 'Clientèle',
        icon: <People fontSize="small" />,
        page: 'clients',
      },
    ],
  },

  // ═══ Service Technique ═══
  {
    type: 'service',
    label: 'Service Technique',
    icon: <Build fontSize="small" />,
    service: 'technique',
    children: [
      {
        path: '/technique/revisions',
        label: 'Révisions',
        icon: <EventNote fontSize="small" />,
        page: 'revisions',
      },
      {
        path: '/technique/repairs',
        label: 'Réparations',
        icon: <Construction fontSize="small" />,
        page: 'repairs',
      },
      {
        path: '/technique/interventions',
        label: 'Interventions',
        icon: <Engineering fontSize="small" />,
        page: 'interventions',
      },
      {
        path: '/technique/technicians',
        label: 'Techniciens',
        icon: <PrecisionManufacturing fontSize="small" />,
        page: 'technicians',
      },
    ],
  },

  // ═══ Service Magasin & Pièces ═══
  {
    type: 'service',
    label: 'Magasin & Pièces',
    icon: <Warehouse fontSize="small" />,
    service: 'magasin',
    children: [
      {
        path: '/magasin/parts',
        label: 'Pièces détachées',
        icon: <Category fontSize="small" />,
        page: 'parts',
      },
      {
        path: '/magasin/parts-stock',
        label: 'Stock Pièces',
        icon: <Inventory fontSize="small" />,
        page: 'partsStock',
      },
      {
        path: '/magasin/orders',
        label: 'Commandes',
        icon: <LocalShipping fontSize="small" />,
        page: 'orders',
      },
      {
        path: '/magasin/suppliers',
        label: 'Fournisseurs',
        icon: <Business fontSize="small" />,
        page: 'suppliers',
      },
    ],
  },

  // ═══ Paramètres ═══
  {
    type: 'service',
    label: 'Paramètres',
    icon: <Settings fontSize="small" />,
    service: 'settings',
    children: [
      {
        path: '/settings/system',
        label: 'Système',
        icon: <Computer fontSize="small" />,
        page: 'settings',
      },
      {
        path: '/settings/company',
        label: 'Entreprise',
        icon: <Business fontSize="small" />,
        page: 'settings',
      },
      {
        path: '/settings/notifications',
        label: 'Notifications',
        icon: <Notifications fontSize="small" />,
        page: 'settings',
      },
    ],
  },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Sidebar réduite par défaut
  const [collapsed, setCollapsed] = useState(false);

  // État pour les sous-menus ouverts
  const [openMenus, setOpenMenus] = useState({});

  // Toggle un sous-menu
  const toggleMenu = (service) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenMenus({ [service]: true });
      return;
    }
    setOpenMenus((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  // Vérifier si un service a des enfants visibles
  const getVisibleChildren = (item) => {
    if (!item.children) return [];
    return item.children.filter((child) => hasAccess(user?.role, child.page));
  };

  // Vérifier si une section de service est active
  const isServiceActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => location.pathname.startsWith(child.path));
  };

  // Auto-ouvrir le menu actif
  const isMenuOpen = (service) => {
    if (openMenus[service] !== undefined) return openMenus[service];
    // Auto-ouvrir si un enfant est actif
    const config = sidebarConfig.find((s) => s.service === service);
    if (config?.children) {
      return config.children.some((child) => location.pathname.startsWith(child.path));
    }
    return false;
  };

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar
          ${open ? 'sidebar-open' : ''}
          ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      >
        {/* ═══ Header ═══ */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/logo.png"
              alt="HGASYS"
              className="sidebar-logo-img"
            />
            {!collapsed && (
              <span className="sidebar-logo-text">HGASYS</span>
            )}
          </div>

          <div className="sidebar-header-actions">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="sidebar-toggle-btn sidebar-toggle-desktop"
            >
              {collapsed ? (
                <ChevronRight fontSize="small" />
              ) : (
                <ChevronLeft fontSize="small" />
              )}
            </button>

            <button onClick={onClose} className="sidebar-close-btn">
              <Close fontSize="small" />
            </button>
          </div>
        </div>


        {/* ═══ Navigation ═══ */}
        <nav className="sidebar-nav">
          <div className={`sidebar-menu ${collapsed ? 'sidebar-menu-collapsed' : 'sidebar-menu-visible'}`}>
            {sidebarConfig.map((item) => {
              // ─── Lien simple (Dashboard) ───
              if (item.type === 'link') {
                if (!hasAccess(user?.role, item.page)) return null;

                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                    title={collapsed ? item.label : ''}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    {!collapsed && (
                      <span className="sidebar-link-label">{item.label}</span>
                    )}
                    {isActive && <span className="sidebar-link-indicator" />}
                  </NavLink>
                );
              }

              // ─── Service avec sous-menus ───
              if (item.type === 'service') {
                if (!hasServiceAccess(user?.role, item.service)) return null;

                const visibleChildren = getVisibleChildren(item);
                if (visibleChildren.length === 0) return null;

                const serviceActive = isServiceActive(item);
                const menuOpen = isMenuOpen(item.service);

                return (
                  <div key={item.service} className="sidebar-service">
                    {/* Séparateur */}
                    {!collapsed && (
                      <div className="sidebar-service-divider" />
                    )}

                    {/* Titre du service (cliquable) */}
                    <button
                      className={`sidebar-service-btn ${serviceActive ? 'sidebar-service-btn-active' : ''}`}
                      onClick={() => toggleMenu(item.service)}
                      title={collapsed ? item.label : ''}
                    >
                      <span className="sidebar-link-icon">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="sidebar-service-label">
                            {item.label}
                          </span>
                          <span className="sidebar-service-arrow">
                            {menuOpen ? (
                              <ExpandLess style={{ fontSize: '16px' }} />
                            ) : (
                              <ExpandMore style={{ fontSize: '16px' }} />
                            )}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Sous-menus */}
                    {!collapsed && menuOpen && (
                      <div className="sidebar-submenu">
                        {visibleChildren.map((child) => {
                          const isActive = location.pathname === child.path;

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={onClose}
                              className={`sidebar-sublink ${isActive ? 'sidebar-sublink-active' : ''}`}
                            >
                              <span className="sidebar-sublink-icon">
                                {child.icon}
                              </span>
                              <span className="sidebar-sublink-label">
                                {child.label}
                              </span>
                              {isActive && (
                                <span className="sidebar-sublink-indicator" />
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </nav>

        {/* ═══ Footer ═══ */}
        <div className="sidebar-footer">
          {!collapsed ? (
            <p className="sidebar-footer-text">HGASYS v1.0 © 2025</p>
          ) : (
            <span className="sidebar-footer-dot" />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;