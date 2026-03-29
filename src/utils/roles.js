export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYE: 'employe'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    label: 'Administrateur',
    color: '#d32f2f',
    pages: ['dashboard', 'users', 'employees', 'vehicles', 'clients', 'sales'],
    canManageUsers: true,
    canManageEmployees: true,
    canManageVehicles: true,
    canManageClients: true,
    canManageSales: true,
    canViewReports: true,
  },
  [ROLES.MANAGER]: {
    label: 'Manager',
    color: '#1976D2',
    pages: ['dashboard', 'employees', 'vehicles', 'clients', 'sales'],
    canManageUsers: false,
    canManageEmployees: true,
    canManageVehicles: true,
    canManageClients: true,
    canManageSales: true,
    canViewReports: true,
  },
  [ROLES.EMPLOYE]: {
    label: 'Employé',
    color: '#388e3c',
    pages: ['dashboard', 'vehicles', 'clients', 'sales'],
    canManageUsers: false,
    canManageEmployees: false,
    canManageVehicles: false,
    canManageClients: true,
    canManageSales: true,
    canViewReports: false,
  }
};

export const hasAccess = (role, page) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role].pages.includes(page);
};

export const canDo = (role, permission) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role][permission] || false;
};