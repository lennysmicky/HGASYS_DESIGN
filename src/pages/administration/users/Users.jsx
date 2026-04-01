// src/pages/users/Users.jsx
import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Close,
  PersonAdd,
  Shield,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
  ManageAccounts,
  Person,
  Email,
  CalendarMonth,
  Storefront,
  Build,
  Warehouse,
  SupportAgent,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { ROLES, PERMISSIONS, getAllRoles } from '../../../utils/roles';
import { mockUsers } from '../../../data/mockData';
import '../../../styles/users.css';

// ═══════════════════════════════════════════
// PERMISSIONS À AFFICHER DANS LE PREVIEW
// ═══════════════════════════════════════════
const permissionsList = [
  { key: 'canManageUsers', label: 'Utilisateurs' },
  { key: 'canManageEmployees', label: 'Employés / RH' },
  { key: 'canManageSales', label: 'Ventes' },
  { key: 'canManageQuotes', label: 'Devis' },
  { key: 'canManageVehicles', label: 'Véhicules' },
  { key: 'canManageClients', label: 'Clients' },
  { key: 'canManageReception', label: 'Réception' },
  { key: 'canManageRevisions', label: 'Révisions' },
  { key: 'canManageRepairs', label: 'Réparations' },
  { key: 'canManageParts', label: 'Pièces' },
  { key: 'canManageOrders', label: 'Commandes' },
  { key: 'canManageSettings', label: 'Paramètres' },
  { key: 'canViewReports', label: 'Rapports' },
];

