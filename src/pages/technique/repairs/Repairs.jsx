import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  Build, DirectionsCar, Person, CalendarMonth,
  AttachMoney, CheckCircle, HourglassEmpty, Warning,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockRepairs, mockVehicles, mockTechnicians, mockClients } from '../../../data/mockData';
import '../../../styles/repairs.css';

const Repairs = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageRepairs');

  const [repairs, setRepairs] = useState(mockRepairs);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPriorite, setFilterPriorite] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    vehicleId: '', vehicleName: '', clientId: '', clientName: '',
    probleme: '', diagnostic: '', technicienId: '', technicienName: '',
    dateEntree: new Date().toISOString().split('T')[0],
    dateSortie: '', statut: 'en_cours', cout: '', pieces: '', priorite: 'normale',
  };
  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const stats = {
    total: repairs.length,
    enCours: repairs.filter((r) => r.statut === 'en_cours').length,
    terminees: repairs.filter((r) => r.statut === 'terminee').length,
    coutTotal: repairs.reduce((sum, r) => sum + r.cout, 0),
  };

  const getPriorityConfig = (p) => {
    const c = {
      haute: { label: 'Haute', className: 'rep-priority-haute', color: '#ea580c' },
      normale: { label: 'Normale', className: 'rep-priority-normale', color: '#2563eb' },
      basse: { label: 'Basse', className: 'rep-priority-basse', color: '#64748b' },
    };
    return c[p] || c.normale;
  };

  const filtered = repairs.filter((r) => {
    const matchSearch = `${r.vehicleName} ${r.probleme} ${r.technicienName} ${r.clientName}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || r.statut === filterStatut;
    const matchPriorite = filterPriorite === 'tous' || r.priorite === filterPriorite;
    return matchSearch && matchStatut && matchPriorite;
  });

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (rep) => {
    setForm({ ...rep, pieces: rep.pieces.join(', ') });
    setEditMode(true); setOpenForm(true);
  };
  const handleView = (rep) => { setSelectedRepair(rep); setOpenView(true); };

  const handleSave = () => {
    const vehicle = mockVehicles.find((v) => v.id === Number(form.vehicleId));
    const tech = mockTechnicians.find((t) => t.id === Number(form.technicienId));
    const client = mockClients.find((c) => c.id === Number(form.clientId));
    const piecesArray = form.pieces ? form.pieces.split(',').map((p) => p.trim()).filter(Boolean) : [];

    if (editMode) {
      setRepairs((prev) => prev.map((r) => r.id === form.id ? {
        ...form, cout: Number(form.cout), pieces: piecesArray,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : form.vehicleName,
        technicienName: tech?.name || form.technicienName,
        clientName: client?.name || form.clientName || 'Stock interne',
      } : r));
    } else {
      setRepairs((prev) => [...prev, {
        ...form, id: prev.length + 1,
        vehicleId: Number(form.vehicleId),
        technicienId: Number(form.technicienId),
        clientId: form.clientId ? Number(form.clientId) : null,
        cout: Number(form.cout), pieces: piecesArray,
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : '',
        technicienName: tech?.name || '',
        clientName: client?.name || 'Stock interne',
        dateSortie: form.statut === 'terminee' ? form.dateSortie || form.dateEntree : null,
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setRepairs((prev) => prev.filter((r) => r.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="rep-page">
      <div className="rep-header">
        <div>
          <h1 className="rep-header-title">Réparations</h1>
          <p className="rep-header-subtitle">Suivi des réparations en cours et terminées</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="rep-add-btn">
            <Add fontSize="small" /> Nouvelle réparation
          </button>
        )}
      </div>

      <div className="rep-stats-grid">
        <div className="rep-stat-card">
          <div className="rep-stat-row">
            <div><p className="rep-stat-label">Total</p><p className="rep-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div>
            <div className="rep-stat-icon" style={{ background: '#eff6ff' }}><Build sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
        <div className="rep-stat-card">
          <div className="rep-stat-row">
            <div><p className="rep-stat-label">En cours</p><p className="rep-stat-value" style={{ color: '#b45309' }}>{stats.enCours}</p></div>
            <div className="rep-stat-icon" style={{ background: '#fffbeb' }}><HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} /></div>
          </div>
        </div>
        <div className="rep-stat-card">
          <div className="rep-stat-row">
            <div><p className="rep-stat-label">Terminées</p><p className="rep-stat-value" style={{ color: '#16a34a' }}>{stats.terminees}</p></div>
            <div className="rep-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div>
          </div>
        </div>
        <div className="rep-stat-card">
          <div className="rep-stat-row">
            <div><p className="rep-stat-label">Coût total</p><p className="rep-stat-value" style={{ color: '#1976D2', fontSize: '1.125rem' }}>{formatPrice(stats.coutTotal)}</p></div>
            <div className="rep-stat-icon" style={{ background: '#eff6ff' }}><AttachMoney sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
      </div>

      <div className="rep-filters">
        <div className="rep-filters-row">
          <div className="rep-search-wrapper">
            <Search fontSize="small" className="rep-search-icon" />
            <input type="text" placeholder="Rechercher véhicule, problème, technicien..." value={search} onChange={(e) => setSearch(e.target.value)} className="rep-search-input" />
          </div>
          <div className="rep-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="rep-select">
              <option value="tous">Tous statuts</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
            </select>
            <select value={filterPriorite} onChange={(e) => setFilterPriorite(e.target.value)} className="rep-select">
              <option value="tous">Priorité</option>
              <option value="haute">Haute</option>
              <option value="normale">Normale</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="rep-grid">
          {filtered.map((rep) => {
            const prioConfig = getPriorityConfig(rep.priorite);
            return (
              <div key={rep.id} className="rep-card">
              
                <div className="rep-card-body">
                  <div className="rep-card-top">
                    <div className="rep-card-top-left">
                      <h3 className="rep-card-probleme">{rep.probleme}</h3>
                      <p className="rep-card-vehicle">{rep.vehicleName}</p>
                    </div>
                    <div className="rep-card-badges">
                      <span className={`rep-priority-badge ${prioConfig.className}`}>{prioConfig.label}</span>
                    </div>
                  </div>

                  <span className={`rep-status-badge ${rep.statut === 'terminee' ? 'rep-status-terminee' : 'rep-status-en_cours'}`}>
                    ● {rep.statut === 'terminee' ? 'Terminée' : 'En cours'}
                  </span>

                  <div className="rep-card-diagnostic">
                    <p className="rep-card-diagnostic-label">Diagnostic</p>
                    <p className="rep-card-diagnostic-text">{rep.diagnostic}</p>
                  </div>

                  <div className="rep-card-details">
                    <div className="rep-detail-row">
                      <Person sx={{ fontSize: 14 }} />
                      <span className="rep-detail-label">Technicien</span>
                      <span className="rep-detail-value">{rep.technicienName}</span>
                    </div>
                    <div className="rep-detail-row">
                      <CalendarMonth sx={{ fontSize: 14 }} />
                      <span className="rep-detail-label">Entrée</span>
                      <span className="rep-detail-value">{rep.dateEntree}</span>
                    </div>
                    {rep.dateSortie && (
                      <div className="rep-detail-row">
                        <CheckCircle sx={{ fontSize: 14 }} />
                        <span className="rep-detail-label">Sortie</span>
                        <span className="rep-detail-value">{rep.dateSortie}</span>
                      </div>
                    )}
                  </div>

                  {rep.pieces.length > 0 && (
                    <div className="rep-pieces-section">
                      <p className="rep-pieces-title">Pièces ({rep.pieces.length})</p>
                      <div className="rep-pieces-tags">
                        {rep.pieces.map((p, i) => (<span key={i} className="rep-piece-tag">{p}</span>))}
                      </div>
                    </div>
                  )}

                  <div className="rep-card-footer">
                    <p className="rep-card-cost">{formatPrice(rep.cout)}</p>
                    <span className="rep-card-client"><Person sx={{ fontSize: 12 }} />{rep.clientName}</span>
                    <div className="rep-card-actions">
                      <button onClick={() => handleView(rep)} className="rep-action-btn rep-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                      {canManage && (
                        <>
                          <button onClick={() => handleEdit(rep)} className="rep-action-btn rep-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                          <button onClick={() => setDeleteConfirm(rep.id)} className="rep-action-btn rep-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rep-empty">
          <Build sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="rep-empty-text">Aucune réparation trouvée</p>
        </div>
      )}

      {/* MODAL FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="rep-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier' : 'Nouvelle réparation'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="rep-form-fields">
            <div className="rep-form-grid-2">
              <div>
                <label className="rep-form-label">Véhicule</label>
                <select value={form.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)} className="rep-form-select">
                  <option value="">Sélectionner</option>
                  {mockVehicles.map((v) => (<option key={v.id} value={v.id}>{v.marque} {v.modele} {v.annee}</option>))}
                </select>
              </div>
              <div>
                <label className="rep-form-label">Client (optionnel)</label>
                <select value={form.clientId} onChange={(e) => handleChange('clientId', e.target.value)} className="rep-form-select">
                  <option value="">Stock interne</option>
                  {mockClients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="rep-form-label">Problème</label>
              <input type="text" value={form.probleme} onChange={(e) => handleChange('probleme', e.target.value)} placeholder="Décrivez le problème" className="rep-form-input" />
            </div>
            <div>
              <label className="rep-form-label">Diagnostic</label>
              <textarea value={form.diagnostic} onChange={(e) => handleChange('diagnostic', e.target.value)} placeholder="Diagnostic technique..." className="rep-form-textarea" />
            </div>
            <div className="rep-form-grid-2">
              <div>
                <label className="rep-form-label">Technicien</label>
                <select value={form.technicienId} onChange={(e) => handleChange('technicienId', e.target.value)} className="rep-form-select">
                  <option value="">Sélectionner</option>
                  {mockTechnicians.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                </select>
              </div>
              <div>
                <label className="rep-form-label">Priorité</label>
                <select value={form.priorite} onChange={(e) => handleChange('priorite', e.target.value)} className="rep-form-select">
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="basse">Basse</option>
                </select>
              </div>
            </div>
            <div className="rep-form-grid-2">
              <div>
                <label className="rep-form-label">Date entrée</label>
                <input type="date" value={form.dateEntree} onChange={(e) => handleChange('dateEntree', e.target.value)} className="rep-form-input" />
              </div>
              <div>
                <label className="rep-form-label">Date sortie</label>
                <input type="date" value={form.dateSortie || ''} onChange={(e) => handleChange('dateSortie', e.target.value)} className="rep-form-input" />
              </div>
            </div>
            <div className="rep-form-grid-2">
              <div>
                <label className="rep-form-label">Coût (CFA)</label>
                <input type="number" value={form.cout} onChange={(e) => handleChange('cout', e.target.value)} placeholder="85000" className="rep-form-input" />
              </div>
              <div>
                <label className="rep-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="rep-form-select">
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
            </div>
            <div>
              <label className="rep-form-label">Pièces (séparées par virgule)</label>
              <input type="text" value={form.pieces} onChange={(e) => handleChange('pieces', e.target.value)} placeholder="Compresseur clim, Gaz R134a" className="rep-form-input" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="rep-modal-btn rep-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="rep-modal-btn rep-modal-btn-primary">{editMode ? 'Modifier' : 'Créer'}</button>
        </DialogActions>
      </Dialog>

      {/* MODAL VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedRepair && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="rep-header-title" style={{ fontSize: '0.875rem' }}>Détails réparation</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="rep-view-content">
                <div className="rep-view-header">
                  <h2 className="rep-view-probleme">{selectedRepair.probleme}</h2>
                  <p className="rep-view-vehicle">{selectedRepair.vehicleName}</p>
                  <div className="rep-view-badges">
                    <span className={`rep-priority-badge ${getPriorityConfig(selectedRepair.priorite).className}`}>{getPriorityConfig(selectedRepair.priorite).label}</span>
                    <span className={`rep-status-badge ${selectedRepair.statut === 'terminee' ? 'rep-status-terminee' : 'rep-status-en_cours'}`}>● {selectedRepair.statut === 'terminee' ? 'Terminée' : 'En cours'}</span>
                  </div>
                </div>
                <div className="rep-view-diagnostic">
                  <p className="rep-view-diagnostic-title">Diagnostic</p>
                  <p className="rep-view-diagnostic-text">{selectedRepair.diagnostic}</p>
                </div>
                <div className="rep-view-fields">
                  <div className="rep-view-field">
                    <div className="rep-view-field-icon" style={{ background: '#eff6ff' }}><DirectionsCar sx={{ fontSize: 16, color: '#1976D2' }} /></div>
                    <div><p className="rep-view-field-label">Véhicule</p><p className="rep-view-field-value">{selectedRepair.vehicleName}</p></div>
                  </div>
                  <div className="rep-view-field">
                    <div className="rep-view-field-icon" style={{ background: '#f3e8ff' }}><Person sx={{ fontSize: 16, color: '#9c27b0' }} /></div>
                    <div><p className="rep-view-field-label">Technicien</p><p className="rep-view-field-value">{selectedRepair.technicienName}</p></div>
                  </div>
                  <div className="rep-view-field">
                    <div className="rep-view-field-icon" style={{ background: '#f0fdf4' }}><Person sx={{ fontSize: 16, color: '#16a34a' }} /></div>
                    <div><p className="rep-view-field-label">Client</p><p className="rep-view-field-value">{selectedRepair.clientName}</p></div>
                  </div>
                  <div className="rep-view-field">
                    <div className="rep-view-field-icon" style={{ background: '#fff7ed' }}><CalendarMonth sx={{ fontSize: 16, color: '#ea580c' }} /></div>
                    <div><p className="rep-view-field-label">Entrée</p><p className="rep-view-field-value">{selectedRepair.dateEntree}</p></div>
                  </div>
                </div>
                <div className="rep-view-cost-box">
                  <p className="rep-view-cost-value">{formatPrice(selectedRepair.cout)}</p>
                  <p className="rep-view-cost-label">Coût estimé</p>
                </div>
                {selectedRepair.pieces.length > 0 && (
                  <div className="rep-view-pieces">
                    <p className="rep-view-pieces-title">Pièces ({selectedRepair.pieces.length})</p>
                    <div className="rep-view-pieces-list">
                      {selectedRepair.pieces.map((p, i) => (<span key={i} className="rep-view-piece-tag">{p}</span>))}
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
        <div className="rep-delete-modal">
          <div className="rep-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="rep-delete-title">Supprimer cette réparation ?</h3>
          <p className="rep-delete-text">Cette action est irréversible.</p>
          <div className="rep-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="rep-modal-btn rep-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="rep-modal-btn rep-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Repairs;