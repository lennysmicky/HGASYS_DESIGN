// src/utils/roles.js

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  COMMERCIAL: 'commercial',
  TECHNICIEN: 'technicien',
  GESTIONNAIRE_STOCK: 'gestionnaire_stock',
  AGENT_CLIENT: 'agent_client',
};

export const PERMISSIONS = {
  // ═══════════════════════════════════════════
  // ADMIN → Accès total à tous les services
  // ═══════════════════════════════════════════
  [ROLES.ADMIN]: {
    label: 'Administrateur',
    color: '#d32f2f',
    pages: [
      // Dashboard
      'dashboard',
      // Administration & RH
      'users', 'employees', 'hrDossiers', 'rolesPermissions',
      // Commercial & Parc Auto
      'sales', 'quotes', 'vehicles', 'vehicleStock',
      // Clientèle
      'reception', 'clients',
      // Technique
      'revisions', 'repairs', 'interventions', 'technicians',
      // Magasin & Pièces
      'parts', 'partsStock', 'orders', 'suppliers',
      // Paramètres
      'settings',
    ],
    services: [
      'dashboard',
      'administration',
      'commercial',
      'clientele',
      'technique',
      'magasin',
      'settings',
    ],
    // Administration & RH
    canManageUsers: true,
    canManageEmployees: true,
    canManageHrDossiers: true,
    canManageRolesPermissions: true,
    // Commercial & Parc Auto
    canManageSales: true,
    canManageQuotes: true,
    canManageVehicles: true,
    canManageVehicleStock: true,
    // Clientèle
    canManageReception: true,
    canManageClients: true,
    // Technique
    canManageRevisions: true,
    canManageRepairs: true,
    canManageInterventions: true,
    canManageTechnicians: true,
    // Magasin & Pièces
    canManageParts: true,
    canManagePartsStock: true,
    canManageOrders: true,
    canManageSuppliers: true,
    // Paramètres
    canManageSettings: true,
    // Rapports
    canViewReports: true,
  },

  // ═══════════════════════════════════════════
  // MANAGER → Administration & RH + Commercial
  // ═══════════════════════════════════════════
  [ROLES.MANAGER]: {
    label: 'Manager',
    color: '#1976D2',
    pages: [
      'dashboard',
      // Administration & RH (sauf utilisateurs et rôles)
      'employees', 'hrDossiers',
      // Commercial & Parc Auto
      'sales', 'quotes', 'vehicles', 'vehicleStock',
      // Clientèle (vue limitée)
      'clients',
    ],
    services: [
      'dashboard',
      'administration',
      'commercial',
      'clientele',
    ],
    // Administration & RH
    canManageUsers: false,
    canManageEmployees: true,
    canManageHrDossiers: true,
    canManageRolesPermissions: false,
    // Commercial & Parc Auto
    canManageSales: true,
    canManageQuotes: true,
    canManageVehicles: true,
    canManageVehicleStock: true,
    // Clientèle
    canManageReception: false,
    canManageClients: true,
    // Technique
    canManageRevisions: false,
    canManageRepairs: false,
    canManageInterventions: false,
    canManageTechnicians: false,
    // Magasin & Pièces
    canManageParts: false,
    canManagePartsStock: false,
    canManageOrders: false,
    canManageSuppliers: false,
    // Paramètres
    canManageSettings: false,
    // Rapports
    canViewReports: true,
  },

  // ═══════════════════════════════════════════
  // COMMERCIAL → Ventes + Véhicules + Clients
  // ═══════════════════════════════════════════
  [ROLES.COMMERCIAL]: {
    label: 'Commercial',
    color: '#FF9800',
    pages: [
      'dashboard',
      // Commercial & Parc Auto
      'sales', 'quotes', 'vehicles', 'vehicleStock',
      // Clientèle
      'clients',
    ],
    services: [
      'dashboard',
      'commercial',
      'clientele',
    ],
    // Administration & RH
    canManageUsers: false,
    canManageEmployees: false,
    canManageHrDossiers: false,
    canManageRolesPermissions: false,
    // Commercial & Parc Auto
    canManageSales: true,
    canManageQuotes: true,
    canManageVehicles: false,
    canManageVehicleStock: false,
    // Clientèle
    canManageReception: false,
    canManageClients: true,
    // Technique
    canManageRevisions: false,
    canManageRepairs: false,
    canManageInterventions: false,
    canManageTechnicians: false,
    // Magasin & Pièces
    canManageParts: false,
    canManagePartsStock: false,
    canManageOrders: false,
    canManageSuppliers: false,
    // Paramètres
    canManageSettings: false,
    // Rapports
    canViewReports: false,
  },

  // ═══════════════════════════════════════════
  // TECHNICIEN → Service Technique uniquement
  // ═══════════════════════════════════════════
  [ROLES.TECHNICIEN]: {
    label: 'Technicien',
    color: '#7B1FA2',
    pages: [
      'dashboard',
      // Technique
      'revisions', 'repairs', 'interventions',
    ],
    services: [
      'dashboard',
      'technique',
    ],
    // Administration & RH
    canManageUsers: false,
    canManageEmployees: false,
    canManageHrDossiers: false,
    canManageRolesPermissions: false,
    // Commercial & Parc Auto
    canManageSales: false,
    canManageQuotes: false,
    canManageVehicles: false,
    canManageVehicleStock: false,
    // Clientèle
    canManageReception: false,
    canManageClients: false,
    // Technique
    canManageRevisions: true,
    canManageRepairs: true,
    canManageInterventions: true,
    canManageTechnicians: false,
    // Magasin & Pièces
    canManageParts: false,
    canManagePartsStock: false,
    canManageOrders: false,
    canManageSuppliers: false,
    // Paramètres
    canManageSettings: false,
    // Rapports
    canViewReports: false,
  },

  // ═══════════════════════════════════════════
  // GESTIONNAIRE STOCK → Magasin & Pièces
  // ═══════════════════════════════════════════
  [ROLES.GESTIONNAIRE_STOCK]: {
    label: 'Gestionnaire Stock',
    color: '#00796B',
    pages: [
      'dashboard',
      // Magasin & Pièces
      'parts', 'partsStock', 'orders', 'suppliers',
    ],
    services: [
      'dashboard',
      'magasin',
    ],
    // Administration & RH
    canManageUsers: false,
    canManageEmployees: false,
    canManageHrDossiers: false,
    canManageRolesPermissions: false,
    // Commercial & Parc Auto
    canManageSales: false,
    canManageQuotes: false,
    canManageVehicles: false,
    canManageVehicleStock: false,
    // Clientèle
    canManageReception: false,
    canManageClients: false,
    // Technique
    canManageRevisions: false,
    canManageRepairs: false,
    canManageInterventions: false,
    canManageTechnicians: false,
    // Magasin & Pièces
    canManageParts: true,
    canManagePartsStock: true,
    canManageOrders: true,
    canManageSuppliers: true,
    // Paramètres
    canManageSettings: false,
    // Rapports
    canViewReports: false,
  },

  // ═══════════════════════════════════════════
  // AGENT CLIENT → Réception + Clientèle
  // ═══════════════════════════════════════════
  [ROLES.AGENT_CLIENT]: {
    label: 'Agent Clientèle',
    color: '#388e3c',
    pages: [
      'dashboard',
      // Clientèle
      'reception', 'clients',
    ],
    services: [
      'dashboard',
      'clientele',
    ],
    // Administration & RH
    canManageUsers: false,
    canManageEmployees: false,
    canManageHrDossiers: false,
    canManageRolesPermissions: false,
    // Commercial & Parc Auto
    canManageSales: false,
    canManageQuotes: false,
    canManageVehicles: false,
    canManageVehicleStock: false,
    // Clientèle
    canManageReception: true,
    canManageClients: true,
    // Technique
    canManageRevisions: false,
    canManageRepairs: false,
    canManageInterventions: false,
    canManageTechnicians: false,
    // Magasin & Pièces
    canManageParts: false,
    canManagePartsStock: false,
    canManageOrders: false,
    canManageSuppliers: false,
    // Paramètres
    canManageSettings: false,
    // Rapports
    canViewReports: false,
  },
};

// ═══════════════════════════════════════════
// FONCTIONS D'ACCÈS
// ═══════════════════════════════════════════

// Vérifie si un rôle a accès à une page
export const hasAccess = (role, page) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role].pages.includes(page);
};

// Vérifie si un rôle a accès à un service entier
export const hasServiceAccess = (role, service) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role].services.includes(service);
};

// Vérifie une permission spécifique
export const canDo = (role, permission) => {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role][permission] || false;
};

// Récupère le label du rôle
export const getRoleLabel = (role) => {
  if (!role || !PERMISSIONS[role]) return 'Inconnu';
  return PERMISSIONS[role].label;
};

// Récupère la couleur du rôle
export const getRoleColor = (role) => {
  if (!role || !PERMISSIONS[role]) return '#757575';
  return PERMISSIONS[role].color;
};

// Liste tous les rôles disponibles
export const getAllRoles = () => {
  return Object.entries(ROLES).map(([key, value]) => ({
    key,
    value,
    label: PERMISSIONS[value].label,
    color: PERMISSIONS[value].color,
  }));
};
