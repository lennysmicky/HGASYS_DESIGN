import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Close,
  Download,
  Description,
  PictureAsPdf,
  InsertDriveFile,
  FolderOpen,
  CalendarMonth,
  Person,
  Badge,
  CheckCircle,
  Archive,
  WorkOutline,
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
import { canDo } from '../../../utils/roles';
import { mockHrDossiers, mockEmployees } from '../../../data/mockData';
import '../../../styles/hrDossiers.css';

const HrDossiers = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageHrDossiers');

  const [dossiers, setDossiers] = useState(mockHrDossiers);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterEmployee, setFilterEmployee] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const types = [...new Set(dossiers.map((d) => d.type))];
  const employeeNames = [...new Set(dossiers.map((d) => d.employeName))];

  const emptyForm = {
    employeId: '',
    employeName: '',
    type: 'Contrat',
    titre: '',
    dateDocument: new Date().toISOString().split('T')[0],
    dateExpiration: '',
    fichier: '',
    taille: '0 KB',
    statut: 'actif',
  };

  const [form, setForm] = useState(emptyForm);

  // ─── Filtrage ───
  const filtered = dossiers.filter((d) => {
    const matchSearch = `${d.titre} ${d.employeName} ${d.type}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = filterType === 'tous' || d.type === filterType;
    const matchEmployee =
      filterEmployee === 'tous' || d.employeName === filterEmployee;
    const matchStatut = filterStatut === 'tous' || d.statut === filterStatut;
    return matchSearch && matchType && matchEmployee && matchStatut;
  });

  // ─── Stats ───
  const stats = {
    total: dossiers.length,
    contrats: dossiers.filter((d) => d.type === 'Contrat').length,
    cvs: dossiers.filter((d) => d.type === 'CV').length,
    actifs: dossiers.filter((d) => d.statut === 'actif').length,
  };

  // ─── Type config ───
  const getTypeConfig = (type) => {
    const configs = {
      Contrat: { bg: '#eff6ff', color: '#1976D2', icon: <Description sx={{ fontSize: 18, color: '#1976D2' }} /> },
      CV: { bg: '#f0fdf4', color: '#16a34a', icon: <Person sx={{ fontSize: 18, color: '#16a34a' }} /> },
      Diplôme: { bg: '#faf5ff', color: '#9333ea', icon: <Badge sx={{ fontSize: 18, color: '#9333ea' }} /> },
      Certificat: { bg: '#fff7ed', color: '#ea580c', icon: <WorkOutline sx={{ fontSize: 18, color: '#ea580c' }} /> },
    };
    return configs[type] || { bg: '#f1f5f9', color: '#64748b', icon: <InsertDriveFile sx={{ fontSize: 18, color: '#64748b' }} /> };
  };

  const getExpirationStatus = (dateExp) => {
    if (!dateExp) return null;
    const now = new Date();
    const exp = new Date(dateExp);
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'Expiré', className: 'hrd-card-expiration-expired' };
    if (diffDays <= 90) return { label: `Expire dans ${diffDays}j`, className: 'hrd-card-expiration-warning' };
    return { label: `Valide`, className: 'hrd-card-expiration-active' };
  };

  const getEmployeeData = (employeId) => {
    return mockEmployees.find((e) => e.id === employeId) || null;
  };

  // ─── Handlers ───
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (dossier) => {
    setForm({ ...dossier });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (dossier) => {
    setSelectedDossier(dossier);
    setOpenView(true);
  };

  const handleSave = () => {
    if (editMode) {
      setDossiers((prev) =>
        prev.map((d) => (d.id === form.id ? { ...form } : d))
      );
    } else {
      const selectedEmp = mockEmployees.find(
        (e) => e.id === Number(form.employeId)
      );
      const newDossier = {
        ...form,
        id: dossiers.length + 1,
        employeId: Number(form.employeId),
        employeName: selectedEmp ? selectedEmp.name : '',
      };
      setDossiers((prev) => [...prev, newDossier]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setDossiers((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="hrd-page">
      {/* ═══ Header ═══ */}
      <div className="hrd-header">
        <div>
          <h1 className="hrd-header-title">Dossiers RH</h1>
          <p className="hrd-header-subtitle">
            Contrats, CV, diplômes et documents administratifs
          </p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="hrd-add-btn">
            <Add fontSize="small" />
            Ajouter un dossier
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="hrd-stats-grid">
        <div className="hrd-stat-card">
          <div className="hrd-stat-row">
            <div>
              <p className="hrd-stat-label">Total</p>
              <p className="hrd-stat-value" style={{ color: '#1e293b' }}>
                {stats.total}
              </p>
            </div>
            <div className="hrd-stat-icon" style={{ background: '#eff6ff' }}>
              <FolderOpen sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>

        <div className="hrd-stat-card">
          <div className="hrd-stat-row">
            <div>
              <p className="hrd-stat-label">Contrats</p>
              <p className="hrd-stat-value" style={{ color: '#1976D2' }}>
                {stats.contrats}
              </p>
            </div>
            <div className="hrd-stat-icon" style={{ background: '#eff6ff' }}>
              <Description sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>

        <div className="hrd-stat-card">
          <div className="hrd-stat-row">
            <div>
              <p className="hrd-stat-label">CV</p>
              <p className="hrd-stat-value" style={{ color: '#16a34a' }}>
                {stats.cvs}
              </p>
            </div>
            <div className="hrd-stat-icon" style={{ background: '#f0fdf4' }}>
              <Person sx={{ fontSize: 22, color: '#16a34a' }} />
            </div>
          </div>
        </div>

        <div className="hrd-stat-card">
          <div className="hrd-stat-row">
            <div>
              <p className="hrd-stat-label">Actifs</p>
              <p className="hrd-stat-value" style={{ color: '#f59e0b' }}>
                {stats.actifs}
              </p>
            </div>
            <div className="hrd-stat-icon" style={{ background: '#fffbeb' }}>
              <CheckCircle sx={{ fontSize: 22, color: '#f59e0b' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="hrd-filters">
        <div className="hrd-filters-row">
          <div className="hrd-search-wrapper">
            <Search fontSize="small" className="hrd-search-icon" />
            <input
              type="text"
              placeholder="Rechercher titre, employé, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hrd-search-input"
            />
          </div>
          <div className="hrd-filter-selects">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="hrd-select"
            >
              <option value="tous">Tous types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="hrd-select"
            >
              <option value="tous">Tous employés</option>
              {employeeNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="hrd-select"
            >
              <option value="tous">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="archivé">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Grid ═══ */}
      {filtered.length > 0 ? (
        <div className="hrd-grid">
          {filtered.map((dossier) => {
            const typeConfig = getTypeConfig(dossier.type);
            const emp = getEmployeeData(dossier.employeId);
            const expStatus = getExpirationStatus(dossier.dateExpiration);

            return (
              <div key={dossier.id} className="hrd-card">
                <div className="hrd-card-body">
                  {/* Top */}
                  <div className="hrd-card-top">
                    <div className="hrd-card-left">
                      <div
                        className="hrd-doc-icon"
                        style={{ background: typeConfig.bg }}
                      >
                        {typeConfig.icon}
                      </div>
                      <div className="hrd-card-info">
                        <h3 className="hrd-card-title">{dossier.titre}</h3>
                        <span
                          className="hrd-card-type"
                          style={{
                            background: typeConfig.bg,
                            color: typeConfig.color,
                          }}
                        >
                          {dossier.type}
                        </span>
                      </div>
                    </div>
                    <div className="hrd-card-actions">
                      <button
                        onClick={() => handleView(dossier)}
                        className="hrd-action-btn hrd-action-view"
                        title="Voir"
                      >
                        <Visibility sx={{ fontSize: 15 }} />
                      </button>
                      {canManage && (
                        <>
                          <button
                            onClick={() => handleEdit(dossier)}
                            className="hrd-action-btn hrd-action-edit"
                            title="Modifier"
                          >
                            <Edit sx={{ fontSize: 15 }} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(dossier.id)}
                            className="hrd-action-btn hrd-action-delete"
                            title="Supprimer"
                          >
                            <Delete sx={{ fontSize: 15 }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Employee */}
                  <div className="hrd-card-employee">
                    <Avatar
                      src={emp?.photo}
                      sx={{ width: 28, height: 28 }}
                    />
                    <div>
                      <p className="hrd-card-employee-name">
                        {dossier.employeName}
                      </p>
                      <p className="hrd-card-employee-poste">
                        {emp?.poste || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="hrd-card-footer">
                    <span className="hrd-card-date">
                      <CalendarMonth sx={{ fontSize: 12 }} />
                      {dossier.dateDocument}
                    </span>
                    <span className="hrd-card-size">{dossier.taille}</span>
                    {expStatus ? (
                      <span
                        className={`hrd-card-expiration ${expStatus.className}`}
                      >
                        {expStatus.label}
                      </span>
                    ) : (
                      <span
                        className={`hrd-status-badge ${
                          dossier.statut === 'actif'
                            ? 'hrd-status-actif'
                            : 'hrd-status-archive'
                        }`}
                      >
                        {dossier.statut === 'actif' ? '● Actif' : '● Archivé'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="hrd-empty">
          <FolderOpen sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="hrd-empty-text">Aucun dossier trouvé</p>
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
          <span className="hrd-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? 'Modifier le dossier' : 'Ajouter un dossier'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="hrd-form-fields">
            <div>
              <label className="hrd-form-label">Employé</label>
              <select
                value={form.employeId}
                onChange={(e) => handleChange('employeId', e.target.value)}
                className="hrd-form-select"
              >
                <option value="">Sélectionner un employé</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.poste}
                  </option>
                ))}
              </select>
            </div>

            <div className="hrd-form-grid-2">
              <div>
                <label className="hrd-form-label">Type de document</label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="hrd-form-select"
                >
                  <option value="Contrat">Contrat</option>
                  <option value="CV">CV</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Certificat">Certificat</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="hrd-form-label">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="hrd-form-select"
                >
                  <option value="actif">Actif</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="hrd-form-label">Titre du document</label>
              <input
                type="text"
                value={form.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                placeholder="Ex: Contrat CDI - Directeur"
                className="hrd-form-input"
              />
            </div>

            <div className="hrd-form-grid-2">
              <div>
                <label className="hrd-form-label">Date du document</label>
                <input
                  type="date"
                  value={form.dateDocument}
                  onChange={(e) =>
                    handleChange('dateDocument', e.target.value)
                  }
                  className="hrd-form-input"
                />
              </div>
              <div>
                <label className="hrd-form-label">
                  Date d'expiration (optionnel)
                </label>
                <input
                  type="date"
                  value={form.dateExpiration || ''}
                  onChange={(e) =>
                    handleChange('dateExpiration', e.target.value || null)
                  }
                  className="hrd-form-input"
                />
              </div>
            </div>

            <div>
              <label className="hrd-form-label">Nom du fichier</label>
              <input
                type="text"
                value={form.fichier}
                onChange={(e) => handleChange('fichier', e.target.value)}
                placeholder="document.pdf"
                className="hrd-form-input"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button
            onClick={() => setOpenForm(false)}
            className="hrd-modal-btn hrd-modal-btn-cancel"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="hrd-modal-btn hrd-modal-btn-primary"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VOIR DOSSIER ═══ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedDossier && (() => {
          const typeConfig = getTypeConfig(selectedDossier.type);
          const emp = getEmployeeData(selectedDossier.employeId);
          const expStatus = getExpirationStatus(selectedDossier.dateExpiration);

          return (
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
                  className="hrd-header-title"
                  style={{ fontSize: '0.875rem' }}
                >
                  Détails du dossier
                </span>
                <IconButton
                  onClick={() => setOpenView(false)}
                  size="small"
                >
                  <Close fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <div className="hrd-view-content">
                  {/* Doc header */}
                  <div className="hrd-view-doc-header">
                    <div
                      className="hrd-view-doc-icon"
                      style={{ background: typeConfig.bg }}
                    >
                      <PictureAsPdf
                        sx={{ fontSize: 28, color: typeConfig.color }}
                      />
                    </div>
                    <div>
                      <h2 className="hrd-view-doc-title">
                        {selectedDossier.titre}
                      </h2>
                      <div className="hrd-view-doc-meta">
                        <span
                          className="hrd-card-type"
                          style={{
                            background: typeConfig.bg,
                            color: typeConfig.color,
                          }}
                        >
                          {selectedDossier.type}
                        </span>
                        <span>{selectedDossier.taille}</span>
                        <span
                          className={`hrd-status-badge ${
                            selectedDossier.statut === 'actif'
                              ? 'hrd-status-actif'
                              : 'hrd-status-archive'
                          }`}
                        >
                          {selectedDossier.statut === 'actif'
                            ? '● Actif'
                            : '● Archivé'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="hrd-view-fields">
                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#eff6ff' }}
                      >
                        <Person sx={{ fontSize: 16, color: '#1976D2' }} />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">Employé</p>
                        <p className="hrd-view-field-value">
                          {selectedDossier.employeName}
                        </p>
                      </div>
                    </div>

                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#f3e8ff' }}
                      >
                        <WorkOutline
                          sx={{ fontSize: 16, color: '#9c27b0' }}
                        />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">Poste</p>
                        <p className="hrd-view-field-value">
                          {emp?.poste || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#f0fdf4' }}
                      >
                        <CalendarMonth
                          sx={{ fontSize: 16, color: '#16a34a' }}
                        />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">
                          Date du document
                        </p>
                        <p className="hrd-view-field-value">
                          {selectedDossier.dateDocument}
                        </p>
                      </div>
                    </div>

                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#fff7ed' }}
                      >
                        <CalendarMonth
                          sx={{ fontSize: 16, color: '#ea580c' }}
                        />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">Expiration</p>
                        <p className="hrd-view-field-value">
                          {selectedDossier.dateExpiration || 'Aucune'}
                          {expStatus && (
                            <span
                              className={`hrd-card-expiration ${expStatus.className}`}
                              style={{ marginLeft: '0.5rem' }}
                            >
                              {expStatus.label}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#fef2f2' }}
                      >
                        <InsertDriveFile
                          sx={{ fontSize: 16, color: '#ef4444' }}
                        />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">Fichier</p>
                        <p className="hrd-view-field-value">
                          {selectedDossier.fichier}
                        </p>
                      </div>
                    </div>

                    <div className="hrd-view-field">
                      <div
                        className="hrd-view-field-icon"
                        style={{ background: '#f0fdfa' }}
                      >
                        <Archive
                          sx={{ fontSize: 16, color: '#0d9488' }}
                        />
                      </div>
                      <div>
                        <p className="hrd-view-field-label">Statut</p>
                        <p className="hrd-view-field-value">
                          {selectedDossier.statut === 'actif'
                            ? 'Actif'
                            : 'Archivé'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download */}
                  <button className="hrd-view-download-btn">
                    <Download sx={{ fontSize: 16 }} />
                    Télécharger le document
                  </button>
                </div>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* ═══ MODAL : SUPPRESSION ═══ */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="hrd-delete-modal">
          <div className="hrd-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="hrd-delete-title">Supprimer ce dossier ?</h3>
          <p className="hrd-delete-text">
            Le document sera définitivement supprimé.
          </p>
          <div className="hrd-delete-actions">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="hrd-modal-btn hrd-modal-btn-cancel"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="hrd-modal-btn hrd-modal-btn-danger"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HrDossiers;