// src/pages/employees/Employees.jsx
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
  Male,
  Female,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockEmployees } from '../../../data/mockData';
import '../../../styles/employees.css';

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

  const departements = [...new Set(employees.map((e) => e.departement))];

  const emptyForm = {
    name: '',
    sexe: 'homme',
    poste: '',
    departement: 'Commercial',
    salaire: '',
    telephone: '',
    email: '',
    adresse: '',
    dateEmbauche: new Date().toISOString().split('T')[0],
    dateNaissance: '',
    status: 'actif',
    typeContrat: 'CDI',
    photo: '',
    documents: [],
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  // ─── Filtrage ───
  const filtered = employees.filter((e) => {
    const matchSearch = `${e.name} ${e.poste} ${e.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchDept = filterDept === 'tous' || e.departement === filterDept;
    const matchStatus =
      filterStatus === 'tous' || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  // ─── Stats ───
  const stats = {
    total: employees.length,
    actif: employees.filter((e) => e.status === 'actif').length,
    inactif: employees.filter((e) => e.status === 'inactif').length,
    hommes: employees.filter((e) => e.sexe === 'homme').length,
    femmes: employees.filter((e) => e.sexe === 'femme').length,
    masseSalariale: employees
      .filter((e) => e.status === 'actif')
      .reduce((sum, e) => sum + e.salaire, 0),
  };

  // ─── Données PieChart ───
  const genderData = [
    { name: 'Hommes', value: stats.hommes, color: '#1976D2' },
    { name: 'Femmes', value: stats.femmes, color: '#E91E63' },
  ];

  const getDeptColor = (dept) => {
    const colors = {
      Direction: '#d32f2f',
      Commercial: '#1976D2',
      Administration: '#ff9800',
      Technique: '#7B1FA2',
      Clientèle: '#388e3c',
      Magasin: '#00796B',
      Finance: '#9c27b0',
    };
    return colors[dept] || '#607d8b';
  };

  const getAnciennete = (dateEmbauche) => {
    const now = new Date();
    const embauche = new Date(dateEmbauche);
    const diff = now.getFullYear() - embauche.getFullYear();
    const months = now.getMonth() - embauche.getMonth();
    if (diff === 0) return `${Math.max(months, 1)} mois`;
    if (months < 0) return `${diff - 1} an(s)`;
    return `${diff} an(s)`;
  };

  // ─── Handlers ───
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
          {
            name: `Contrat ${form.typeContrat}`,
            type: 'PDF',
            date: form.dateEmbauche,
            size: '240 KB',
          },
          {
            name: 'CV',
            type: 'PDF',
            date: form.dateEmbauche,
            size: '175 KB',
          },
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

  return (
    <div className="employees-page">
      {/* ═══ Header ═══ */}
      <div className="emp-header">
        <div>
          <h1 className="emp-header-title">Gestion RH - Employés</h1>
          <p className="emp-header-subtitle">
            Dossiers administratifs du personnel
          </p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="emp-add-btn">
            <Add fontSize="small" />
            Ajouter un employé
          </button>
        )}
      </div>

      {/* ═══ Stats + PieChart ═══ */}
      <div className="emp-stats-section">
        {/* Stats cards */}
        <div className="emp-stats-grid">
          <div className="emp-stat-card">
            <div className="emp-stat-row">
              <div>
                <p className="emp-stat-label">Total</p>
                <p className="emp-stat-value" style={{ color: '#1e293b' }}>
                  {stats.total}
                </p>
              </div>
              <div
                className="emp-stat-icon"
                style={{ background: '#eff6ff' }}
              >
                <BadgeOutlined sx={{ fontSize: 18, color: '#1976D2' }} />
              </div>
            </div>
          </div>

          <div className="emp-stat-card">
            <div className="emp-stat-row">
              <div>
                <p className="emp-stat-label">Actifs</p>
                <p className="emp-stat-value" style={{ color: '#16a34a' }}>
                  {stats.actif}
                </p>
              </div>
              <div
                className="emp-stat-icon"
                style={{ background: '#f0fdf4' }}
              >
                <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
              </div>
            </div>
          </div>

          <div className="emp-stat-card">
            <div className="emp-stat-row">
              <div>
                <p className="emp-stat-label">Inactifs</p>
                <p className="emp-stat-value" style={{ color: '#ef4444' }}>
                  {stats.inactif}
                </p>
              </div>
              <div
                className="emp-stat-icon"
                style={{ background: '#fef2f2' }}
              >
                <Cancel sx={{ fontSize: 18, color: '#f44336' }} />
              </div>
            </div>
          </div>

          <div className="emp-stat-card">
            <div className="emp-stat-row">
              <div>
                <p className="emp-stat-label">Masse salariale</p>
                <p
                  className="emp-stat-value"
                  style={{ color: '#1976D2', fontSize: '1.125rem' }}
                >
                  {formatPrice(stats.masseSalariale)}
                </p>
              </div>
              <div
                className="emp-stat-icon"
                style={{ background: '#eff6ff' }}
              >
                <AttachMoney sx={{ fontSize: 18, color: '#1976D2' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── PieChart Hommes/Femmes ─── */}
        <div className="emp-gender-card">
          <h3 className="emp-gender-title">Répartition H/F</h3>
          <div className="emp-gender-chart-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Total au centre */}
            <div className="emp-gender-center">
              <span className="emp-gender-center-value">{stats.total}</span>
              <span className="emp-gender-center-label">Total</span>
            </div>
          </div>
          {/* Légende */}
          <div className="emp-gender-legend">
            <div className="emp-gender-legend-item">
              <Male sx={{ fontSize: 16, color: '#1976D2' }} />
              <span className="emp-gender-legend-count" style={{ color: '#1976D2' }}>
                {stats.hommes}
              </span>
              <span className="emp-gender-legend-label">Hommes</span>
            </div>
            <div className="emp-gender-legend-item">
              <Female sx={{ fontSize: 16, color: '#E91E63' }} />
              <span className="emp-gender-legend-count" style={{ color: '#E91E63' }}>
                {stats.femmes}
              </span>
              <span className="emp-gender-legend-label">Femmes</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="emp-filters">
        <div className="emp-filters-row">
          <div className="emp-search-wrapper">
            <Search fontSize="small" className="emp-search-icon" />
            <input
              type="text"
              placeholder="Rechercher nom, poste, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="emp-search-input"
            />
          </div>
          <div className="emp-filter-selects">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="emp-select"
            >
              <option value="tous">Tous départements</option>
              {departements.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="emp-select"
            >
              <option value="tous">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Employees Grid ═══ */}
      <div className="emp-grid">
        {filtered.map((emp) => (
          <div key={emp.id} className="emp-card">
            <div className="emp-card-body">
              <div className="emp-card-main">
                <div className="emp-card-left">
                  <div className="emp-avatar-wrapper">
                    <Avatar src={emp.photo} sx={{ width: 40, height: 40 }} />
                    <div className={`emp-status-dot ${emp.status === 'actif' ? 'emp-status-dot-active' : 'emp-status-dot-inactive'}`} />
                  </div>
                  <div className="emp-card-info">
                    <h3 className="emp-card-name">{emp.name}</h3>
                    <p className="emp-card-poste">{emp.poste}</p>
                    <div className="emp-card-meta">
                      <span className="emp-dept-badge" style={{ backgroundColor: getDeptColor(emp.departement) + '15', color: getDeptColor(emp.departement) }}>
                        {emp.departement}
                      </span>
                      <span className="emp-anciennete">{getAnciennete(emp.dateEmbauche)}</span>
                      {emp.typeContrat && <span className="emp-contrat-badge">{emp.typeContrat}</span>}
                    </div>
                  </div>
                </div>

                <div className="emp-card-actions-vertical">
                  <button onClick={() => handleView(emp)} className="emp-action-btn emp-action-view" title="Voir">
                    <Visibility sx={{ fontSize: 15 }} />
                  </button>
                  {canManage && (
                    <>
                      <button onClick={() => handleEdit(emp)} className="emp-action-btn emp-action-edit" title="Modifier">
                        <Edit sx={{ fontSize: 15 }} />
                      </button>
                      <button onClick={() => setDeleteConfirm(emp.id)} className="emp-action-btn emp-action-delete" title="Supprimer">
                        <Delete sx={{ fontSize: 15 }} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="emp-card-details">
                <div className="emp-detail-row">
                  <Phone sx={{ fontSize: 12 }} />
                  <span className="emp-detail-text">{emp.telephone}</span>
                </div>
                <div className="emp-detail-row">
                  <Email sx={{ fontSize: 12 }} />
                  <span className="emp-detail-text">{emp.email}</span>
                </div>
              </div>

              <div className="emp-card-footer">
                <p className="emp-salary">{formatPrice(emp.salaire)}<span className="emp-salary-suffix"> /mois</span></p>
                <div className="emp-docs-count">
                  <Description sx={{ fontSize: 12 }} />
                  <span>{emp.documents.length} docs</span>
                </div>
              </div>

              {/* Le point coloré a été supprimé */}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="emp-empty">
          <BadgeOutlined sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="emp-empty-text">Aucun employé trouvé</p>
        </div>
      )}

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
          <span className="emp-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? "Modifier l'employé" : 'Ajouter un employé'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="emp-form-fields">
            {/* Photo */}
            <div className="emp-form-avatar-row">
              <Avatar src={form.photo} sx={{ width: 56, height: 56 }} />
              <div style={{ flex: 1 }}>
                <label className="emp-form-label">URL Photo</label>
                <input
                  type="text"
                  value={form.photo}
                  onChange={(e) => handleChange('photo', e.target.value)}
                  className="emp-form-input"
                />
              </div>
            </div>

            <div className="emp-form-grid-2">
              <div>
                <label className="emp-form-label">Nom complet</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nom et prénom"
                  className="emp-form-input"
                />
              </div>
              <div>
                <label className="emp-form-label">Sexe</label>
                <select
                  value={form.sexe}
                  onChange={(e) => handleChange('sexe', e.target.value)}
                  className="emp-form-select"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
            </div>

            <div className="emp-form-grid-2">
              <div>
                <label className="emp-form-label">Poste</label>
                <input
                  type="text"
                  value={form.poste}
                  onChange={(e) => handleChange('poste', e.target.value)}
                  placeholder="Vendeur Senior"
                  className="emp-form-input"
                />
              </div>
              <div>
                <label className="emp-form-label">Département</label>
                <select
                  value={form.departement}
                  onChange={(e) =>
                    handleChange('departement', e.target.value)
                  }
                  className="emp-form-select"
                >
                  <option value="Direction">Direction</option>
                  <option value="Administration">Administration</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Technique">Technique</option>
                  <option value="Clientèle">Clientèle</option>
                  <option value="Magasin">Magasin</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div className="emp-form-grid-2">
              <div>
                <label className="emp-form-label">Type contrat</label>
                <select
                  value={form.typeContrat}
                  onChange={(e) =>
                    handleChange('typeContrat', e.target.value)
                  }
                  className="emp-form-select"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>
              <div>
                <label className="emp-form-label">Salaire (CFA/mois)</label>
                <input
                  type="number"
                  value={form.salaire}
                  onChange={(e) => handleChange('salaire', e.target.value)}
                  placeholder="85000"
                  className="emp-form-input"
                />
              </div>
            </div>

            <div className="emp-form-grid-2">
              <div>
                <label className="emp-form-label">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) =>
                    handleChange('telephone', e.target.value)
                  }
                  placeholder="0555 12 34 56"
                  className="emp-form-input"
                />
              </div>
              <div>
                <label className="emp-form-label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="nom@hgasys.com"
                  className="emp-form-input"
                />
              </div>
            </div>

            <div>
              <label className="emp-form-label">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="Adresse complète"
                className="emp-form-input"
              />
            </div>

            <div className="emp-form-grid-2">
              <div>
                <label className="emp-form-label">Date de naissance</label>
                <input
                  type="date"
                  value={form.dateNaissance}
                  onChange={(e) =>
                    handleChange('dateNaissance', e.target.value)
                  }
                  className="emp-form-input"
                />
              </div>
              <div>
                <label className="emp-form-label">Date d'embauche</label>
                <input
                  type="date"
                  value={form.dateEmbauche}
                  onChange={(e) =>
                    handleChange('dateEmbauche', e.target.value)
                  }
                  className="emp-form-input"
                />
              </div>
            </div>

            <div>
              <label className="emp-form-label">Statut</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="emp-form-select"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button
            onClick={() => setOpenForm(false)}
            className="emp-modal-btn emp-modal-btn-cancel"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="emp-modal-btn emp-modal-btn-primary"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : DOSSIER EMPLOYÉ ═══ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
        className="emp-view-modal"  
      >
        {selectedEmployee && (
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
                className="emp-header-title"
                style={{ fontSize: '0.875rem' }}
              >
                Dossier employé
              </span>
              <IconButton
                onClick={() => setOpenView(false)}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Profile header */}
              <div className="emp-view-profile">
                <div className="emp-avatar-wrapper">
                  <Avatar
                    src={selectedEmployee.photo}
                    sx={{ width: 80, height: 80 }}
                  />
                  <div
                    className={`emp-status-dot ${
                      selectedEmployee.status === 'actif'
                        ? 'emp-status-dot-active'
                        : 'emp-status-dot-inactive'
                    }`}
                    style={{ width: 16, height: 16 }}
                  />
                </div>
                <div className="emp-view-profile-info">
                  <h2 className="emp-view-name">
                    {selectedEmployee.name}
                  </h2>
                  <p className="emp-view-poste">
                    {selectedEmployee.poste}
                  </p>
                  <div className="emp-view-badges">
                    <span
                      className="emp-dept-badge"
                      style={{
                        backgroundColor:
                          getDeptColor(selectedEmployee.departement) +
                          '15',
                        color: getDeptColor(
                          selectedEmployee.departement
                        ),
                      }}
                    >
                      {selectedEmployee.departement}
                    </span>
                    <span
                      className={`emp-status-badge ${
                        selectedEmployee.status === 'actif'
                          ? 'emp-status-badge-active'
                          : 'emp-status-badge-inactive'
                      }`}
                    >
                      ●{' '}
                      {selectedEmployee.status === 'actif'
                        ? 'Actif'
                        : 'Inactif'}
                    </span>
                    {selectedEmployee.typeContrat && (
                      <span className="emp-contrat-badge">
                        {selectedEmployee.typeContrat}
                      </span>
                    )}
                  </div>
                </div>
                <div className="emp-view-salary-box">
                  <p className="emp-view-salary-value">
                    {formatPrice(selectedEmployee.salaire)}
                  </p>
                  <p className="emp-view-salary-label">Salaire mensuel</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={viewTab}
                onChange={(e, val) => setViewTab(val)}
                sx={{
                  mt: 1,
                  '& .MuiTab-root': {
                    fontSize: 11,
                    textTransform: 'none',
                    minHeight: 40,
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',  // ← masque l’indicateur bleu
                  },
                }}
              >
                <Tab label="Informations" />
                <Tab
                  label={`Documents (${selectedEmployee.documents.length})`}
                />
              </Tabs>

              {/* Tab 0 : Informations */}
              {viewTab === 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="emp-view-fields">
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#eff6ff' }}
                      >
                        <Work sx={{ fontSize: 16, color: '#1976D2' }} />
                      </div>
                      <div>
                        <p className="emp-view-field-label">Poste</p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.poste}
                        </p>
                      </div>
                    </div>
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#f3e8ff' }}
                      >
                        <Business
                          sx={{ fontSize: 16, color: '#9c27b0' }}
                        />
                      </div>
                      <div>
                        <p className="emp-view-field-label">Département</p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.departement}
                        </p>
                      </div>
                    </div>
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#f0fdf4' }}
                      >
                        <Phone sx={{ fontSize: 16, color: '#4caf50' }} />
                      </div>
                      <div>
                        <p className="emp-view-field-label">Téléphone</p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.telephone}
                        </p>
                      </div>
                    </div>
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#fff7ed' }}
                      >
                        <Email sx={{ fontSize: 16, color: '#ff9800' }} />
                      </div>
                      <div>
                        <p className="emp-view-field-label">Email</p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.email}
                        </p>
                      </div>
                    </div>
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#fef2f2' }}
                      >
                        <LocationOn
                          sx={{ fontSize: 16, color: '#f44336' }}
                        />
                      </div>
                      <div>
                        <p className="emp-view-field-label">Adresse</p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.adresse}
                        </p>
                      </div>
                    </div>
                    <div className="emp-view-field">
                      <div
                        className="emp-view-field-icon"
                        style={{ background: '#f0fdfa' }}
                      >
                        <CalendarMonth
                          sx={{ fontSize: 16, color: '#009688' }}
                        />
                      </div>
                      <div>
                        <p className="emp-view-field-label">
                          Date d'embauche
                        </p>
                        <p className="emp-view-field-value">
                          {selectedEmployee.dateEmbauche}
                          <span className="emp-view-field-extra">
                            (
                            {getAnciennete(
                              selectedEmployee.dateEmbauche
                            )}
                            )
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Salary detail */}
                  <div className="emp-salary-detail">
                    <p className="emp-salary-detail-title">
                      Détails salaire
                    </p>
                    <div className="emp-salary-grid">
                      <div className="emp-salary-item">
                        <p
                          className="emp-salary-item-value"
                          style={{ color: '#1e293b' }}
                        >
                          {formatPrice(selectedEmployee.salaire)}
                        </p>
                        <p className="emp-salary-item-label">
                          Salaire brut
                        </p>
                      </div>
                      <div className="emp-salary-item">
                        <p
                          className="emp-salary-item-value"
                          style={{ color: '#16a34a' }}
                        >
                          {formatPrice(
                            Math.round(selectedEmployee.salaire * 0.91)
                          )}
                        </p>
                        <p className="emp-salary-item-label">
                          Net estimé
                        </p>
                      </div>
                      <div className="emp-salary-item">
                        <p
                          className="emp-salary-item-value"
                          style={{ color: '#1976D2' }}
                        >
                          {formatPrice(selectedEmployee.salaire * 12)}
                        </p>
                        <p className="emp-salary-item-label">Annuel</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1 : Documents */}
              {viewTab === 1 && (
                <div style={{ marginTop: '0.75rem' }}>
                  {canManage && (
                    <div className="emp-upload-zone">
                      <CloudUpload
                        sx={{ fontSize: 28, color: '#bdbdbd' }}
                      />
                      <p className="emp-upload-text">
                        Glisser un fichier ou{' '}
                        <span className="emp-upload-link">parcourir</span>
                      </p>
                      <p className="emp-upload-hint">
                        PDF, JPG, PNG (max 5MB)
                      </p>
                    </div>
                  )}

                  <div className="emp-docs-list">
                    {selectedEmployee.documents.map((doc, idx) => (
                      <div key={idx} className="emp-doc-item">
                        <div className="emp-doc-icon">
                          <PictureAsPdf
                            sx={{ fontSize: 18, color: '#f44336' }}
                          />
                        </div>
                        <div className="emp-doc-info">
                          <p className="emp-doc-name">{doc.name}</p>
                          <div className="emp-doc-meta">
                            <span>{doc.type}</span>
                            <span className="emp-doc-meta-dot">•</span>
                            <span>{doc.size}</span>
                            <span className="emp-doc-meta-dot">•</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <button className="emp-doc-download">
                          <Download sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedEmployee.documents.length === 0 && (
                    <div className="emp-docs-empty">
                      <InsertDriveFile
                        sx={{ fontSize: 36, color: '#e0e0e0' }}
                      />
                      <p className="emp-docs-empty-text">
                        Aucun document
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ═══ MODAL : SUPPRESSION ═══ */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="emp-delete-modal">
          <div className="emp-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="emp-delete-title">Supprimer cet employé ?</h3>
          <p className="emp-delete-text">
            Le dossier sera définitivement supprimé.
          </p>
          <div className="emp-delete-actions">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="emp-modal-btn emp-modal-btn-cancel"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="emp-modal-btn emp-modal-btn-danger"
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