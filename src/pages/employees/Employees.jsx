import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Close,
  Visibility,
  BadgeOutlined,
  Phone,
  Email,
  LocationOn,
  CalendarMonth,
  AttachMoney,
  Description,
  PictureAsPdf,
  InsertDriveFile,
  CloudUpload,
  Work,
  Business,
  CheckCircle,
  Cancel,
  Download,
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar, Tabs, Tab } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { canDo } from '../../utils/roles';
import { mockEmployees } from '../../data/mockData';

const Employees = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageEmployees');

  const [employees, setEmployees] = useState(mockEmployees);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewTab, setViewTab] = useState(0);

  const departements = [...new Set(mockEmployees.map((e) => e.departement))];

  const emptyForm = {
    name: '',
    poste: '',
    departement: 'Ventes',
    salaire: '',
    telephone: '',
    email: '',
    adresse: '',
    dateEmbauche: new Date().toISOString().split('T')[0],
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
    documents: [],
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const filtered = employees.filter((e) => {
    const matchSearch = `${e.name} ${e.poste} ${e.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchDept = filterDept === 'tous' || e.departement === filterDept;
    const matchStatus = filterStatus === 'tous' || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const stats = {
    total: employees.length,
    actif: employees.filter((e) => e.status === 'actif').length,
    inactif: employees.filter((e) => e.status === 'inactif').length,
    masseSalariale: employees
      .filter((e) => e.status === 'actif')
      .reduce((sum, e) => sum + e.salaire, 0),
  };

  const getDeptColor = (dept) => {
    const colors = {
      Direction: '#d32f2f',
      Commercial: '#1976D2',
      Ventes: '#388e3c',
      Atelier: '#ff9800',
      Finance: '#9c27b0',
    };
    return colors[dept] || '#607d8b';
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (emp) => {
    setForm({ ...emp });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setViewTab(0);
    setOpenView(true);
  };

  const handleSave = () => {
    if (editMode) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === form.id ? { ...form, salaire: Number(form.salaire) } : e
        )
      );
    } else {
      const newEmp = {
        ...form,
        id: employees.length + 1,
        salaire: Number(form.salaire),
        documents: [
          { name: 'Contrat de travail', type: 'PDF', date: form.dateEmbauche, size: '240 KB' },
          { name: 'CV', type: 'PDF', date: form.dateEmbauche, size: '175 KB' },
        ],
      };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getAnciennete = (dateEmbauche) => {
    const now = new Date();
    const embauche = new Date(dateEmbauche);
    const diff = now.getFullYear() - embauche.getFullYear();
    const months = now.getMonth() - embauche.getMonth();
    if (diff === 0) return `${months} mois`;
    if (months < 0) return `${diff - 1} an(s)`;
    return `${diff} an(s)`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestion RH - Employés</h1>
          <p className="text-xs text-gray-400 mt-0.5">Dossiers administratifs du personnel</p>
        </div>
        {canManage && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white
              text-xs font-medium rounded-lg transition-colors self-start"
          >
            <Add fontSize="small" />
            Ajouter un employé
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{stats.total}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <BadgeOutlined sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Actifs</p>
              <p className="text-xl font-bold text-green-600 mt-0.5">{stats.actif}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Inactifs</p>
              <p className="text-xl font-bold text-red-500 mt-0.5">{stats.inactif}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <Cancel sx={{ fontSize: 18, color: '#f44336' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Masse salariale</p>
              <p className="text-lg font-bold text-[#1976D2] mt-0.5">{formatPrice(stats.masseSalariale)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <AttachMoney sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher nom, poste, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                placeholder:text-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Tous départements</option>
              {departements.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
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

{/* Employees Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
  {filtered.map((emp) => (
    <div
      key={emp.id}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
    >
      {/* ❌ SUPPRIMÉ : barre en haut */}

      <div className="p-4 relative">
        <div className="flex items-start gap-3">
          {/* Photo */}
          <div className="relative">
            <Avatar
              src={emp.photo}
              sx={{ width: 52, height: 52 }}
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white
                ${emp.status === 'actif' ? 'bg-green-500' : 'bg-red-400'}`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-800 truncate">{emp.name}</h3>
            <p className="text-[11px] text-gray-500">{emp.poste}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{
                  backgroundColor: getDeptColor(emp.departement) + '15',
                  color: getDeptColor(emp.departement),
                }}
              >
                {emp.departement}
              </span>
              <span className="text-[10px] text-gray-400">
                {getAnciennete(emp.dateEmbauche)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleView(emp)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50
                text-gray-400 hover:text-[#1976D2] transition-colors"
            >
              <Visibility sx={{ fontSize: 15 }} />
            </button>

            {canManage && (
              <>
                <button
                  onClick={() => handleEdit(emp)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-orange-50
                    text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Edit sx={{ fontSize: 15 }} />
                </button>

                <button
                  onClick={() => setDeleteConfirm(emp.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50
                    text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Delete sx={{ fontSize: 15 }} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center gap-2 text-gray-400">
            <Phone sx={{ fontSize: 12 }} />
            <span className="text-[11px]">{emp.telephone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Email sx={{ fontSize: 12 }} />
            <span className="text-[11px] truncate">{emp.email}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-[#1976D2]">
            {formatPrice(emp.salaire)}
            <span className="text-[9px] text-gray-400 font-normal"> /mois</span>
          </p>
          <div className="flex items-center gap-1 text-gray-400">
            <Description sx={{ fontSize: 12 }} />
            <span className="text-[10px]">{emp.documents.length} docs</span>
          </div>
        </div>

        {/*  Rond couleur département */}
        <div
  cclassName="absolute top-4 right-4 w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
  style={{ backgroundColor: getDeptColor(emp.departement) }}
/>
      </div>
    </div>
  ))}
</div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <BadgeOutlined sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="text-sm text-gray-400 mt-3">Aucun employé trouvé</p>
        </div>
      )}

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
            {editMode ? 'Modifier l\'employé' : 'Ajouter un employé'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="space-y-3">
            {/* Photo */}
            <div className="flex items-center gap-3">
              <Avatar src={form.photo} sx={{ width: 56, height: 56 }} />
              <div className="flex-1">
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">URL Photo</label>
                <input
                  type="text"
                  value={form.photo}
                  onChange={(e) => handleChange('photo', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Poste</label>
                <input
                  type="text"
                  value={form.poste}
                  onChange={(e) => handleChange('poste', e.target.value)}
                  placeholder="Vendeur Senior"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Département</label>
                <select
                  value={form.departement}
                  onChange={(e) => handleChange('departement', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Direction">Direction</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Ventes">Ventes</option>
                  <option value="Atelier">Atelier</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Salaire (CFA/mois)</label>
                <input
                  type="number"
                  value={form.salaire}
                  onChange={(e) => handleChange('salaire', e.target.value)}
                  placeholder="85000"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="0555 12 34 56"
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
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="Adresse complète"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Date d'embauche</label>
                <input
                  type="date"
                  value={form.dateEmbauche}
                  onChange={(e) => handleChange('dateEmbauche', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
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

      {/* ==================== MODAL : DOSSIER EMPLOYÉ COMPLET ==================== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
      >
        {selectedEmployee && (
          <>
            {/* Header with color */}
            <div
              className="h-2"
              style={{ backgroundColor: getDeptColor(selectedEmployee.departement) }}
            />
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-sm font-bold text-gray-800">Dossier employé</span>
              <IconButton onClick={() => setOpenView(false)} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Profile header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-100">
                <div className="relative">
                  <Avatar
                    src={selectedEmployee.photo}
                    sx={{ width: 80, height: 80 }}
                  />
                  <div
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white
                      ${selectedEmployee.status === 'actif' ? 'bg-green-500' : 'bg-red-400'}`}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-base font-bold text-gray-800">{selectedEmployee.name}</h2>
                  <p className="text-xs text-gray-500">{selectedEmployee.poste}</p>
                  <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        backgroundColor: getDeptColor(selectedEmployee.departement) + '15',
                        color: getDeptColor(selectedEmployee.departement),
                      }}
                    >
                      {selectedEmployee.departement}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold
                        ${selectedEmployee.status === 'actif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {selectedEmployee.status === 'actif' ? '● Actif' : '● Inactif'}
                    </span>
                  </div>
                </div>
                <div className="sm:ml-auto text-center">
                  <p className="text-xl font-bold text-[#1976D2]">
                    {formatPrice(selectedEmployee.salaire)}
                  </p>
                  <p className="text-[10px] text-gray-400">Salaire mensuel</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={viewTab}
                onChange={(e, val) => setViewTab(val)}
                sx={{
                  mt: 1,
                  '& .MuiTab-root': { fontSize: 11, textTransform: 'none', minHeight: 40 },
                  '& .MuiTabs-indicator': { backgroundColor: '#1976D2' },
                }}
              >
                <Tab label="Informations" />
                <Tab label={`Documents (${selectedEmployee.documents.length})`} />
              </Tabs>

              {/* Tab 0 : Informations */}
              {viewTab === 0 && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Work sx={{ fontSize: 16, color: '#1976D2' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Poste</p>
                        <p className="text-xs font-semibold text-gray-700">{selectedEmployee.poste}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Business sx={{ fontSize: 16, color: '#9c27b0' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Département</p>
                        <p className="text-xs font-semibold text-gray-700">{selectedEmployee.departement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone sx={{ fontSize: 16, color: '#4caf50' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Téléphone</p>
                        <p className="text-xs font-semibold text-gray-700">{selectedEmployee.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Email sx={{ fontSize: 16, color: '#ff9800' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Email</p>
                        <p className="text-xs font-semibold text-gray-700">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <LocationOn sx={{ fontSize: 16, color: '#f44336' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Adresse</p>
                        <p className="text-xs font-semibold text-gray-700">{selectedEmployee.adresse}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <CalendarMonth sx={{ fontSize: 16, color: '#009688' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Date d'embauche</p>
                        <p className="text-xs font-semibold text-gray-700">
                          {selectedEmployee.dateEmbauche}
                          <span className="text-gray-400 font-normal ml-1">
                            ({getAnciennete(selectedEmployee.dateEmbauche)})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Salary detail */}
                  <div className="p-4 bg-blue-50/50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Détails salaire
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-800">{formatPrice(selectedEmployee.salaire)}</p>
                        <p className="text-[9px] text-gray-400">Salaire brut</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-green-600">
                          {formatPrice(Math.round(selectedEmployee.salaire * 0.91))}
                        </p>
                        <p className="text-[9px] text-gray-400">Salaire net (estimé)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#1976D2]">
                          {formatPrice(selectedEmployee.salaire * 12)}
                        </p>
                        <p className="text-[9px] text-gray-400">Annuel</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1 : Documents */}
              {viewTab === 1 && (
                <div className="mt-3">
                  {/* Upload button */}
                  {canManage && (
                    <div className="mb-3 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center
                      hover:border-blue-300 transition-colors cursor-pointer">
                      <CloudUpload sx={{ fontSize: 28, color: '#bdbdbd' }} />
                      <p className="text-xs text-gray-400 mt-1">
                        Glisser un fichier ou <span className="text-[#1976D2] font-medium">parcourir</span>
                      </p>
                      <p className="text-[9px] text-gray-300 mt-0.5">PDF, JPG, PNG (max 5MB)</p>
                    </div>
                  )}

                  {/* Documents list */}
                  <div className="space-y-2">
                    {selectedEmployee.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg
                          hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                          <PictureAsPdf sx={{ fontSize: 18, color: '#f44336' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-gray-400">{doc.type}</span>
                            <span className="text-[9px] text-gray-300">•</span>
                            <span className="text-[9px] text-gray-400">{doc.size}</span>
                            <span className="text-[9px] text-gray-300">•</span>
                            <span className="text-[9px] text-gray-400">{doc.date}</span>
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center
                          hover:bg-blue-50 text-gray-400 hover:text-[#1976D2] transition-colors">
                          <Download sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedEmployee.documents.length === 0 && (
                    <div className="p-8 text-center">
                      <InsertDriveFile sx={{ fontSize: 36, color: '#e0e0e0' }} />
                      <p className="text-xs text-gray-400 mt-2">Aucun document</p>
                    </div>
                  )}
                </div>
              )}
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
          <h3 className="text-sm font-bold text-gray-800 mt-3">Supprimer cet employé ?</h3>
          <p className="text-xs text-gray-400 mt-1">Le dossier sera définitivement supprimé.</p>
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

export default Employees;