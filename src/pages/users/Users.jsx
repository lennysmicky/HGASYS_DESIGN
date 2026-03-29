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
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/roles';
import { mockUsers } from '../../data/mockData';

const Users = () => {
  const { user: currentUser } = useAuth();

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
    role: 'employe',
    status: 'actif',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = users.filter((u) => {
    const matchSearch = `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole = filterRole === 'tous' || u.role === filterRole;
    const matchStatus = filterStatus === 'tous' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    manager: users.filter((u) => u.role === 'manager').length,
    employe: users.filter((u) => u.role === 'employe').length,
    actif: users.filter((u) => u.status === 'actif').length,
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings sx={{ fontSize: 14 }} />;
      case 'manager':
        return <ManageAccounts sx={{ fontSize: 14 }} />;
      default:
        return <Person sx={{ fontSize: 14 }} />;
    }
  };

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
            ? { ...u, name: form.name, email: form.email, role: form.role, status: form.status, avatar: form.avatar }
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
        u.id === id ? { ...u, status: u.status === 'actif' ? 'inactif' : 'actif' } : u
      )
    );
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-xs text-gray-400 mt-0.5">Comptes et droits d'accès</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white
            text-xs font-medium rounded-lg transition-colors self-start"
        >
          <PersonAdd fontSize="small" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-red-500">{stats.admin}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Admins</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-[#1976D2]">{stats.manager}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Managers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-green-600">{stats.employe}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Employés</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-emerald-500">{stats.actif}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Actifs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher nom, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                placeholder:text-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Tous rôles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employe">Employé</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <div className="col-span-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Utilisateur</div>
          <div className="col-span-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rôle</div>
          <div className="col-span-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Statut</div>
          <div className="col-span-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Créé le</div>
          <div className="col-span-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</div>
        </div>

        {/* Table Rows */}
        {filtered.map((u) => {
          const isSelf = u.id === currentUser?.id;
          return (
            <div
              key={u.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 border-b border-gray-50
                hover:bg-gray-50/50 transition-colors items-center"
            >
              {/* User */}
              <div className="col-span-4 flex items-center gap-3">
                <Avatar src={u.avatar} sx={{ width: 36, height: 36 }} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-800 truncate">{u.name}</p>
                    {isSelf && (
                      <span className="text-[8px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded font-bold">
                        VOUS
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="col-span-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: (PERMISSIONS[u.role]?.color || '#666') + '15',
                    color: PERMISSIONS[u.role]?.color || '#666',
                  }}
                >
                  {getRoleIcon(u.role)}
                  {PERMISSIONS[u.role]?.label || u.role}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <button
                  onClick={() => !isSelf && handleToggleStatus(u.id)}
                  disabled={isSelf}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold
                    transition-colors cursor-pointer
                    ${u.status === 'actif'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }
                    ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <div className="col-span-2">
                <span className="text-[11px] text-gray-400">{u.createdAt}</span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-1">
                <button
                  onClick={() => handleView(u)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50
                    text-gray-400 hover:text-[#1976D2] transition-colors"
                >
                  <Visibility sx={{ fontSize: 16 }} />
                </button>
                <button
                  onClick={() => handleEdit(u)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-orange-50
                    text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Edit sx={{ fontSize: 16 }} />
                </button>
                {!isSelf && (
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50
                      text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <PersonAdd sx={{ fontSize: 48, color: '#e0e0e0' }} />
            <p className="text-sm text-gray-400 mt-3">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* ==================== MODAL : AJOUTER / MODIFIER ==================== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-sm font-bold text-gray-800">
            {editMode ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="space-y-3">
            {/* Avatar preview */}
            <div className="flex items-center gap-3">
              <Avatar src={form.avatar} sx={{ width: 50, height: 50 }} />
              <div className="flex-1">
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">URL Photo</label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nom et prénom"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nom@hgasys.com"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {!editMode && (
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 pr-10 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="admin">Administrateur</option>
                  <option value="manager">Manager</option>
                  <option value="employe">Employé</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            {/* Permissions preview */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Shield sx={{ fontSize: 12 }} /> Permissions du rôle : {PERMISSIONS[form.role]?.label}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'canManageUsers', label: 'Gérer utilisateurs' },
                  { key: 'canManageEmployees', label: 'Gérer employés' },
                  { key: 'canManageVehicles', label: 'Gérer véhicules' },
                  { key: 'canManageClients', label: 'Gérer clients' },
                  { key: 'canManageSales', label: 'Gérer ventes' },
                  { key: 'canViewReports', label: 'Voir rapports' },
                ].map((perm) => (
                  <div key={perm.key} className="flex items-center gap-1.5">
                    {PERMISSIONS[form.role]?.[perm.key] ? (
                      <CheckCircle sx={{ fontSize: 12, color: '#4caf50' }} />
                    ) : (
                      <Cancel sx={{ fontSize: 12, color: '#e0e0e0' }} />
                    )}
                    <span
                      className={`text-[10px] ${
                        PERMISSIONS[form.role]?.[perm.key] ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      {perm.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button
            onClick={() => setOpenForm(false)}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-lg transition-colors"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ==================== MODAL : VOIR DÉTAILS ==================== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-sm font-bold text-gray-800">Profil utilisateur</span>
              <IconButton onClick={() => setOpenView(false)} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="text-center py-3">
                <Avatar
                  src={selectedUser.avatar}
                  sx={{ width: 70, height: 70, mx: 'auto', mb: 1.5 }}
                />
                <h3 className="text-sm font-bold text-gray-800">{selectedUser.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{selectedUser.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                    style={{
                      backgroundColor: (PERMISSIONS[selectedUser.role]?.color || '#666') + '15',
                      color: PERMISSIONS[selectedUser.role]?.color || '#666',
                    }}
                  >
                    {getRoleIcon(selectedUser.role)}
                    {PERMISSIONS[selectedUser.role]?.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold
                      ${selectedUser.status === 'actif'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                      }`}
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

              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Email sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-xs font-medium text-gray-700">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <CalendarMonth sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Créé le</p>
                    <p className="text-xs font-medium text-gray-700">{selectedUser.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-4 p-3 bg-blue-50/50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Permissions
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { key: 'canManageUsers', label: 'Utilisateurs' },
                    { key: 'canManageEmployees', label: 'Employés' },
                    { key: 'canManageVehicles', label: 'Véhicules' },
                    { key: 'canManageClients', label: 'Clients' },
                    { key: 'canManageSales', label: 'Ventes' },
                    { key: 'canViewReports', label: 'Rapports' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center gap-1.5">
                      {PERMISSIONS[selectedUser.role]?.[perm.key] ? (
                        <CheckCircle sx={{ fontSize: 12, color: '#4caf50' }} />
                      ) : (
                        <Cancel sx={{ fontSize: 12, color: '#e0e0e0' }} />
                      )}
                      <span className="text-[10px] text-gray-600">{perm.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ==================== MODAL : CONFIRMER SUPPRESSION ==================== */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="p-5 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 mt-3">Supprimer cet utilisateur ?</h3>
          <p className="text-xs text-gray-400 mt-1">Cette action est irréversible.</p>
          <div className="flex gap-2 mt-5 justify-center">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
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