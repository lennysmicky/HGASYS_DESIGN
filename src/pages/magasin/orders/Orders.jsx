import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  LocalShipping, CalendarMonth, CheckCircle,
  HourglassEmpty, Inventory, AttachMoney, Receipt,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockOrders, mockSuppliers } from '../../../data/mockData';
import '../../../styles/orders.css';

const Orders = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageOrders');

  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    fournisseurId: '', fournisseurName: '',
    dateCommande: new Date().toISOString().split('T')[0],
    dateLivraisonPrevue: '', dateLivraisonReelle: '',
    statut: 'en_cours', montantTotal: '',
  };
  const [form, setForm] = useState(emptyForm);

  const formatPrice = (p) => new Intl.NumberFormat('fr-DZ').format(p) + ' CFA';

  const getStatusConfig = (s) => {
    const c = {
      en_cours: { label: 'En cours', className: 'ord-status-en_cours', color: '#f59e0b' },
      confirmee: { label: 'Confirmée', className: 'ord-status-confirmee', color: '#3b82f6' },
      livree: { label: 'Livrée', className: 'ord-status-livree', color: '#22c55e' },
      annulee: { label: 'Annulée', className: 'ord-status-annulee', color: '#ef4444' },
    };
    return c[s] || c.en_cours;
  };

  const stats = {
    total: orders.length,
    enCours: orders.filter((o) => o.statut === 'en_cours').length,
    livrees: orders.filter((o) => o.statut === 'livree').length,
    montantTotal: orders.reduce((sum, o) => sum + o.montantTotal, 0),
  };

  const filtered = orders.filter((o) => {
    const matchSearch = `${o.numero} ${o.fournisseurName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || o.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (ord) => { setForm({ ...ord }); setEditMode(true); setOpenForm(true); };
  const handleView = (ord) => { setSelectedOrder(ord); setOpenView(true); };

  const handleSave = () => {
    const supplier = mockSuppliers.find((s) => s.id === Number(form.fournisseurId));
    if (editMode) {
      setOrders((prev) => prev.map((o) => o.id === form.id ? {
        ...form, montantTotal: Number(form.montantTotal),
        fournisseurName: supplier?.nom || form.fournisseurName,
      } : o));
    } else {
      setOrders((prev) => [...prev, {
        ...form, id: prev.length + 1,
        numero: `CMD-2024-${String(prev.length + 1).padStart(3, '0')}`,
        fournisseurId: Number(form.fournisseurId),
        fournisseurName: supplier?.nom || '',
        montantTotal: Number(form.montantTotal),
        dateLivraisonReelle: form.statut === 'livree' ? form.dateLivraisonReelle || null : null,
        articles: [],
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setOrders((prev) => prev.filter((o) => o.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const isLate = (prevue, reelle, statut) => {
    if (statut === 'livree' || !prevue) return false;
    return new Date(prevue) < new Date();
  };

  return (
    <div className="ord-page">
      <div className="ord-header">
        <div>
          <h1 className="ord-header-title">Commandes Fournisseurs</h1>
          <p className="ord-header-subtitle">Suivi des commandes et livraisons</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="ord-add-btn"><Add fontSize="small" /> Nouvelle commande</button>
        )}
      </div>

      <div className="ord-stats-grid">
        <div className="ord-stat-card"><div className="ord-stat-row"><div><p className="ord-stat-label">Total</p><p className="ord-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div><div className="ord-stat-icon" style={{ background: '#eff6ff' }}><Receipt sx={{ fontSize: 22, color: '#1976D2' }} /></div></div></div>
        <div className="ord-stat-card"><div className="ord-stat-row"><div><p className="ord-stat-label">En cours</p><p className="ord-stat-value" style={{ color: '#b45309' }}>{stats.enCours}</p></div><div className="ord-stat-icon" style={{ background: '#fffbeb' }}><HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} /></div></div></div>
        <div className="ord-stat-card"><div className="ord-stat-row"><div><p className="ord-stat-label">Livrées</p><p className="ord-stat-value" style={{ color: '#16a34a' }}>{stats.livrees}</p></div><div className="ord-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div></div></div>
        <div className="ord-stat-card"><div className="ord-stat-row"><div><p className="ord-stat-label">Montant total</p><p className="ord-stat-value" style={{ color: '#1976D2', fontSize: '1rem' }}>{formatPrice(stats.montantTotal)}</p></div><div className="ord-stat-icon" style={{ background: '#eff6ff' }}><AttachMoney sx={{ fontSize: 22, color: '#1976D2' }} /></div></div></div>
      </div>

      <div className="ord-filters">
        <div className="ord-filters-row">
          <div className="ord-search-wrapper">
            <Search fontSize="small" className="ord-search-icon" />
            <input type="text" placeholder="Rechercher n° commande, fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)} className="ord-search-input" />
          </div>
          <div className="ord-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="ord-select">
              <option value="tous">Tous statuts</option>
              <option value="en_cours">En cours</option>
              <option value="confirmee">Confirmée</option>
              <option value="livree">Livrée</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="ord-grid">
          {filtered.map((ord) => {
            const statusConfig = getStatusConfig(ord.statut);
            const late = isLate(ord.dateLivraisonPrevue, ord.dateLivraisonReelle, ord.statut);
            return (
              <div key={ord.id} className="ord-card">
                
                <div className="ord-card-body">
                  <div className="ord-card-top">
                    <div className="ord-card-top-left">
                      <p className="ord-card-numero">{ord.numero}</p>
                      <p className="ord-card-fournisseur">{ord.fournisseurName}</p>
                    </div>
                    <div className="ord-card-actions">
                      <button onClick={() => handleView(ord)} className="ord-action-btn ord-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                      {canManage && (<>
                        <button onClick={() => handleEdit(ord)} className="ord-action-btn ord-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                        <button onClick={() => setDeleteConfirm(ord.id)} className="ord-action-btn ord-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                      </>)}
                    </div>
                  </div>

                  <span className={`ord-status-badge ${statusConfig.className}`}>● {statusConfig.label}</span>

                  <div className="ord-card-dates">
                    <div className="ord-date-row"><CalendarMonth /><span className="ord-date-label">Commandée</span><span className="ord-date-value">{ord.dateCommande}</span></div>
                    <div className="ord-date-row"><LocalShipping /><span className="ord-date-label">Livraison prévue</span><span className={`ord-date-value ${late ? 'ord-date-value-late' : ''}`}>{ord.dateLivraisonPrevue}{late && ' (en retard)'}</span></div>
                    {ord.dateLivraisonReelle && (<div className="ord-date-row"><CheckCircle /><span className="ord-date-label">Livrée le</span><span className="ord-date-value">{ord.dateLivraisonReelle}</span></div>)}
                  </div>

                  {ord.articles && ord.articles.length > 0 && (
                    <div className="ord-card-articles">
                      <p className="ord-articles-title">Articles ({ord.articles.length})</p>
                      <div className="ord-articles-list">
                        {ord.articles.slice(0, 3).map((a, i) => (
                          <div key={i} className="ord-article-item">
                            <span className="ord-article-name">{a.nom}</span>
                            <span className="ord-article-qty">×{a.quantite}</span>
                          </div>
                        ))}
                        {ord.articles.length > 3 && <div className="ord-article-item"><span className="ord-article-name" style={{ color: '#94a3b8' }}>+{ord.articles.length - 3} autres...</span></div>}
                      </div>
                    </div>
                  )}

                  <div className="ord-card-footer">
                    <p className="ord-card-total">{formatPrice(ord.montantTotal)}<span className="ord-card-total-label"> total</span></p>
                    <span className="ord-card-articles-count"><Inventory sx={{ fontSize: 12 }} />{ord.articles?.length || 0} articles</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ord-empty"><Receipt sx={{ fontSize: 48, color: '#e0e0e0' }} /><p className="ord-empty-text">Aucune commande trouvée</p></div>
      )}

      {/* FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="ord-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier' : 'Nouvelle commande'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="ord-form-fields">
            <div><label className="ord-form-label">Fournisseur</label>
              <select value={form.fournisseurId} onChange={(e) => handleChange('fournisseurId', e.target.value)} className="ord-form-select">
                <option value="">Sélectionner</option>
                {mockSuppliers.map((s) => (<option key={s.id} value={s.id}>{s.nom}</option>))}
              </select>
            </div>
            <div className="ord-form-grid-3">
              <div><label className="ord-form-label">Date commande</label><input type="date" value={form.dateCommande} onChange={(e) => handleChange('dateCommande', e.target.value)} className="ord-form-input" /></div>
              <div><label className="ord-form-label">Livraison prévue</label><input type="date" value={form.dateLivraisonPrevue} onChange={(e) => handleChange('dateLivraisonPrevue', e.target.value)} className="ord-form-input" /></div>
              <div><label className="ord-form-label">Livraison réelle</label><input type="date" value={form.dateLivraisonReelle || ''} onChange={(e) => handleChange('dateLivraisonReelle', e.target.value)} className="ord-form-input" /></div>
            </div>
            <div className="ord-form-grid-2">
              <div><label className="ord-form-label">Montant total (CFA)</label><input type="number" value={form.montantTotal} onChange={(e) => handleChange('montantTotal', e.target.value)} placeholder="45000" className="ord-form-input" /></div>
              <div><label className="ord-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="ord-form-select">
                  <option value="en_cours">En cours</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="livree">Livrée</option>
                  <option value="annulee">Annulée</option>
                </select>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="ord-modal-btn ord-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="ord-modal-btn ord-modal-btn-primary">{editMode ? 'Modifier' : 'Créer'}</button>
        </DialogActions>
      </Dialog>

      {/* VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedOrder && (() => {
          const statusConfig = getStatusConfig(selectedOrder.statut);
          return (<>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="ord-header-title" style={{ fontSize: '0.875rem' }}>Détails commande</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="ord-view-content">
                <div className="ord-view-header">
                  <div>
                    <h2 className="ord-view-numero">{selectedOrder.numero}</h2>
                    <p className="ord-view-fournisseur">{selectedOrder.fournisseurName}</p>
                    <span className={`ord-status-badge ${statusConfig.className}`} style={{ marginTop: '0.375rem', display: 'inline-flex' }}>● {statusConfig.label}</span>
                  </div>
                  <div className="ord-view-total-box">
                    <p className="ord-view-total-value">{formatPrice(selectedOrder.montantTotal)}</p>
                    <p className="ord-view-total-label">Montant total</p>
                  </div>
                </div>
                <div className="ord-view-fields">
                  <div className="ord-view-field"><div className="ord-view-field-icon" style={{ background: '#eff6ff' }}><CalendarMonth sx={{ fontSize: 16, color: '#1976D2' }} /></div><div><p className="ord-view-field-label">Date commande</p><p className="ord-view-field-value">{selectedOrder.dateCommande}</p></div></div>
                  <div className="ord-view-field"><div className="ord-view-field-icon" style={{ background: '#fff7ed' }}><LocalShipping sx={{ fontSize: 16, color: '#ea580c' }} /></div><div><p className="ord-view-field-label">Livraison prévue</p><p className="ord-view-field-value">{selectedOrder.dateLivraisonPrevue}</p></div></div>
                  <div className="ord-view-field"><div className="ord-view-field-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /></div><div><p className="ord-view-field-label">Livrée le</p><p className="ord-view-field-value">{selectedOrder.dateLivraisonReelle || 'Non livrée'}</p></div></div>
                  <div className="ord-view-field"><div className="ord-view-field-icon" style={{ background: '#f3e8ff' }}><Inventory sx={{ fontSize: 16, color: '#7c3aed' }} /></div><div><p className="ord-view-field-label">Articles</p><p className="ord-view-field-value">{selectedOrder.articles?.length || 0} articles</p></div></div>
                </div>
                {selectedOrder.articles && selectedOrder.articles.length > 0 && (
                  <div className="ord-view-articles">
                    <p className="ord-view-articles-title">Détail des articles</p>
                    <table className="ord-view-articles-table">
                      <thead><tr><th>Pièce</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
                      <tbody>
                        {selectedOrder.articles.map((a, i) => (
                          <tr key={i}><td>{a.nom}</td><td>{a.quantite}</td><td>{formatPrice(a.prixUnitaire)}</td><td>{formatPrice(a.quantite * a.prixUnitaire)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="ord-view-articles-total"><span>Total :</span><span>{formatPrice(selectedOrder.montantTotal)}</span></div>
                  </div>
                )}
              </div>
            </DialogContent>
          </>);
        })()}
      </Dialog>

      {/* DELETE */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="ord-delete-modal">
          <div className="ord-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="ord-delete-title">Supprimer cette commande ?</h3>
          <p className="ord-delete-text">Cette action est irréversible.</p>
          <div className="ord-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="ord-modal-btn ord-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="ord-modal-btn ord-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Orders;