import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  Engineering, DirectionsCar, Person, CalendarMonth,
  Timer, CheckCircle, HourglassEmpty, Build, BugReport,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockInterventions, mockVehicles, mockTechnicians } from '../../../data/mockData';
import '../../../styles/interventions.css';

const Interventions = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageInterventions');

  const [interventions, setInterventions] = useState(mockInterventions);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedInt, setSelectedInt] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    type: 'Réparation', vehicleId: '', vehicleName: '',
    technicienId: '', technicienName: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '', dureeEstimee: '', dureeReelle: '',
    statut: 'en_cours', description: '',
  };
  const [form, setForm] = useState(emptyForm);

  const stats = {
    total: interventions.length,
    enCours: interventions.filter((i) => i.statut === 'en_cours').length,
    terminees: interventions.filter((i) => i.statut === 'terminee').length,
    types: {
      reparation: interventions.filter((i) => i.type === 'Réparation').length,
      revision: interventions.filter((i) => i.type === 'Révision').length,
      diagnostic: interventions.filter((i) => i.type === 'Diagnostic').length,
    },
  };

  const getTypeConfig = (type) => {
    const c = {
      'Réparation': { className: 'int-type-reparation', icon: <Build sx={{ fontSize: 10 }} /> },
      'Révision': { className: 'int-type-revision', icon: <Engineering sx={{ fontSize: 10 }} /> },
      'Diagnostic': { className: 'int-type-diagnostic', icon: <BugReport sx={{ fontSize: 10 }} /> },
    };
    return c[type] || c['Réparation'];
  };

  const filtered = interventions.filter((i) => {
    const matchSearch = `${i.vehicleName} ${i.technicienName} ${i.description} ${i.type}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || i.statut === filterStatut;
    const matchType = filterType === 'tous' || i.type === filterType;
    return matchSearch && matchStatut && matchType;
  });

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (int) => { setForm({ ...int }); setEditMode(true); setOpenForm(true); };
  const handleView = (int) => { setSelectedInt(int); setOpenView(true); };

  const handleSave = () => {
    const vehicle = mockVehicles.find((v) => v.id === Number(form.vehicleId));
    const tech = mockTechnicians.find((t) => t.id === Number(form.technicienId));

    if (editMode) {
      setInterventions((prev) => prev.map((i) => i.id === form.id ? {
        ...form,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : form.vehicleName,
        technicienName: tech?.name || form.technicienName,
      } : i));
    } else {
      setInterventions((prev) => [...prev, {
        ...form, id: prev.length + 1,
        vehicleId: Number(form.vehicleId),
        technicienId: Number(form.technicienId),
        referenceId: null,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : '',
        technicienName: tech?.name || '',
        dateFin: form.statut === 'terminee' ? form.dateFin || form.dateDebut : null,
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setInterventions((prev) => prev.filter((i) => i.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="int-page">
      <div className="int-header">
        <div>
          <h1 className="int-header-title">Interventions</h1>
          <p className="int-header-subtitle">Affectation et suivi des interventions techniques</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="int-add-btn">
            <Add fontSize="small" /> Nouvelle intervention
          </button>
        )}
      </div>

      <div className="int-stats-grid">
        <div className="int-stat-card">
          <div className="int-stat-row">
            <div><p className="int-stat-label">Total</p><p className="int-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div>
            <div className="int-stat-icon" style={{ background: '#eff6ff' }}><Engineering sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
        <div className="int-stat-card">
          <div className="int-stat-row">
            <div><p className="int-stat-label">En cours</p><p className="int-stat-value" style={{ color: '#b45309' }}>{stats.enCours}</p></div>
            <div className="int-stat-icon" style={{ background: '#fffbeb' }}><HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} /></div>
          </div>
        </div>
        <div className="int-stat-card">
          <div className="int-stat-row">
            <div><p className="int-stat-label">Terminées</p><p className="int-stat-value" style={{ color: '#16a34a' }}>{stats.terminees}</p></div>
            <div className="int-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div>
          </div>
        </div>
        <div className="int-stat-card">
          <div className="int-stat-row">
            <div><p className="int-stat-label">Réparations</p><p className="int-stat-value" style={{ color: '#ea580c' }}>{stats.types.reparation}</p></div>
            <div className="int-stat-icon" style={{ background: '#ffedd5' }}><Build sx={{ fontSize: 22, color: '#ea580c' }} /></div>
          </div>
        </div>
      </div>

      <div className="int-filters">
        <div className="int-filters-row">
          <div className="int-search-wrapper">
            <Search fontSize="small" className="int-search-icon" />
            <input type="text" placeholder="Rechercher véhicule, technicien, description..." value={search} onChange={(e) => setSearch(e.target.value)} className="int-search-input" />
          </div>
          <div className="int-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="int-select">
              <option value="tous">Tous statuts</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="int-select">
              <option value="tous">Tous types</option>
              <option value="Réparation">Réparation</option>
              <option value="Révision">Révision</option>
              <option value="Diagnostic">Diagnostic</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="int-table-wrapper">
          <table className="int-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Véhicule</th>
                <th>Technicien</th>
                <th>Description</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((int) => {
                const typeConfig = getTypeConfig(int.type);
                return (
                  <tr key={int.id}>
                    <td data-label="Type">
                      <span className={`int-type-badge ${typeConfig.className}`}>{typeConfig.icon} {int.type}</span>
                    </td>
                    <td data-label="Véhicule"><span className="int-vehicle-name">{int.vehicleName}</span></td>
                    <td data-label="Technicien"><span className="int-tech-name">{int.technicienName}</span></td>
                    <td data-label="Description"><span className="int-desc">{int.description}</span></td>
                    <td data-label="Début"><span className="int-date">{int.dateDebut}</span></td>
                    <td data-label="Fin"><span className="int-date">{int.dateFin || '—'}</span></td>
                    <td data-label="Durée">
                      <span className="int-duree">{int.dureeEstimee}
                        {int.dureeReelle && <span className="int-duree-sub"> → {int.dureeReelle}</span>}
                      </span>
                    </td>
                    <td data-label="Statut">
                      <span className={`int-status-badge ${int.statut === 'terminee' ? 'int-status-terminee' : 'int-status-en_cours'}`}>
                        ● {int.statut === 'terminee' ? 'Terminée' : 'En cours'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="int-actions">
                        <button onClick={() => handleView(int)} className="int-action-btn int-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                        {canManage && (
                          <>
                            <button onClick={() => handleEdit(int)} className="int-action-btn int-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                            <button onClick={() => setDeleteConfirm(int.id)} className="int-action-btn int-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="int-empty">
          <Engineering sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="int-empty-text">Aucune intervention trouvée</p>
        </div>
      )}

      {/* MODAL FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="int-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier' : 'Nouvelle intervention'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="int-form-fields">
            <div className="int-form-grid-2">
              <div>
                <label className="int-form-label">Type</label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="int-form-select">
                  <option value="Réparation">Réparation</option>
                  <option value="Révision">Révision</option>
                  <option value="Diagnostic">Diagnostic</option>
                </select>
              </div>
              <div>
                <label className="int-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="int-form-select">
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
            </div>
            <div className="int-form-grid-2">
              <div>
                <label className="int-form-label">Véhicule</label>
                <select value={form.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)} className="int-form-select">
                  <option value="">Sélectionner</option>
                  {mockVehicles.map((v) => (<option key={v.id} value={v.id}>{v.marque} {v.modele} {v.annee}</option>))}
                </select>
              </div>
              <div>
                <label className="int-form-label">Technicien</label>
                <select value={form.technicienId} onChange={(e) => handleChange('technicienId', e.target.value)} className="int-form-select">
                  <option value="">Sélectionner</option>
                  {mockTechnicians.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                </select>
              </div>
            </div>
            <div className="int-form-grid-2">
              <div>
                <label className="int-form-label">Date début</label>
                <input type="date" value={form.dateDebut} onChange={(e) => handleChange('dateDebut', e.target.value)} className="int-form-input" />
              </div>
              <div>
                <label className="int-form-label">Date fin</label>
                <input type="date" value={form.dateFin || ''} onChange={(e) => handleChange('dateFin', e.target.value)} className="int-form-input" />
              </div>
            </div>
            <div className="int-form-grid-2">
              <div>
                <label className="int-form-label">Durée estimée</label>
                <input type="text" value={form.dureeEstimee} onChange={(e) => handleChange('dureeEstimee', e.target.value)} placeholder="4h" className="int-form-input" />
              </div>
              <div>
                <label className="int-form-label">Durée réelle</label>
                <input type="text" value={form.dureeReelle || ''} onChange={(e) => handleChange('dureeReelle', e.target.value)} placeholder="3h30" className="int-form-input" />
              </div>
            </div>
            <div>
              <label className="int-form-label">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Détails de l'intervention..." className="int-form-textarea" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="int-modal-btn int-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="int-modal-btn int-modal-btn-primary">{editMode ? 'Modifier' : 'Créer'}</button>
        </DialogActions>
      </Dialog>

      {/* MODAL VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedInt && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="int-header-title" style={{ fontSize: '0.875rem' }}>Détails intervention</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="int-view-content">
                <div className="int-view-header">
                  <h2 className="int-view-desc-title">{selectedInt.description}</h2>
                  <p className="int-view-vehicle">{selectedInt.vehicleName}</p>
                  <div className="int-view-badges">
                    <span className={`int-type-badge ${getTypeConfig(selectedInt.type).className}`}>{getTypeConfig(selectedInt.type).icon} {selectedInt.type}</span>
                    <span className={`int-status-badge ${selectedInt.statut === 'terminee' ? 'int-status-terminee' : 'int-status-en_cours'}`}>● {selectedInt.statut === 'terminee' ? 'Terminée' : 'En cours'}</span>
                  </div>
                </div>
                <div className="int-view-fields">
                  <div className="int-view-field">
                    <div className="int-view-field-icon" style={{ background: '#eff6ff' }}><DirectionsCar sx={{ fontSize: 16, color: '#1976D2' }} /></div>
                    <div><p className="int-view-field-label">Véhicule</p><p className="int-view-field-value">{selectedInt.vehicleName}</p></div>
                  </div>
                  <div className="int-view-field">
                    <div className="int-view-field-icon" style={{ background: '#f3e8ff' }}><Person sx={{ fontSize: 16, color: '#9c27b0' }} /></div>
                    <div><p className="int-view-field-label">Technicien</p><p className="int-view-field-value">{selectedInt.technicienName}</p></div>
                  </div>
                  <div className="int-view-field">
                    <div className="int-view-field-icon" style={{ background: '#dbeafe' }}><CalendarMonth sx={{ fontSize: 16, color: '#2563eb' }} /></div>
                    <div><p className="int-view-field-label">Début</p><p className="int-view-field-value">{selectedInt.dateDebut}</p></div>
                  </div>
                  <div className="int-view-field">
                    <div className="int-view-field-icon" style={{ background: '#f0fdf4' }}><CalendarMonth sx={{ fontSize: 16, color: '#16a34a' }} /></div>
                    <div><p className="int-view-field-label">Fin</p><p className="int-view-field-value">{selectedInt.dateFin || 'En cours'}</p></div>
                  </div>
                </div>
                <div className="int-view-duree-box">
                  <div className="int-view-duree-item">
                    <p className="int-view-duree-value" style={{ color: '#1976D2' }}>{selectedInt.dureeEstimee}</p>
                    <p className="int-view-duree-label">Durée estimée</p>
                  </div>
                  <div className="int-view-duree-item">
                    <p className="int-view-duree-value" style={{ color: selectedInt.dureeReelle ? '#16a34a' : '#94a3b8' }}>{selectedInt.dureeReelle || '—'}</p>
                    <p className="int-view-duree-label">Durée réelle</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* MODAL DELETE */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="int-delete-modal">
          <div className="int-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="int-delete-title">Supprimer cette intervention ?</h3>
          <p className="int-delete-text">Cette action est irréversible.</p>
          <div className="int-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="int-modal-btn int-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="int-modal-btn int-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Interventions;