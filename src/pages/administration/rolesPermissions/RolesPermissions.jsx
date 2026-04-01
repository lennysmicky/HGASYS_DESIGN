import { useState } from 'react';
import {
  AdminPanelSettings,
  SupervisorAccount,
  Storefront,
  Build,
  Inventory,
  SupportAgent,
  People,
  Security,
  ExpandMore,
  ExpandLess,
  Info,
  Shield,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { ROLES, PERMISSIONS, getAllRoles, getRoleColor } from '../../../utils/roles';
import { mockUsers } from '../../../data/mockData';
import '../../../styles/rolesPermissions.css';

const RolesPermissions = () => {
  const { user } = useAuth();
  const [expandedRoles, setExpandedRoles] = useState({});

  const allRoles = getAllRoles();

  const toggleExpand = (roleKey) => {
    setExpandedRoles((prev) => ({ ...prev, [roleKey]: !prev[roleKey] }));
  };

  // Icône par rôle
  const getRoleIcon = (roleValue) => {
    const icons = {
      admin: <AdminPanelSettings sx={{ fontSize: 18 }} />,
      manager: <SupervisorAccount sx={{ fontSize: 18 }} />,
      commercial: <Storefront sx={{ fontSize: 18 }} />,
      technicien: <Build sx={{ fontSize: 18 }} />,
      gestionnaire_stock: <Inventory sx={{ fontSize: 18 }} />,
      agent_client: <SupportAgent sx={{ fontSize: 18 }} />,
    };
    return icons[roleValue] || <Security sx={{ fontSize: 18 }} />;
  };

  // Services disponibles
  const allServices = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'administration', label: 'Administration' },
    { key: 'commercial', label: 'Commercial' },
    { key: 'clientele', label: 'Clientèle' },
    { key: 'technique', label: 'Technique' },
    { key: 'magasin', label: 'Magasin' },
    { key: 'settings', label: 'Paramètres' },
  ];

  // Permissions lisibles
  const permissionLabels = {
    canManageUsers: 'Gérer utilisateurs',
    canManageEmployees: 'Gérer employés',
    canManageHrDossiers: 'Dossiers RH',
    canManageRolesPermissions: 'Rôles & permissions',
    canManageSales: 'Gérer ventes',
    canManageQuotes: 'Gérer devis',
    canManageVehicles: 'Gérer véhicules',
    canManageVehicleStock: 'Stock véhicules',
    canManageReception: 'Réception clients',
    canManageClients: 'Gérer clients',
    canManageRevisions: 'Révisions',
    canManageRepairs: 'Réparations',
    canManageInterventions: 'Interventions',
    canManageTechnicians: 'Techniciens',
    canManageParts: 'Pièces détachées',
    canManagePartsStock: 'Stock pièces',
    canManageOrders: 'Commandes',
    canManageSuppliers: 'Fournisseurs',
    canManageSettings: 'Paramètres système',
    canViewReports: 'Voir rapports',
  };

  // Utilisateurs par rôle
  const getUsersByRole = (roleValue) => {
    return mockUsers.filter((u) => u.role === roleValue);
  };

  // Stats
  const stats = allRoles.map((role) => ({
    ...role,
    userCount: getUsersByRole(role.value).length,
  }));

  const totalUsers = mockUsers.length;

  return (
    <div className="rp-page">
      {/* ═══ Header ═══ */}
      <div className="rp-header">
        <div>
          <h1 className="rp-header-title">Rôles & Permissions</h1>
          <p className="rp-header-subtitle">
            Configuration des accès et droits par rôle
          </p>
        </div>
      </div>

      {/* ═══ Info Banner ═══ */}
      <div className="rp-info-banner">
        <div className="rp-info-icon">
          <Info sx={{ fontSize: 18, color: '#1976D2' }} />
        </div>
        <p className="rp-info-text">
          <span className="rp-info-bold">{allRoles.length} rôles</span> configurés pour{' '}
          <span className="rp-info-bold">{totalUsers} utilisateurs</span>.
          Les permissions déterminent l'accès aux services et fonctionnalités de l'application.
        </p>
      </div>

      {/* ═══ Stats par rôle ═══ */}
      <div className="rp-stats-grid">
        {stats.map((role) => (
          <div key={role.key} className="rp-stat-card">
            <div className="rp-stat-row">
              <div>
                <p className="rp-stat-label">{role.label}</p>
                <p className="rp-stat-value" style={{ color: role.color }}>
                  {role.userCount}
                </p>
              </div>
              <div
                className="rp-stat-icon"
                style={{ background: role.color + '15' }}
              >
                {getRoleIcon(role.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Roles Grid ═══ */}
      <div className="rp-roles-grid">
        {allRoles.map((role) => {
          const perms = PERMISSIONS[role.value];
          const users = getUsersByRole(role.value);
          const isExpanded = expandedRoles[role.key];
          const roleColor = role.color;

          return (
            <div key={role.key} className="rp-role-card">
              
              <div className="rp-role-body">
                {/* Header */}
                <div className="rp-role-header">
                  <div className="rp-role-header-left">
                    <div
                      className="rp-role-icon"
                      style={{ background: roleColor + '15', color: roleColor }}
                    >
                      {getRoleIcon(role.value)}
                    </div>
                    <div>
                      <h3 className="rp-role-name">{role.label}</h3>
                      <p className="rp-role-code">{role.value}</p>
                    </div>
                  </div>
                  <div className="rp-role-user-count">
                    <People sx={{ fontSize: 12 }} />
                    {users.length}
                  </div>
                </div>

                {/* Services */}
                <div className="rp-role-services">
                  <p className="rp-role-services-title">Services accessibles</p>
                  <div className="rp-services-tags">
                    {allServices.map((service) => {
                      const hasAccess = perms.services.includes(service.key);
                      return (
                        <span
                          key={service.key}
                          className={`rp-service-tag ${
                            hasAccess ? 'rp-service-tag-active' : 'rp-service-tag-inactive'
                          }`}
                        >
                          {service.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Permissions */}
                <div className="rp-role-permissions">
                  <p className="rp-role-permissions-title">Permissions détaillées</p>
                  <div className="rp-perms-grid">
                    {Object.entries(permissionLabels).map(([key, label]) => {
                      const hasIt = perms[key] || false;
                      return (
                        <div key={key} className="rp-perm-item">
                          <span
                            className={`rp-perm-dot ${
                              hasIt ? 'rp-perm-dot-active' : 'rp-perm-dot-inactive'
                            }`}
                          />
                          <span
                            className={`rp-perm-label ${
                              !hasIt ? 'rp-perm-label-inactive' : ''
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Users toggle */}
                <button
                  onClick={() => toggleExpand(role.key)}
                  className="rp-expand-btn"
                >
                  {isExpanded ? (
                    <>
                      <ExpandLess sx={{ fontSize: 14 }} />
                      Masquer les utilisateurs
                    </>
                  ) : (
                    <>
                      <ExpandMore sx={{ fontSize: 14 }} />
                      Voir les {users.length} utilisateur{users.length > 1 ? 's' : ''}
                    </>
                  )}
                </button>

                {/* Users list */}
                {isExpanded && (
                  <div className="rp-role-users">
                    <p className="rp-role-users-title">
                      Utilisateurs ({users.length})
                    </p>
                    {users.length > 0 ? (
                      <div className="rp-users-list">
                        {users.map((u) => (
                          <div key={u.id} className="rp-user-item">
                            <Avatar
                              src={u.avatar}
                              sx={{ width: 24, height: 24 }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p className="rp-user-name">{u.name}</p>
                              <p className="rp-user-email">{u.email}</p>
                            </div>
                            <span
                              className={`rp-user-status ${
                                u.status === 'actif'
                                  ? 'rp-user-status-actif'
                                  : 'rp-user-status-inactif'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rp-users-empty">Aucun utilisateur</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Legend ═══ */}
      <div className="rp-legend">
        <h3 className="rp-legend-title">Légende des rôles</h3>
        <div className="rp-legend-grid">
          {allRoles.map((role) => (
            <div key={role.key} className="rp-legend-item">
              <span
                className="rp-legend-dot"
                style={{ background: role.color }}
              />
              <div>
                <p className="rp-legend-label">{role.label}</p>
                <p className="rp-legend-desc">
                  {role.value === 'admin' && 'Accès total'}
                  {role.value === 'manager' && 'RH + Commercial'}
                  {role.value === 'commercial' && 'Ventes + Clients'}
                  {role.value === 'technicien' && 'Service technique'}
                  {role.value === 'gestionnaire_stock' && 'Magasin & Pièces'}
                  {role.value === 'agent_client' && 'Clientèle'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;