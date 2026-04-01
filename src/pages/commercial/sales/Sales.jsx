// src/pages/sales/Sales.jsx
import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Close, Visibility,
  ShoppingCart, CheckCircle, HourglassEmpty, AttachMoney,
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockSales, mockClients, mockVehicles } from '../../../data/mockData';
import '../../../styles/sales.css';

const Sales = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageSales');

  const [sales, setSales] = useState(mockSales);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    clientId: '', clientName: '', vehicleId: '', vehicleName: '',
    vendeurId: user?.id || '', vendeurName: user?.name || '',
    montant: '', date: new Date().toISOString().split('T')[0],
    statut: 'en_cours',
    paiement: { methode: 'Virement', statut: 'en attente', montantPaye: 0, reste: 0 },
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const filtered = sales.filter((s) => {
    const matchSearch = `${s.vehicleName} ${s.clientName} ${s.vendeurName}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || s.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const stats = {
    total: sales.length,
    completees: sales.filter((s) => s.statut === 'completee').length,
    enCours: sales.filter((s) => s.statut === 'en_cours').length,
    revenus: sales.reduce((sum, s) => sum + s.montant, 0),
  };

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (s) => { setForm({ ...s }); setEditMode(true); setOpenForm(true); };
  const handleView = (s) => { setSelectedSale(s); setOpenView(true); };

  const handleSave = () => {
    const montant = Number(form.montant);
    const montantPaye = Number(form.paiement.montantPaye);
    const saleData = {
      ...form, montant,
      paiement: {
        ...form.paiement, montantPaye,
        reste: montant - montantPaye,
        statut: montantPaye >= montant ? 'payé' : 'en attente',
      },
      statut: montantPaye >= montant ? 'completee' : 'en_cours',
    };
    if (editMode) {
      setSales((prev) => prev.map((s) => (s.id === form.id ? saleData : s)));
    } else {
      setSales((prev) => [...prev, { ...saleData, id: prev.length + 1 }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setSales((prev) => prev.filter((s) => s.id !== id)); setDeleteConfirm(null); };

  const handleChange = (field, value) => {
    if (field.startsWith('paiement.')) {
      const key = field.split('.')[1];
      setForm((prev) => ({ ...prev, paiement: { ...prev.paiement, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleClientSelect = (clientId) => {
    const client = mockClients.find((c) => c.id === Number(clientId));
    setForm((prev) => ({ ...prev, clientId: Number(clientId), clientName: client?.name || '' }));
  };

  const handleVehicleSelect = (vehicleId) => {
    const vehicle = mockVehicles.find((v) => v.id === Number(vehicleId));
    setForm((prev) => ({
      ...prev, vehicleId: Number(vehicleId),
      vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : '',
      montant: vehicle?.prix || prev.montant,
    }));
  };

  return (
    <div className="sales-page">
      {/* ═══ Header ═══ */}
      <div className="sal-header">
        <div>
          <h1 className="sal-header-title">Gestion des Ventes</h1>
          <p className="sal-header-subtitle">Suivi des transactions</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="sal-add-btn">
            <Add fontSize="small" /> Nouvelle vente
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="sal-stats-grid">
        <div className="sal-stat-card">
          <div className="sal-stat-row">
            <div>
              <p className="sal-stat-label">Total ventes</p>
              <p className="sal-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p>
            </div>
            <div className="sal-stat-icon" style={{ background: '#eff6ff' }}>
              <ShoppingCart sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="sal-stat-card">
          <div className="sal-stat-row">
            <div>
              <p className="sal-stat-label">Complétées</p>
              <p className="sal-stat-value" style={{ color: '#16a34a' }}>{stats.completees}</p>
            </div>
            <div className="sal-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
            </div>
          </div>
        </div>
        <div className="sal-stat-card">
          <div className="sal-stat-row">
            <div>
              <p className="sal-stat-label">En cours</p>
              <p className="sal-stat-value" style={{ color: '#f97316' }}>{stats.enCours}</p>
            </div>
            <div className="sal-stat-icon" style={{ background: '#fff7ed' }}>
              <HourglassEmpty sx={{ fontSize: 18, color: '#f97316' }} />
            </div>
          </div>
        </div>
        <div className="sal-stat-card">
          <div className="sal-stat-row">
            <div>
              <p className="sal-stat-label">Revenus</p>
              <p className="sal-stat-value" style={{ color: '#1976D2', fontSize: '1rem' }}>{formatPrice(stats.revenus)}</p>
            </div>
            <div className="sal-stat-icon" style={{ background: '#eff6ff' }}>
              <AttachMoney sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="sal-filters">
        <div className="sal-filters-row">
          <div className="sal-search-wrapper">
            <Search fontSize="small" className="sal-search-icon" />
            <input type="text" placeholder="Rechercher véhicule, client, vendeur..." value={search} onChange={(e) => setSearch(e.target.value)} className="sal-search-input" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="sal-select">
            <option value="tous">Tous statuts</option>
            <option value="completee">Complétée</option>
            <option value="en_cours">En cours</option>
          </select>
        </div>
      </div>

      {/* ═══ Sales List ═══ */}
      <div className="sal-list">
        {filtered.map((sale) => (
          <div key={sale.id} className="sal-card">
            <div className="sal-card-row">
              <div className={`sal-card-icon ${sale.statut === 'completee' ? 'sal-card-icon-complete' : 'sal-card-icon-pending'}`}>
                {sale.statut === 'completee'
                  ? <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                  : <HourglassEmpty sx={{ fontSize: 20, color: '#ff9800' }} />
                }
              </div>
              <div className="sal-card-info">
                <p className="sal-card-vehicle">{sale.vehicleName}</p>
                <p className="sal-card-meta">{sale.clientName} • {sale.vendeurName} • {sale.date}</p>
              </div>
              <div className="sal-card-right">
                <p className="sal-card-amount">{formatPrice(sale.montant)}</p>
                <span className={`sal-payment-badge ${sale.paiement.statut === 'payé' ? 'sal-payment-paid' : 'sal-payment-pending'}`}>
                  {sale.paiement.statut === 'payé' ? <><CheckCircle sx={{ fontSize: 10 }} /> Payé</> : <><HourglassEmpty sx={{ fontSize: 10 }} /> En attente</>}
                </span>
              </div>
              <div className="sal-card-actions">
                <button onClick={() => handleView(sale)} className="sal-action-btn sal-action-view"><Visibility sx={{ fontSize: 16 }} /></button>
                {canManage && (
                  <>
                    <button onClick={() => handleEdit(sale)} className="sal-action-btn sal-action-edit"><Edit sx={{ fontSize: 16 }} /></button>
                    <button onClick={() => setDeleteConfirm(sale.id)} className="sal-action-btn sal-action-delete"><Delete sx={{ fontSize: 16 }} /></button>
                  </>
                )}
              </div>
            </div>
            {sale.paiement.statut !== 'payé' && (
              <div className="sal-card-progress">
                <div className="sal-progress-row">
                  <span className="sal-progress-paid">Payé : {formatPrice(sale.paiement.montantPaye)}</span>
                  <span className="sal-progress-rest">Reste : {formatPrice(sale.paiement.reste)}</span>
                </div>
                <div className="sal-progress-bar">
                  <div className="sal-progress-bar-fill" style={{ width: `${(sale.paiement.montantPaye / sale.montant) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="sal-empty">
          <ShoppingCart sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="sal-empty-text">Aucune vente trouvée</p>
        </div>
      )}

      {/* ═══ MODAL : FORM ═══ */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sal-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier la vente' : 'Nouvelle vente'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="sal-form-fields">
            <div className="sal-form-grid-2">
              <div>
                <label className="sal-form-label">Client</label>
                <select value={form.clientId} onChange={(e) => handleClientSelect(e.target.value)} className="sal-form-select">
                  <option value="">Sélectionner...</option>
                  {mockClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="sal-form-label">Véhicule</label>
                <select value={form.vehicleId} onChange={(e) => handleVehicleSelect(e.target.value)} className="sal-form-select">
                  <option value="">Sélectionner...</option>
                  {mockVehicles.filter((v) => v.statut === 'disponible' || v.id === form.vehicleId).map((v) => (
                    <option key={v.id} value={v.id}>{v.marque} {v.modele} {v.annee}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sal-form-grid-3">
              <div>
                <label className="sal-form-label">Montant (CFA)</label>
                <input type="number" value={form.montant} onChange={(e) => handleChange('montant', e.target.value)} className="sal-form-input" />
              </div>
              <div>
                <label className="sal-form-label">Montant payé</label>
                <input type="number" value={form.paiement.montantPaye} onChange={(e) => handleChange('paiement.montantPaye', e.target.value)} className="sal-form-input" />
              </div>
              <div>
                <label className="sal-form-label">Méthode</label>
                <select value={form.paiement.methode} onChange={(e) => handleChange('paiement.methode', e.target.value)} className="sal-form-select">
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Crédit">Crédit</option>
                </select>
              </div>
            </div>
            <div>
              <label className="sal-form-label">Date</label>
              <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className="sal-form-input" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="sal-modal-btn sal-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="sal-modal-btn sal-modal-btn-primary">{editMode ? 'Modifier' : 'Créer'}</button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VIEW ═══ */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedSale && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="sal-header-title" style={{ fontSize: '0.875rem' }}>Détails vente</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="sal-view-section">
                <p className="sal-view-section-title">Informations</p>
                <div className="sal-view-fields">
                  <div className="sal-view-field">
                    <p className="sal-view-field-label">Véhicule</p>
                    <p className="sal-view-field-value">{selectedSale.vehicleName}</p>
                  </div>
                  <div className="sal-view-field">
                    <p className="sal-view-field-label">Client</p>
                    <p className="sal-view-field-value">{selectedSale.clientName}</p>
                  </div>
                  <div className="sal-view-field">
                    <p className="sal-view-field-label">Vendeur</p>
                    <p className="sal-view-field-value">{selectedSale.vendeurName}</p>
                  </div>
                  <div className="sal-view-field">
                    <p className="sal-view-field-label">Date</p>
                    <p className="sal-view-field-value">{selectedSale.date}</p>
                  </div>
                </div>
              </div>
              <div className="sal-view-section">
                <p className="sal-view-section-title">Paiement</p>
                <div className="sal-view-payment-box">
                  <div className="sal-view-payment-grid">
                    <div>
                      <p className="sal-view-payment-value" style={{ color: '#1e293b' }}>{formatPrice(selectedSale.montant)}</p>
                      <p className="sal-view-payment-label">Montant total</p>
                    </div>
                    <div>
                      <p className="sal-view-payment-value" style={{ color: '#16a34a' }}>{formatPrice(selectedSale.paiement.montantPaye)}</p>
                      <p className="sal-view-payment-label">Payé</p>
                    </div>
                    <div>
                      <p className="sal-view-payment-value" style={{ color: selectedSale.paiement.reste > 0 ? '#ef4444' : '#16a34a' }}>{formatPrice(selectedSale.paiement.reste)}</p>
                      <p className="sal-view-payment-label">Reste</p>
                    </div>
                  </div>
                  {selectedSale.paiement.reste > 0 && (
                    <div className="sal-progress-bar" style={{ marginTop: '0.75rem' }}>
                      <div className="sal-progress-bar-fill" style={{ width: `${(selectedSale.paiement.montantPaye / selectedSale.montant) * 100}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ═══ MODAL : DELETE ═══ */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="sal-delete-modal">
          <div className="sal-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="sal-delete-title">Supprimer cette vente ?</h3>
          <p className="sal-delete-text">Cette action est irréversible.</p>
          <div className="sal-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="sal-modal-btn sal-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="sal-modal-btn sal-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Sales;