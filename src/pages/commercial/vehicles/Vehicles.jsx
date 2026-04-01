// src/pages/vehicles/Vehicles.jsx
import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Close,
  Visibility,
  DirectionsCar,
  Speed,
  LocalGasStation,
  ColorLens,
  Settings,
  CheckCircle,
  Cancel,
  EventAvailable,
  BookmarkAdded,
  Build,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockVehicles } from '../../../data/mockData';
import '../../../styles/vehicles.css';

const Vehicles = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageVehicles');

  const [vehicles, setVehicles] = useState(mockVehicles);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterCarburant, setFilterCarburant] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    prix: '',
    couleur: '',
    kilometrage: 0,
    carburant: 'Essence',
    transmission: 'Manuelle',
    statut: 'disponible',
    vin: '',
    image: '',
    description: '',
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const formatKm = (km) =>
    km === 0 ? 'Neuf' : new Intl.NumberFormat('fr-DZ').format(km) + ' km';

  // ─── Filtrage ───
  const filtered = vehicles.filter((v) => {
    const matchSearch = `${v.marque} ${v.modele} ${v.couleur}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || v.statut === filterStatut;
    const matchCarburant = filterCarburant === 'tous' || v.carburant === filterCarburant;
    return matchSearch && matchStatut && matchCarburant;
  });

  // ─── Stats ───
  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter((v) => v.statut === 'disponible').length,
    vendu: vehicles.filter((v) => v.statut === 'vendu').length,
    reserve: vehicles.filter((v) => v.statut === 'reserve').length,
  };

  const getStatutLabel = (statut) => {
    const labels = {
      disponible: 'Disponible',
      vendu: 'Vendu',
      reserve: 'Réservé',
      en_revision: 'En révision',
    };
    return labels[statut] || statut;
  };

  // ─── Handlers ───
  const handleAdd = () => { setForm(emptyForm); setEditMode(false); setOpenForm(true); };
  const handleEdit = (v) => { setForm({ ...v }); setEditMode(true); setOpenForm(true); };
  const handleView = (v) => { setSelectedVehicle(v); setOpenView(true); };

  const handleSave = () => {
    if (editMode) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === form.id ? { ...form, prix: Number(form.prix), kilometrage: Number(form.kilometrage), annee: Number(form.annee) } : v))
      );
    } else {
      setVehicles((prev) => [...prev, { ...form, id: prev.length + 1, prix: Number(form.prix), kilometrage: Number(form.kilometrage), annee: Number(form.annee) }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => { setVehicles((prev) => prev.filter((v) => v.id !== id)); setDeleteConfirm(null); };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="vehicles-page">
      {/* ═══ Header ═══ */}
      <div className="veh-header">
        <div>
          <h1 className="veh-header-title">Parc Automobile</h1>
          <p className="veh-header-subtitle">Gestion des véhicules</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="veh-add-btn">
            <Add fontSize="small" />
            Ajouter un véhicule
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="veh-stats-grid">
        <div className="veh-stat-card">
          <div className="veh-stat-row">
            <div>
              <p className="veh-stat-label">Total</p>
              <p className="veh-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p>
            </div>
            <div className="veh-stat-icon" style={{ background: '#eff6ff' }}>
              <DirectionsCar sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="veh-stat-card">
          <div className="veh-stat-row">
            <div>
              <p className="veh-stat-label">Disponibles</p>
              <p className="veh-stat-value" style={{ color: '#16a34a' }}>{stats.disponible}</p>
            </div>
            <div className="veh-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
            </div>
          </div>
        </div>
        <div className="veh-stat-card">
          <div className="veh-stat-row">
            <div>
              <p className="veh-stat-label">Vendus</p>
              <p className="veh-stat-value" style={{ color: '#ef4444' }}>{stats.vendu}</p>
            </div>
            <div className="veh-stat-icon" style={{ background: '#fef2f2' }}>
              <Cancel sx={{ fontSize: 18, color: '#f44336' }} />
            </div>
          </div>
        </div>
        <div className="veh-stat-card">
          <div className="veh-stat-row">
            <div>
              <p className="veh-stat-label">Réservés</p>
              <p className="veh-stat-value" style={{ color: '#f97316' }}>{stats.reserve}</p>
            </div>
            <div className="veh-stat-icon" style={{ background: '#fff7ed' }}>
              <BookmarkAdded sx={{ fontSize: 18, color: '#f97316' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="veh-filters">
        <div className="veh-filters-row">
          <div className="veh-search-wrapper">
            <Search fontSize="small" className="veh-search-icon" />
            <input type="text" placeholder="Rechercher marque, modèle..." value={search} onChange={(e) => setSearch(e.target.value)} className="veh-search-input" />
          </div>
          <div className="veh-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="veh-select">
              <option value="tous">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="vendu">Vendu</option>
              <option value="reserve">Réservé</option>
              <option value="en_revision">En révision</option>
            </select>
            <select value={filterCarburant} onChange={(e) => setFilterCarburant(e.target.value)} className="veh-select">
              <option value="tous">Carburant</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Grid ═══ */}
      <div className="veh-grid">
        {filtered.map((v) => (
          <div key={v.id} className="veh-card">
            {/* Image */}
            <div className="veh-card-img-wrapper">
              <img src={v.image} alt={`${v.marque} ${v.modele}`} className="veh-card-img" />
              <span className={`veh-card-status veh-status-${v.statut}`}>
                {getStatutLabel(v.statut)}
              </span>
              {/* Actions overlay */}
              <div className="veh-card-actions-overlay">
                <button onClick={() => handleView(v)} className="veh-overlay-btn veh-overlay-view" title="Voir">
                  <Visibility sx={{ fontSize: 15 }} />
                </button>
                {canManage && (
                  <>
                    <button onClick={() => handleEdit(v)} className="veh-overlay-btn veh-overlay-edit" title="Modifier">
                      <Edit sx={{ fontSize: 15 }} />
                    </button>
                    <button onClick={() => setDeleteConfirm(v.id)} className="veh-overlay-btn veh-overlay-delete" title="Supprimer">
                      <Delete sx={{ fontSize: 15 }} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="veh-card-body">
              <div className="veh-card-title-row">
                <h3 className="veh-card-title">{v.marque} {v.modele}</h3>
                <span className="veh-card-year">{v.annee}</span>
              </div>
              <div className="veh-card-specs">
                <span className="veh-spec-tag">{v.carburant}</span>
                <span className="veh-spec-tag">{v.transmission}</span>
                <span className="veh-spec-tag">{v.couleur}</span>
              </div>
              <div className="veh-card-bottom">
                <p className="veh-card-price">{formatPrice(v.prix)}</p>
                <p className="veh-card-km">{formatKm(v.kilometrage)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="veh-empty">
          <DirectionsCar sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="veh-empty-text">Aucun véhicule trouvé</p>
        </div>
      )}

      {/* ═══ MODAL : FORM ═══ */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="veh-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="veh-form-fields">
            <div className="veh-form-grid-2">
              <div>
                <label className="veh-form-label">Marque</label>
                <input type="text" value={form.marque} onChange={(e) => handleChange('marque', e.target.value)} placeholder="Toyota" className="veh-form-input" />
              </div>
              <div>
                <label className="veh-form-label">Modèle</label>
                <input type="text" value={form.modele} onChange={(e) => handleChange('modele', e.target.value)} placeholder="Corolla" className="veh-form-input" />
              </div>
            </div>
            <div className="veh-form-grid-3">
              <div>
                <label className="veh-form-label">Année</label>
                <input type="number" value={form.annee} onChange={(e) => handleChange('annee', e.target.value)} className="veh-form-input" />
              </div>
              <div>
                <label className="veh-form-label">Prix (DA)</label>
                <input type="number" value={form.prix} onChange={(e) => handleChange('prix', e.target.value)} placeholder="3200000" className="veh-form-input" />
              </div>
              <div>
                <label className="veh-form-label">Kilométrage</label>
                <input type="number" value={form.kilometrage} onChange={(e) => handleChange('kilometrage', e.target.value)} className="veh-form-input" />
              </div>
            </div>
            <div className="veh-form-grid-3">
              <div>
                <label className="veh-form-label">Couleur</label>
                <input type="text" value={form.couleur} onChange={(e) => handleChange('couleur', e.target.value)} placeholder="Blanc" className="veh-form-input" />
              </div>
              <div>
                <label className="veh-form-label">Carburant</label>
                <select value={form.carburant} onChange={(e) => handleChange('carburant', e.target.value)} className="veh-form-select">
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>
              <div>
                <label className="veh-form-label">Transmission</label>
                <select value={form.transmission} onChange={(e) => handleChange('transmission', e.target.value)} className="veh-form-select">
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>
            </div>
            <div className="veh-form-grid-2">
              <div>
                <label className="veh-form-label">VIN</label>
                <input type="text" value={form.vin} onChange={(e) => handleChange('vin', e.target.value)} placeholder="JTDKN3DU5A0123456" className="veh-form-input" />
              </div>
              <div>
                <label className="veh-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="veh-form-select">
                  <option value="disponible">Disponible</option>
                  <option value="vendu">Vendu</option>
                  <option value="reserve">Réservé</option>
                  <option value="en_revision">En révision</option>
                </select>
              </div>
            </div>
            <div>
              <label className="veh-form-label">URL Image</label>
              <input type="text" value={form.image} onChange={(e) => handleChange('image', e.target.value)} className="veh-form-input" />
            </div>
            <div>
              <label className="veh-form-label">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Description du véhicule..." className="veh-form-textarea" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="veh-modal-btn veh-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="veh-modal-btn veh-modal-btn-primary">{editMode ? 'Modifier' : 'Ajouter'}</button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VIEW ═══ */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedVehicle && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="veh-header-title" style={{ fontSize: '0.875rem' }}>Détails véhicule</span>
              <IconButton onClick={() => setOpenView(false)} size="small"><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent>
              <img src={selectedVehicle.image} alt={selectedVehicle.modele} className="veh-view-img" />
              <div className="veh-view-title-row">
                <div>
                  <h2 className="veh-view-title">{selectedVehicle.marque} {selectedVehicle.modele}</h2>
                  <span className={`veh-card-status veh-status-${selectedVehicle.statut}`} style={{ position: 'static' }}>
                    {getStatutLabel(selectedVehicle.statut)}
                  </span>
                </div>
                <p className="veh-view-price">{formatPrice(selectedVehicle.prix)}</p>
              </div>
              <div className="veh-view-specs">
                <div className="veh-view-spec">
                  <p className="veh-view-spec-label">Année</p>
                  <p className="veh-view-spec-value">{selectedVehicle.annee}</p>
                </div>
                <div className="veh-view-spec">
                  <p className="veh-view-spec-label">Couleur</p>
                  <p className="veh-view-spec-value">{selectedVehicle.couleur}</p>
                </div>
                <div className="veh-view-spec">
                  <p className="veh-view-spec-label">Carburant</p>
                  <p className="veh-view-spec-value">{selectedVehicle.carburant}</p>
                </div>
                <div className="veh-view-spec">
                  <p className="veh-view-spec-label">Transmission</p>
                  <p className="veh-view-spec-value">{selectedVehicle.transmission}</p>
                </div>
                <div className="veh-view-spec">
                  <p className="veh-view-spec-label">Kilométrage</p>
                  <p className="veh-view-spec-value">{formatKm(selectedVehicle.kilometrage)}</p>
                </div>
                {selectedVehicle.vin && (
                  <div className="veh-view-spec">
                    <p className="veh-view-spec-label">VIN</p>
                    <p className="veh-view-spec-value" style={{ fontSize: '0.625rem' }}>{selectedVehicle.vin}</p>
                  </div>
                )}
              </div>
              {selectedVehicle.description && (
                <div className="veh-view-desc">
                  <p className="veh-view-desc-title">Description</p>
                  <p className="veh-view-desc-text">{selectedVehicle.description}</p>
                </div>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ═══ MODAL : DELETE ═══ */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="veh-delete-modal">
          <div className="veh-delete-icon"><Delete sx={{ color: '#f44336' }} /></div>
          <h3 className="veh-delete-title">Supprimer ce véhicule ?</h3>
          <p className="veh-delete-text">Cette action est irréversible.</p>
          <div className="veh-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="veh-modal-btn veh-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="veh-modal-btn veh-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Vehicles;