// ═══════════════════════════════════════════
// ICÔNE PAR RÔLE
// ═══════════════════════════════════════════
const getRoleIcon = (role) => {
  const icons = {
    [ROLES.ADMIN]: <AdminPanelSettings sx={{ fontSize: 14 }} />,
    [ROLES.MANAGER]: <ManageAccounts sx={{ fontSize: 14 }} />,
    [ROLES.COMMERCIAL]: <Storefront sx={{ fontSize: 14 }} />,
    [ROLES.TECHNICIEN]: <Build sx={{ fontSize: 14 }} />,
    [ROLES.GESTIONNAIRE_STOCK]: <Warehouse sx={{ fontSize: 14 }} />,
    [ROLES.AGENT_CLIENT]: <SupportAgent sx={{ fontSize: 14 }} />,
  };
  return icons[role] || <Person sx={{ fontSize: 14 }} />;
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const allRoles = getAllRoles();

  const [users, setUsers] = useState(
    mockUsers.map((u) => {
      const { password, ...rest } = u;
      return rest;
    })
  );
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: ROLES.COMMERCIAL,
    status: 'actif',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  };

  const [form, setForm] = useState(emptyForm);

  // ─── Filtrage ───
  const filtered = users.filter((u) => {
    const matchSearch = `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole = filterRole === 'tous' || u.role === filterRole;
    const matchStatus =
      filterStatus === 'tous' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // ─── Stats par rôle ───
  const stats = {
    total: users.length,
    actif: users.filter((u) => u.status === 'actif').length,
  };

  // Compter chaque rôle dynamiquement
  allRoles.forEach((r) => {
    stats[r.value] = users.filter((u) => u.role === r.value).length;
  });

  // ─── Handlers ───
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setShowPassword(false);
    setOpenForm(true);
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: '' });
    setEditMode(true);
    setShowPassword(false);
    setOpenForm(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleSave = () => {
    if (editMode) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === form.id
            ? {
                ...u,
                name: form.name,
                email: form.email,
                role: form.role,
                status: form.status,
                avatar: form.avatar,
              }
            : u
        )
      );
    } else {
      const newUser = {
        ...form,
        id: users.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const { password, ...userData } = newUser;
      setUsers((prev) => [...prev, userData]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    if (id === currentUser?.id) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (id) => {
    if (id === currentUser?.id) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'actif' ? 'inactif' : 'actif' }
          : u
      )
    );
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="users-page">
      {/* ═══ Header ═══ */}
      <div className="users-header">
        <div>
          <h1 className="users-header-title">Gestion des Utilisateurs</h1>
          <p className="users-header-subtitle">Comptes et droits d'accès</p>
        </div>
        <button onClick={handleAdd} className="users-add-btn">
          <PersonAdd fontSize="small" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* ═══ Stats ═══ */}
      <div className="users-stats-grid">
        <div className="users-stat-card">
          <p className="users-stat-value" style={{ color: '#1e293b' }}>
            {stats.total}
          </p>
          <p className="users-stat-label">Total</p>
        </div>
        {allRoles.slice(0, 3).map((r) => (
          <div key={r.value} className="users-stat-card">
            <p className="users-stat-value" style={{ color: r.color }}>
              {stats[r.value] || 0}
            </p>
            <p className="users-stat-label">{r.label}s</p>
          </div>
        ))}
        <div className="users-stat-card">
          <p className="users-stat-value" style={{ color: '#22c55e' }}>
            {stats.actif}
          </p>
          <p className="users-stat-label">Actifs</p>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="users-filters">
        <div className="users-filters-row">
          <div className="users-search-wrapper">
            <Search
              fontSize="small"
              className="users-search-icon"
            />
            <input
              type="text"
              placeholder="Rechercher nom, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="users-search-input"
            />
          </div>
          <div className="users-filter-selects">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="users-select"
            >
              <option value="tous">Tous rôles</option>
              {allRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="users-select"
            >
              <option value="tous">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Table ═══ */}
      <div className="users-table">
        {/* Header */}
        <div className="users-table-header">
          <div className="users-col-4 users-th">Utilisateur</div>
          <div className="users-col-2 users-th">Rôle</div>
          <div className="users-col-2 users-th">Statut</div>
          <div className="users-col-2 users-th">Créé le</div>
          <div className="users-col-2 users-th users-th-right">Actions</div>
        </div>

        {/* Rows */}
        {filtered.map((u) => {
          const isSelf = u.id === currentUser?.id;
          return (
            <div key={u.id} className="users-row">
              {/* User */}
              <div className="users-col-4 users-user-info">
                <Avatar src={u.avatar} sx={{ width: 36, height: 36 }} />
                <div className="users-user-details">
                  <div className="users-user-name-row">
                    <p className="users-user-name">{u.name}</p>
                    {isSelf && (
                      <span className="users-self-badge">VOUS</span>
                    )}
                  </div>
                  <p className="users-user-email">{u.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="users-col-2">
                <span
                  className="users-role-badge"
                  style={{
                    backgroundColor:
                      (PERMISSIONS[u.role]?.color || '#666') + '15',
                    color: PERMISSIONS[u.role]?.color || '#666',
                  }}
                >
                  {getRoleIcon(u.role)}
                  {PERMISSIONS[u.role]?.label || u.role}
                </span>
              </div>

              {/* Status */}
              <div className="users-col-2">
                <button
                  onClick={() => !isSelf && handleToggleStatus(u.id)}
                  disabled={isSelf}
                  className={`users-status-btn ${
                    u.status === 'actif'
                      ? 'users-status-active'
                      : 'users-status-inactive'
                  } ${isSelf ? 'users-status-disabled' : ''}`}
                >
                  {u.status === 'actif' ? (
                    <CheckCircle sx={{ fontSize: 12 }} />
                  ) : (
                    <Cancel sx={{ fontSize: 12 }} />
                  )}
                  {u.status === 'actif' ? 'Actif' : 'Inactif'}
                </button>
              </div>

              {/* Date */}
              <div className="users-col-2">
                <span className="users-date">{u.createdAt}</span>
              </div>

              {/* Actions */}
              <div className="users-col-2 users-actions">
                <button
                  onClick={() => handleView(u)}
                  className="users-action-btn users-action-view"
                >
                  <Visibility sx={{ fontSize: 16 }} />
                </button>
                <button
                  onClick={() => handleEdit(u)}
                  className="users-action-btn users-action-edit"
                >
                  <Edit sx={{ fontSize: 16 }} />
                </button>
                {!isSelf && (
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="users-action-btn users-action-delete"
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="users-empty">
            <PersonAdd className="users-empty-icon" sx={{ fontSize: 48 }} />
            <p className="users-empty-text">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* ═══ MODAL : AJOUTER / MODIFIER ═══ */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="users-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="users-form-fields">
            {/* Avatar */}
            <div className="users-form-avatar-row">
              <Avatar src={form.avatar} sx={{ width: 50, height: 50 }} />
              <div className="users-form-avatar-input">
                <label className="users-form-label">URL Photo</label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  className="users-form-input"
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="users-form-label">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nom et prénom"
                className="users-form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="users-form-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nom@hgasys.com"
                className="users-form-input"
              />
            </div>

            {/* Password */}
            {!editMode && (
              <div>
                <label className="users-form-label">Mot de passe</label>
                <div className="users-form-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="users-form-input"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="users-form-password-toggle"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 16 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 16 }} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Role + Status */}
            <div className="users-form-grid-2">
              <div>
                <label className="users-form-label">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="users-form-select"
                >
                  {allRoles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="users-form-label">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="users-form-select"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            {/* Permissions preview */}
            <div className="users-perms-box">
              <p className="users-perms-title">
                <Shield sx={{ fontSize: 12 }} />
                Permissions : {PERMISSIONS[form.role]?.label}
              </p>
              <div className="users-perms-grid">
                {permissionsList.map((perm) => {
                  const active = PERMISSIONS[form.role]?.[perm.key];
                  return (
                    <div key={perm.key} className="users-perm-item">
                      {active ? (
                        <CheckCircle sx={{ fontSize: 12, color: '#4caf50' }} />
                      ) : (
                        <Cancel sx={{ fontSize: 12, color: '#e0e0e0' }} />
                      )}
                      <span
                        className={`users-perm-label ${
                          active
                            ? 'users-perm-label-active'
                            : 'users-perm-label-inactive'
                        }`}
                      >
                        {perm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button
            onClick={() => setOpenForm(false)}
            className="users-modal-btn users-modal-btn-cancel"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="users-modal-btn users-modal-btn-primary"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VOIR DÉTAILS ═══ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedUser && (
          <>
            <DialogTitle
              sx={{
                pb: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="users-header-title"
                style={{ fontSize: '0.875rem' }}
              >
                Profil utilisateur
              </span>
              <IconButton onClick={() => setOpenView(false)} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="users-view-center">
                <Avatar
                  src={selectedUser.avatar}
                  sx={{ width: 70, height: 70, mx: 'auto', mb: 1.5 }}
                />
                <h3 className="users-view-name">{selectedUser.name}</h3>
                <p className="users-view-email">{selectedUser.email}</p>
                <div className="users-view-badges">
                  <span
                    className="users-role-badge"
                    style={{
                      backgroundColor:
                        (PERMISSIONS[selectedUser.role]?.color || '#666') +
                        '15',
                      color:
                        PERMISSIONS[selectedUser.role]?.color || '#666',
                    }}
                  >
                    {getRoleIcon(selectedUser.role)}
                    {PERMISSIONS[selectedUser.role]?.label}
                  </span>
                  <span
                    className={`users-status-btn ${
                      selectedUser.status === 'actif'
                        ? 'users-status-active'
                        : 'users-status-inactive'
                    }`}
                    style={{ cursor: 'default' }}
                  >
                    {selectedUser.status === 'actif' ? (
                      <CheckCircle sx={{ fontSize: 10 }} />
                    ) : (
                      <Cancel sx={{ fontSize: 10 }} />
                    )}
                    {selectedUser.status === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              <div className="users-view-fields">
                <div className="users-view-field">
                  <Email sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="users-view-field-label">Email</p>
                    <p className="users-view-field-value">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="users-view-field">
                  <CalendarMonth sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="users-view-field-label">Créé le</p>
                    <p className="users-view-field-value">
                      {selectedUser.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="users-view-perms">
                <p className="users-perms-title">Permissions</p>
                <div className="users-perms-grid">
                  {permissionsList.map((perm) => {
                    const active =
                      PERMISSIONS[selectedUser.role]?.[perm.key];
                    return (
                      <div key={perm.key} className="users-perm-item">
                        {active ? (
                          <CheckCircle
                            sx={{ fontSize: 12, color: '#4caf50' }}
                          />
                        ) : (
                          <Cancel
                            sx={{ fontSize: 12, color: '#e0e0e0' }}
                          />
                        )}
                        <span className="users-perm-label users-perm-label-active">
                          {perm.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ═══ MODAL : CONFIRMER SUPPRESSION ═══ */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="users-delete-modal">
          <div className="users-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="users-delete-title">Supprimer cet utilisateur ?</h3>
          <p className="users-delete-text">
            Cette action est irréversible.
          </p>
          <div className="users-delete-actions">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="users-modal-btn users-modal-btn-cancel"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="users-modal-btn users-modal-btn-danger"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Users;