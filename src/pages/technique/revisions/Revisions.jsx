import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  CarRepair, DirectionsCar, Person, CalendarMonth,
  AttachMoney, Build, Schedule, CheckCircle, HourglassEmpty,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockRevisions, mockVehicles, mockTechnicians } from '../../../data/mockData';
import '../../../styles/revisions.css';

const Revisions = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageRevisions');

  const [revisions, setRevisions] = useState(mockRevisions);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    vehicleId: '', vehicleName: '', type: '',
    technicienId: '', technicienName: '',
    datePlanifiee: new Date().toISOString().split('T')[0],
    dateRealisee: '', statut: 'planifiee', cout: '',
    description: '', pieces: '',
  };
  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const stats = {
    total: revisions.length,
    planifiees: revisions.filter((r) => r.statut === 'planifiee').length,
    realisees: revisions.filter((r) => r.statut === 'realisee').length,
    coutTotal: revisions.reduce((sum, r) => sum + r.cout, 0),
  };

  const filtered = revisions.filter((r) => {
    const matchSearch = `${r.vehicleName} ${r.type} ${r.technicienName}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || r.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (rev) => {
    setForm({ ...rev, pieces: rev.pieces.join(', ') });
    setEditMode(true); setOpenForm(true);
  };
  const handleView = (rev) => { setSelectedRevision(rev); setOpenView(true); };

  const handleSave = () => {
    const vehicle = mockVehicles.find((v) => v.id === Number(form.vehicleId));
    const tech = mockTechnicians.find((t) => t.id === Number(form.technicienId));
    const piecesArray = form.pieces ? form.pieces.split(',').map((p) => p.trim()).filter(Boolean) : [];

    if (editMode) {
      setRevisions((prev) => prev.map((r) => r.id === form.id ? {
        ...form, cout: Number(form.cout), pieces: piecesArray,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : form.vehicleName,
        technicienName: tech?.name || form.technicienName,
      } : r));
    } else {
      setRevisions((prev) => [...prev, {
        ...form, id: prev.length + 1,
        vehicleId: Number(form.vehicleId),
        technicienId: Number(form.technicienId),
        cout: Number(form.cout), pieces: piecesArray,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : '',
        technicienName: tech?.name || '',
        dateRealisee: form.statut === 'realisee' ? form.dateRealisee || form.datePlanifiee : null,
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setRevisions((prev) => prev.filter((r) => r.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="rev-page">
      <div className="rev-header">
        <div>
          <h1 className="rev-header-title">Révisions</h1>
          <p className="rev-header-subtitle">Planification et suivi des révisions véhicules</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="rev-add-btn">
            <Add fontSize="small" /> Planifier une révision
          </button>
        )}
      </div>

      <div className="rev-stats-grid">
        <div className="rev-stat-card">
          <div className="rev-stat-row">
            <div>
              <p className="rev-stat-label">Total</p>
              <p className="rev-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p>
            </div>
            <div className="rev-stat-icon" style={{ background: '#eff6ff' }}>
              <CarRepair sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="rev-stat-card">
          <div className="rev-stat-row">
            <div>
              <p className="rev-stat-label">Planifiées</p>
              <p className="rev-stat-value" style={{ color: '#2563eb' }}>{stats.planifiees}</p>
            </div>
            <div className="rev-stat-icon" style={{ background: '#dbeafe' }}>
              <Schedule sx={{ fontSize: 22, color: '#2563eb' }} />
            </div>
          </div>
        </div>
        <div className="rev-stat-card">
          <div className="rev-stat-row">
            <div>
              <p className="rev-stat-label">Réalisées</p>
              <p className="rev-stat-value" style={{ color: '#16a34a' }}>{stats.realisees}</p>
            </div>
            <div className="rev-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} />
            </div>
          </div>
        </div>
        <div className="rev-stat-card">
          <div className="rev-stat-row">
            <div>
              <p className="rev-stat-label">Coût total</p>
              <p className="rev-stat-value" style={{ color: '#1976D2', fontSize: '1.125rem' }}>{formatPrice(stats.coutTotal)}</p>
            </div>
            <div className="rev-stat-icon" style={{ background: '#eff6ff' }}>
              <AttachMoney sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rev-filters">
        <div className="rev-filters-row">
          <div className="rev-search-wrapper">
            <Search fontSize="small" className="rev-search-icon" />
            <input type="text" placeholder="Rechercher véhicule, type, technicien..." value={search} onChange={(e) => setSearch(e.target.value)} className="rev-search-input" />
          </div>
          <div className="rev-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="rev-select">
              <option value="tous">Tous statuts</option>
              <option value="planifiee">Planifiée</option>
              <option value="realisee">Réalisée</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="rev-grid">
          {filtered.map((rev) => (
            <div key={rev.id} className="rev-card">
              
              <div className="rev-card-body">
                <div className="rev-card-top">
                  <div className="rev-card-top-left">
                    <h3 className="rev-card-type">{rev.type}</h3>
                    <p className="rev-card-vehicle">{rev.vehicleName}</p>
                  </div>
                  <div className="rev-card-actions">
                    <button onClick={() => handleView(rev)} className="rev-action-btn rev-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                    {canManage && (
                      <>
                        <button onClick={() => handleEdit(rev)} className="rev-action-btn rev-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                        <button onClick={() => setDeleteConfirm(rev.id)} className="rev-action-btn rev-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                      </>
                    )}
                  </div>
                </div>

                <span className={`rev-status-badge ${rev.statut === 'realisee' ? 'rev-status-realisee' : 'rev-status-planifiee'}`}>
                  ● {rev.statut === 'realisee' ? 'Réalisée' : 'Planifiée'}
                </span>

                <div className="rev-card-details">
                  <div className="rev-detail-row">
                    <Person sx={{ fontSize: 14 }} />
                    <span className="rev-detail-label">Technicien</span>
                    <span className="rev-detail-value">{rev.technicienName}</span>
                  </div>
                  <div className="rev-detail-row">
                    <CalendarMonth sx={{ fontSize: 14 }} />
                    <span className="rev-detail-label">Planifiée</span>
                    <span className="rev-detail-value">{rev.datePlanifiee}</span>
                  </div>
                  {rev.dateRealisee && (
                    <div className="rev-detail-row">
                      <CheckCircle sx={{ fontSize: 14 }} />
                      <span className="rev-detail-label">Réalisée</span>
                      <span className="rev-detail-value">{rev.dateRealisee}</span>
                    </div>
                  )}
                </div>

                {rev.pieces.length > 0 && (
                  <div className="rev-pieces-section">
                    <p className="rev-pieces-title">Pièces ({rev.pieces.length})</p>
                    <div className="rev-pieces-tags">
                      {rev.pieces.map((p, i) => (
                        <span key={i} className="rev-piece-tag">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rev-card-footer">
                  <p className="rev-card-cost">{formatPrice(rev.cout)}<span className="rev-card-cost-suffix"> estimé</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rev-empty">
          <CarRepair sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="rev-empty-text">Aucune révision trouvée</p>
        </div>
      )}

      {/* MODAL FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="rev-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier la révision' : 'Planifier une révision'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="rev-form-fields">
            <div className="rev-form-grid-2">
              <div>
                <label className="rev-form-label">Véhicule</label>
                <select value={form.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)} className="rev-form-select">
                  <option value="">Sélectionner</option>
                  {mockVehicles.map((v) => (<option key={v.id} value={v.id}>{v.marque} {v.modele} {v.annee}</option>))}
                </select>
              </div>
              <div>
                <label className="rev-form-label">Technicien</label>
                <select value={form.technicienId} onChange={(e) => handleChange('technicienId', e.target.value)} className="rev-form-select">
                  <option value="">Sélectionner</option>
                  {mockTechnicians.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="rev-form-label">Type de révision</label>
              <input type="text" value={form.type} onChange={(e) => handleChange('type', e.target.value)} placeholder="Révision 15 000 km" className="rev-form-input" />
            </div>
            <div className="rev-form-grid-2">
              <div>
                <label className="rev-form-label">Date planifiée</label>
                <input type="date" value={form.datePlanifiee} onChange={(e) => handleChange('datePlanifiee', e.target.value)} className="rev-form-input" />
              </div>
              <div>
                <label className="rev-form-label">Date réalisée</label>
                <input type="date" value={form.dateRealisee || ''} onChange={(e) => handleChange('dateRealisee', e.target.value)} className="rev-form-input" />
              </div>
            </div>
            <div className="rev-form-grid-2">
              <div>
                <label className="rev-form-label">Coût estimé (CFA)</label>
                <input type="number" value={form.cout} onChange={(e) => handleChange('cout', e.target.value)} placeholder="25000" className="rev-form-input" />
              </div>
              <div>
                <label className="rev-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="rev-form-select">
                  <option value="planifiee">Planifiée</option>
                  <option value="realisee">Réalisée</option>
                </select>
              </div>
            </div>
            <div>
              <label className="rev-form-label">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Détails de la révision..." className="rev-form-textarea" />
            </div>
            <div>
              <label className="rev-form-label">Pièces (séparées par virgule)</label>
              <input type="text" value={form.pieces} onChange={(e) => handleChange('pieces', e.target.value)} placeholder="Filtre à huile, Filtre à air, Huile 5W30" className="rev-form-input" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="rev-modal-btn rev-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="rev-modal-btn rev-modal-btn-primary">{editMode ? 'Modifier' : 'Planifier'}</button>
        </DialogActions>
      </Dialog>

      {/* MODAL VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedRevision && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="rev-header-title" style={{ fontSize: '0.875rem' }}>Détails de la révision</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="rev-view-content">
                <div className="rev-view-header">
                  <div>
                    <h2 className="rev-view-type">{selectedRevision.type}</h2>
                    <p className="rev-view-vehicle">{selectedRevision.vehicleName}</p>
                    <span className={`rev-status-badge ${selectedRevision.statut === 'realisee' ? 'rev-status-realisee' : 'rev-status-planifiee'}`} style={{ marginTop: '0.375rem', display: 'inline-flex' }}>
                      ● {selectedRevision.statut === 'realisee' ? 'Réalisée' : 'Planifiée'}
                    </span>
                  </div>
                  <div className="rev-view-cost-box">
                    <p className="rev-view-cost-value">{formatPrice(selectedRevision.cout)}</p>
                    <p className="rev-view-cost-label">Coût estimé</p>
                  </div>
                </div>
                <div className="rev-view-fields">
                  <div className="rev-view-field">
                    <div className="rev-view-field-icon" style={{ background: '#eff6ff' }}><DirectionsCar sx={{ fontSize: 16, color: '#1976D2' }} /></div>
                    <div><p className="rev-view-field-label">Véhicule</p><p className="rev-view-field-value">{selectedRevision.vehicleName}</p></div>
                  </div>
                  <div className="rev-view-field">
                    <div className="rev-view-field-icon" style={{ background: '#f3e8ff' }}><Person sx={{ fontSize: 16, color: '#9c27b0' }} /></div>
                    <div><p className="rev-view-field-label">Technicien</p><p className="rev-view-field-value">{selectedRevision.technicienName}</p></div>
                  </div>
                  <div className="rev-view-field">
                    <div className="rev-view-field-icon" style={{ background: '#dbeafe' }}><CalendarMonth sx={{ fontSize: 16, color: '#2563eb' }} /></div>
                    <div><p className="rev-view-field-label">Date planifiée</p><p className="rev-view-field-value">{selectedRevision.datePlanifiee}</p></div>
                  </div>
                  <div className="rev-view-field">
                    <div className="rev-view-field-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /></div>
                    <div><p className="rev-view-field-label">Date réalisée</p><p className="rev-view-field-value">{selectedRevision.dateRealisee || 'Non réalisée'}</p></div>
                  </div>
                </div>
                {selectedRevision.description && <p className="rev-view-desc">{selectedRevision.description}</p>}
                {selectedRevision.pieces.length > 0 && (
                  <div className="rev-view-pieces">
                    <p className="rev-view-pieces-title">Pièces utilisées ({selectedRevision.pieces.length})</p>
                    <div className="rev-view-pieces-list">
                      {selectedRevision.pieces.map((p, i) => (<span key={i} className="rev-view-piece-tag">{p}</span>))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* MODAL DELETE */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="rev-delete-modal">
          <div className="rev-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="rev-delete-title">Supprimer cette révision ?</h3>
          <p className="rev-delete-text">Cette action est irréversible.</p>
          <div className="rev-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="rev-modal-btn rev-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="rev-modal-btn rev-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Revisions;