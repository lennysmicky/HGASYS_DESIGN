import { useState } from 'react';
import {
  Add, Search, Edit, Delete, Visibility, Close,
  Inventory, Category, Warning, AttachMoney,
  LocationOn, LocalShipping, Build, Layers,
} from '@mui/icons-material';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockParts, mockSuppliers } from '../../../data/mockData';
import '../../../styles/parts.css';

const Parts = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageParts');

  const [parts, setParts] = useState(mockParts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = [...new Set(parts.map((p) => p.categorie))];

  const emptyForm = {
    reference: '', nom: '', categorie: 'Filtres', marqueCompatible: '',
    prixAchat: '', prixVente: '', stock: '', stockMin: '',
    emplacement: '', fournisseurId: '', statut: 'disponible',
  };
  const [form, setForm] = useState(emptyForm);

  const formatPrice = (p) => new Intl.NumberFormat('fr-DZ').format(p) + ' CFA';

  const stats = {
    total: parts.length,
    categories: categories.length,
    critique: parts.filter((p) => p.statut === 'stock_critique').length,
    valeurStock: parts.reduce((sum, p) => sum + (p.prixVente * p.stock), 0),
  };

  const getCatClass = (cat) => {
    const map = {
      Filtres: 'prt-cat-filtres', Freinage: 'prt-cat-freinage',
      Huiles: 'prt-cat-huiles', Climatisation: 'prt-cat-climatisation',
      Distribution: 'prt-cat-distribution', Electronique: 'prt-cat-electronique',
      Electricité: 'prt-cat-electricite', Suspension: 'prt-cat-suspension',
      Liquides: 'prt-cat-liquides',
    };
    return map[cat] || 'prt-cat-default';
  };

  const getStockClass = (stock, min) => {
    if (stock <= min) return 'prt-stock-critique';
    if (stock <= min * 2) return 'prt-stock-warning';
    return 'prt-stock-ok';
  };

  const filtered = parts.filter((p) => {
    const matchSearch = `${p.reference} ${p.nom} ${p.marqueCompatible} ${p.emplacement}`
      .toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'tous' || p.categorie === filterCat;
    const matchStatut = filterStatut === 'tous' || p.statut === filterStatut;
    return matchSearch && matchCat && matchStatut;
  });

  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (part) => { setForm({ ...part }); setEditMode(true); setOpenForm(true); };
  const handleView = (part) => { setSelectedPart(part); setOpenView(true); };

  const handleSave = () => {
    const stock = Number(form.stock);
    const stockMin = Number(form.stockMin);
    const statut = stock <= stockMin ? 'stock_critique' : 'disponible';

    if (editMode) {
      setParts((prev) => prev.map((p) => p.id === form.id ? {
        ...form, prixAchat: Number(form.prixAchat), prixVente: Number(form.prixVente),
        stock, stockMin, fournisseurId: Number(form.fournisseurId), statut,
      } : p));
    } else {
      setParts((prev) => [...prev, {
        ...form, id: prev.length + 1,
        prixAchat: Number(form.prixAchat), prixVente: Number(form.prixVente),
        stock, stockMin, fournisseurId: Number(form.fournisseurId), statut,
      }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setParts((prev) => prev.filter((p) => p.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="prt-page">
      <div className="prt-header">
        <div>
          <h1 className="prt-header-title">Pièces Détachées</h1>
          <p className="prt-header-subtitle">Gestion du catalogue de pièces</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="prt-add-btn"><Add fontSize="small" /> Ajouter une pièce</button>
        )}
      </div>

      <div className="prt-stats-grid">
        <div className="prt-stat-card">
          <div className="prt-stat-row">
            <div><p className="prt-stat-label">Pièces</p><p className="prt-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div>
            <div className="prt-stat-icon" style={{ background: '#eff6ff' }}><Inventory sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
        <div className="prt-stat-card">
          <div className="prt-stat-row">
            <div><p className="prt-stat-label">Catégories</p><p className="prt-stat-value" style={{ color: '#7c3aed' }}>{stats.categories}</p></div>
            <div className="prt-stat-icon" style={{ background: '#f3e8ff' }}><Category sx={{ fontSize: 22, color: '#7c3aed' }} /></div>
          </div>
        </div>
        <div className="prt-stat-card">
          <div className="prt-stat-row">
            <div><p className="prt-stat-label">Stock critique</p><p className="prt-stat-value" style={{ color: '#ef4444' }}>{stats.critique}</p></div>
            <div className="prt-stat-icon" style={{ background: '#fef2f2' }}><Warning sx={{ fontSize: 22, color: '#ef4444' }} /></div>
          </div>
        </div>
        <div className="prt-stat-card">
          <div className="prt-stat-row">
            <div><p className="prt-stat-label">Valeur stock</p><p className="prt-stat-value" style={{ color: '#16a34a', fontSize: '1rem' }}>{formatPrice(stats.valeurStock)}</p></div>
            <div className="prt-stat-icon" style={{ background: '#f0fdf4' }}><AttachMoney sx={{ fontSize: 22, color: '#16a34a' }} /></div>
          </div>
        </div>
      </div>

      <div className="prt-filters">
        <div className="prt-filters-row">
          <div className="prt-search-wrapper">
            <Search fontSize="small" className="prt-search-icon" />
            <input type="text" placeholder="Rechercher référence, nom, marque..." value={search} onChange={(e) => setSearch(e.target.value)} className="prt-search-input" />
          </div>
          <div className="prt-filter-selects">
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="prt-select">
              <option value="tous">Catégories</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="prt-select">
              <option value="tous">Statut</option>
              <option value="disponible">Disponible</option>
              <option value="stock_critique">Stock critique</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="prt-table-wrapper">
          <table className="prt-table">
            <thead><tr>
              <th>Référence</th><th>Pièce</th><th>Catégorie</th><th>Achat</th><th>Vente</th><th>Stock</th><th>Emplacement</th><th>Statut</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td data-label="Référence"><span className="prt-ref">{p.reference}</span></td>
                  <td data-label="Pièce">
                    <span className="prt-name">{p.nom}</span><br />
                    <span className="prt-compat">{p.marqueCompatible}</span>
                  </td>
                  <td data-label="Catégorie"><span className={`prt-cat-badge ${getCatClass(p.categorie)}`}>{p.categorie}</span></td>
                  <td data-label="Achat"><span className="prt-price prt-price-achat">{formatPrice(p.prixAchat)}</span></td>
                  <td data-label="Vente"><span className="prt-price prt-price-vente">{formatPrice(p.prixVente)}</span></td>
                  <td data-label="Stock">
                    <span className={`prt-stock ${getStockClass(p.stock, p.stockMin)}`}>{p.stock}</span>
                    <span className="prt-stock-min"> / min {p.stockMin}</span>
                  </td>
                  <td data-label="Emplacement"><span className="prt-emplacement">{p.emplacement}</span></td>
                  <td data-label="Statut">
                    <span className={`prt-status-badge ${p.statut === 'stock_critique' ? 'prt-status-stock_critique' : 'prt-status-disponible'}`}>
                      ● {p.statut === 'stock_critique' ? 'Critique' : 'OK'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="prt-actions">
                      <button onClick={() => handleView(p)} className="prt-action-btn prt-action-view"><Visibility sx={{ fontSize: 15 }} /></button>
                      {canManage && (<>
                        <button onClick={() => handleEdit(p)} className="prt-action-btn prt-action-edit"><Edit sx={{ fontSize: 15 }} /></button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="prt-action-btn prt-action-delete"><Delete sx={{ fontSize: 15 }} /></button>
                      </>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="prt-empty"><Inventory sx={{ fontSize: 48, color: '#e0e0e0' }} /><p className="prt-empty-text">Aucune pièce trouvée</p></div>
      )}

      {/* FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="prt-header-title" style={{ fontSize: '0.875rem' }}>{editMode ? 'Modifier' : 'Ajouter une pièce'}</span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="prt-form-fields">
            <div className="prt-form-grid-2">
              <div><label className="prt-form-label">Référence</label><input type="text" value={form.reference} onChange={(e) => handleChange('reference', e.target.value)} placeholder="FH-TOY-001" className="prt-form-input" /></div>
              <div><label className="prt-form-label">Catégorie</label>
                <select value={form.categorie} onChange={(e) => handleChange('categorie', e.target.value)} className="prt-form-select">
                  {['Filtres','Freinage','Huiles','Climatisation','Distribution','Electronique','Electricité','Suspension','Liquides'].map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <div><label className="prt-form-label">Nom de la pièce</label><input type="text" value={form.nom} onChange={(e) => handleChange('nom', e.target.value)} placeholder="Filtre à huile Toyota" className="prt-form-input" /></div>
            <div className="prt-form-grid-2">
              <div><label className="prt-form-label">Marque compatible</label><input type="text" value={form.marqueCompatible} onChange={(e) => handleChange('marqueCompatible', e.target.value)} placeholder="Universel" className="prt-form-input" /></div>
              <div><label className="prt-form-label">Emplacement</label><input type="text" value={form.emplacement} onChange={(e) => handleChange('emplacement', e.target.value)} placeholder="A1-01" className="prt-form-input" /></div>
            </div>
            <div className="prt-form-grid-3">
              <div><label className="prt-form-label">Prix achat (CFA)</label><input type="number" value={form.prixAchat} onChange={(e) => handleChange('prixAchat', e.target.value)} className="prt-form-input" /></div>
              <div><label className="prt-form-label">Prix vente (CFA)</label><input type="number" value={form.prixVente} onChange={(e) => handleChange('prixVente', e.target.value)} className="prt-form-input" /></div>
              <div><label className="prt-form-label">Fournisseur</label>
                <select value={form.fournisseurId} onChange={(e) => handleChange('fournisseurId', e.target.value)} className="prt-form-select">
                  <option value="">Sélectionner</option>
                  {mockSuppliers.map((s) => (<option key={s.id} value={s.id}>{s.nom}</option>))}
                </select>
              </div>
            </div>
            <div className="prt-form-grid-2">
              <div><label className="prt-form-label">Stock actuel</label><input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} className="prt-form-input" /></div>
              <div><label className="prt-form-label">Stock minimum</label><input type="number" value={form.stockMin} onChange={(e) => handleChange('stockMin', e.target.value)} className="prt-form-input" /></div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="prt-modal-btn prt-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="prt-modal-btn prt-modal-btn-primary">{editMode ? 'Modifier' : 'Ajouter'}</button>
        </DialogActions>
      </Dialog>

      {/* VIEW */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedPart && (() => {
          const supplier = mockSuppliers.find((s) => s.id === selectedPart.fournisseurId);
          return (<>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="prt-header-title" style={{ fontSize: '0.875rem' }}>Détails pièce</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="prt-view-content">
                <div className="prt-view-header">
                  <div>
                    <h2 className="prt-view-name">{selectedPart.nom}</h2>
                    <p className="prt-view-ref">{selectedPart.reference}</p>
                    <div className="prt-view-badges">
                      <span className={`prt-cat-badge ${getCatClass(selectedPart.categorie)}`}>{selectedPart.categorie}</span>
                      <span className={`prt-status-badge ${selectedPart.statut === 'stock_critique' ? 'prt-status-stock_critique' : 'prt-status-disponible'}`}>● {selectedPart.statut === 'stock_critique' ? 'Critique' : 'OK'}</span>
                    </div>
                  </div>
                  <div className="prt-view-price-box">
                    <p className="prt-view-price-value">{formatPrice(selectedPart.prixVente)}</p>
                    <p className="prt-view-price-label">Prix de vente</p>
                  </div>
                </div>
                <div className="prt-view-fields">
                  <div className="prt-view-field"><div className="prt-view-field-icon" style={{ background: '#eff6ff' }}><Build sx={{ fontSize: 16, color: '#1976D2' }} /></div><div><p className="prt-view-field-label">Compatible</p><p className="prt-view-field-value">{selectedPart.marqueCompatible}</p></div></div>
                  <div className="prt-view-field"><div className="prt-view-field-icon" style={{ background: '#f3e8ff' }}><Layers sx={{ fontSize: 16, color: '#7c3aed' }} /></div><div><p className="prt-view-field-label">Stock</p><p className="prt-view-field-value"><span className={getStockClass(selectedPart.stock, selectedPart.stockMin)}>{selectedPart.stock}</span> / min {selectedPart.stockMin}</p></div></div>
                  <div className="prt-view-field"><div className="prt-view-field-icon" style={{ background: '#f0fdf4' }}><LocationOn sx={{ fontSize: 16, color: '#16a34a' }} /></div><div><p className="prt-view-field-label">Emplacement</p><p className="prt-view-field-value">{selectedPart.emplacement}</p></div></div>
                  <div className="prt-view-field"><div className="prt-view-field-icon" style={{ background: '#fff7ed' }}><LocalShipping sx={{ fontSize: 16, color: '#ea580c' }} /></div><div><p className="prt-view-field-label">Fournisseur</p><p className="prt-view-field-value">{supplier?.nom || '—'}</p></div></div>
                </div>
                <div className="prt-view-price-detail">
                  <div className="prt-view-price-item"><p className="prt-view-price-item-value" style={{ color: '#64748b' }}>{formatPrice(selectedPart.prixAchat)}</p><p className="prt-view-price-item-label">Prix achat</p></div>
                  <div className="prt-view-price-item"><p className="prt-view-price-item-value" style={{ color: '#16a34a' }}>{formatPrice(selectedPart.prixVente)}</p><p className="prt-view-price-item-label">Prix vente</p></div>
                  <div className="prt-view-price-item"><p className="prt-view-price-item-value" style={{ color: '#1976D2' }}>{formatPrice(selectedPart.prixVente - selectedPart.prixAchat)}</p><p className="prt-view-price-item-label">Marge unitaire</p></div>
                </div>
              </div>
            </DialogContent>
          </>);
        })()}
      </Dialog>

      {/* DELETE */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="prt-delete-modal">
          <div className="prt-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="prt-delete-title">Supprimer cette pièce ?</h3>
          <p className="prt-delete-text">Cette action est irréversible.</p>
          <div className="prt-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="prt-modal-btn prt-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="prt-modal-btn prt-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Parts;