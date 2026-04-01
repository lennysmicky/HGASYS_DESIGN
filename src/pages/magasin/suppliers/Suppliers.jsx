import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  LocalShipping, Phone, Email, LocationOn,
  Person, CalendarMonth, Receipt, CheckCircle,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockSuppliers } from '../../../data/mockData';
import '../../../styles/suppliers.css';

const Suppliers = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageSuppliers');

  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    nom: '', contact: '', telephone: '', email: '',
    adresse: '', specialite: '', status: 'actif',
    totalCommandes: 0, dernierCommande: '',
  };
  const [form, setForm] = useState(emptyForm);

  const stats = {
    total: suppliers.length,
    actifs: suppliers.filter((s) => s.status === 'actif').length,
    totalCommandes: suppliers.reduce((sum, s) => sum + s.totalCommandes, 0),
  };

  const filtered = suppliers.filter((s) =>
    `${s.nom} ${s.contact} ${s.specialite} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (sup) => { setForm({ ...sup }); setEditMode(true); setOpenForm(true); };
  const handleView = (sup) => { setSelectedSupplier(sup); setOpenView(true); };

  const handleSave = () => {
    if (editMode) {
      setSuppliers((prev) => prev.map((s) => s.id === form.id ? { ...form } : s));
    } else {
      setSuppliers((prev) => [...prev, {
        ...form, id: prev.length + 1,
        totalCommandes: 0, dernierCommande: '',
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setSuppliers((prev) => prev.filter((s) => s.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="sup-page">
      <div className="sup-header">
        <div>
          <h1 className="sup-header-title">Fournisseurs</h1>
          <p className="sup-header-subtitle">Gestion des contacts fournisseurs</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="sup-add-btn"><Add fontSize="small" /> Ajouter fournisseur</button>
        )}
      </div>

      <div className="sup-stats-grid">
        <div className="sup-stat-card"><div className="sup-stat-row"><div><p className="sup-stat-label">Total</p><p className="sup-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div><div className="sup-stat-icon" style={{ background: '#eff6ff' }}><LocalShipping sx={{ fontSize: 22, color: '#1976D2' }} /></div></div></div>
        <div className="sup-stat-card"><div className="sup-stat-row"><div><p className="sup-stat-label">Actifs</p><p className="sup-stat-value" style={{ color: '#16a34a' }}>{stats.actifs}</p></div><div className="sup-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div></div></div>
        <div className="sup-stat-card"><div className="sup-stat-row"><div><p className="sup-stat-label">Commandes</p><p className="sup-stat-value" style={{ color: '#1976D2' }}>{stats.totalCommandes}</p></div><div className="sup-stat-icon" style={{ background: '#eff6ff' }}><Receipt sx={{ fontSize: 22, color: '#1976D2' }} /></div></div></div>
      </div>

      <div className="ord-filters">
        <div className="ord-filters-row">
          <div className="ord-search-wrapper">
            <Search fontSize="small" className="ord-search-icon" />
            <input type="text" placeholder="Rechercher fournisseur, contact, spécialité..." value={search} onChange={(e) => setSearch(e.target.value)} className="ord-search-input" />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="sup-grid">
          {filtered.map((sup) => (
            <div key={sup.id} className="sup-card">
              <div className="sup-card-body">
                <div className="sup-card-top">
                  <div className="sup-card-top-left">
                    <h3 className="sup-card-name">{sup.nom}</h3>
                    <p className="sup-card-specialite">{sup.specialite}</p>
                  </div>
                  <div className="sup-card-actions">
                    <button onClick={() => handleView(sup)} className="sup-action-btn sup-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                    {canManage && (<>
                      <button onClick={() => handleEdit(sup)} className="sup-action-btn sup-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                      <button onClick={() => setDeleteConfirm(sup.id)} className="sup-action-btn sup-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                    </>)}
                  </div>
                </div>

                <span className={`sup-status-badge ${sup.status === 'actif' ? 'sup-status-actif' : 'sup-status-inactif'}`}>● {sup.status === 'actif' ? 'Actif' : 'Inactif'}</span>

                <div className="sup-card-contact">
                  <div className="sup-contact-row"><Person />{sup.contact}</div>
                  <div className="sup-contact-row"><Phone />{sup.telephone}</div>
                  <div className="sup-contact-row"><Email />{sup.email}</div>
                  <div className="sup-contact-row"><LocationOn />{sup.adresse}</div>
                </div>

                <div className="sup-card-stats">
                  <div className="sup-card-stat-item">
                    <p className="sup-card-stat-value" style={{ color: '#1976D2' }}>{sup.totalCommandes}</p>
                    <p className="sup-card-stat-label">Commandes</p>
                  </div>
                  <div className="sup-card-stat-item">
                    <p className="sup-card-stat-value" style={{ color: '#64748b', fontSize: '0.6875rem' }}>{sup.dernierCommande || '—'}</p>
                    <p className="sup-card-stat-label">Dernière cmd</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sup-empty"><LocalShipping sx={{ fontSize: 48, color: '#e0e0e0' }} /><p className="sup-empty-text">Aucun fournisseur trouvé</p></div>
      )}

      {/* FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sup-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier' : 'Ajouter fournisseur'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="sup-form-fields">
            <div><label className="sup-form-label">Nom entreprise</label><input type="text" value={form.nom} onChange={(e) => handleChange('nom', e.target.value)} placeholder="FilterPro Algérie" className="sup-form-input" /></div>
            <div className="sup-form-grid-2">
              <div><label className="sup-form-label">Contact</label><input type="text" value={form.contact} onChange={(e) => handleChange('contact', e.target.value)} placeholder="Nom du contact" className="sup-form-input" /></div>
              <div><label className="sup-form-label">Spécialité</label><input type="text" value={form.specialite} onChange={(e) => handleChange('specialite', e.target.value)} placeholder="Filtres et consommables" className="sup-form-input" /></div>
            </div>
            <div className="sup-form-grid-2">
              <div><label className="sup-form-label">Téléphone</label><input type="text" value={form.telephone} onChange={(e) => handleChange('telephone', e.target.value)} placeholder="021 45 67 89" className="sup-form-input" /></div>
              <div><label className="sup-form-label">Email</label><input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="contact@exemple.dz" className="sup-form-input" /></div>
            </div>
            <div><label className="sup-form-label">Adresse</label><input type="text" value={form.adresse} onChange={(e) => handleChange('adresse', e.target.value)} placeholder="Zone Industrielle, Alger" className="sup-form-input" /></div>
            <div><label className="sup-form-label">Statut</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="sup-form-select">
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="sup-modal-btn sup-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="sup-modal-btn sup-modal-btn-primary">{editMode ? 'Modifier' : 'Ajouter'}</button>
        </DialogActions>
      </Dialog>

      {/* VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedSupplier && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="sup-header-title" style={{ fontSize: '0.875rem' }}>Détails fournisseur</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="sup-view-content">
                <div className="sup-view-header">
                  <h2 className="sup-view-name">{selectedSupplier.nom}</h2>
                  <p className="sup-view-specialite">{selectedSupplier.specialite}</p>
                  <div className="sup-view-badges">
                    <span className={`sup-status-badge ${selectedSupplier.status === 'actif' ? 'sup-status-actif' : 'sup-status-inactif'}`}>● {selectedSupplier.status === 'actif' ? 'Actif' : 'Inactif'}</span>
                  </div>
                </div>
                <div className="sup-view-fields">
                  <div className="sup-view-field"><div className="sup-view-field-icon" style={{ background: '#eff6ff' }}><Person sx={{ fontSize: 16, color: '#1976D2' }} /></div><div><p className="sup-view-field-label">Contact</p><p className="sup-view-field-value">{selectedSupplier.contact}</p></div></div>
                  <div className="sup-view-field"><div className="sup-view-field-icon" style={{ background: '#f0fdf4' }}><Phone sx={{ fontSize: 16, color: '#16a34a' }} /></div><div><p className="sup-view-field-label">Téléphone</p><p className="sup-view-field-value">{selectedSupplier.telephone}</p></div></div>
                  <div className="sup-view-field"><div className="sup-view-field-icon" style={{ background: '#fff7ed' }}><Email sx={{ fontSize: 16, color: '#ea580c' }} /></div><div><p className="sup-view-field-label">Email</p><p className="sup-view-field-value">{selectedSupplier.email}</p></div></div>
                  <div className="sup-view-field"><div className="sup-view-field-icon" style={{ background: '#fef2f2' }}><LocationOn sx={{ fontSize: 16, color: '#ef4444' }} /></div><div><p className="sup-view-field-label">Adresse</p><p className="sup-view-field-value">{selectedSupplier.adresse}</p></div></div>
                </div>
                <div className="sup-view-stats-box">
                  <div className="sup-view-stat-item"><p className="sup-view-stat-value" style={{ color: '#1976D2' }}>{selectedSupplier.totalCommandes}</p><p className="sup-view-stat-label">Total commandes</p></div>
                  <div className="sup-view-stat-item"><p className="sup-view-stat-value" style={{ color: '#64748b', fontSize: '0.75rem' }}>{selectedSupplier.dernierCommande || '—'}</p><p className="sup-view-stat-label">Dernière commande</p></div>
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* DELETE */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="sup-delete-modal">
          <div className="sup-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="sup-delete-title">Supprimer ce fournisseur ?</h3>
          <p className="sup-delete-text">Cette action est irréversible.</p>
          <div className="sup-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="sup-modal-btn sup-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="sup-modal-btn sup-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Suppliers;