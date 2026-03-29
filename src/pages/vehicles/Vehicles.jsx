import { useState } from 'react';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  DirectionsCar,
  Close,
  LocalGasStation,
  Speed,
  CalendarMonth,
  ColorLens,
  Settings,
  Visibility,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { canDo } from '../../utils/roles';
import { mockVehicles } from '../../data/mockData';

const Vehicles = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageVehicles');

  const [vehicles, setVehicles] = useState(mockVehicles);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterMarque, setFilterMarque] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    marque: '', modele: '', annee: 2024, prix: '',
    couleur: '', kilometrage: 0, carburant: 'Essence',
    transmission: 'Manuelle', statut: 'disponible',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop',
    description: ''
  };

  const [form, setForm] = useState(emptyForm);

  const marques = [...new Set(mockVehicles.map(v => v.marque))];

  // Filtrage
  const filtered = vehicles.filter((v) => {
    const matchSearch = `${v.marque} ${v.modele} ${v.couleur}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || v.statut === filterStatut;
    const matchMarque = filterMarque === 'tous' || v.marque === filterMarque;
    return matchSearch && matchStatut && matchMarque;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';
  };

  // Handlers
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (vehicle) => {
    setForm({ ...vehicle });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenView(true);
  };

  const handleSave = () => {
    if (editMode) {
      setVehicles(prev => prev.map(v => v.id === form.id ? { ...form, prix: Number(form.prix) } : v));
    } else {
      const newVehicle = {
        ...form,
        id: vehicles.length + 1,
        prix: Number(form.prix)
      };
      setVehicles(prev => [...prev, newVehicle]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter(v => v.statut === 'disponible').length,
    vendu: vehicles.filter(v => v.statut === 'vendu').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestion des Véhicules</h1>
          <p className="text-xs text-gray-400 mt-0.5">Inventaire et gestion du parc automobile</p>
        </div>
        {canManage && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white
              text-xs font-medium rounded-lg transition-colors self-start"
          >
            <Add fontSize="small" />
            Ajouter un véhicule
          </button>
        )}
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-green-600">{stats.disponible}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Disponibles</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-red-500">{stats.vendu}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Vendus</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher marque, modèle, couleur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                placeholder:text-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="vendu">Vendu</option>
            </select>
            <select
              value={filterMarque}
              onChange={(e) => setFilterMarque(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Toutes marques</option>
              {marques.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Image */}
            <div className="relative h-[140px] overflow-hidden">
              <img
                src={vehicle.image}
                alt={`${vehicle.marque} ${vehicle.modele}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                    ${vehicle.statut === 'disponible'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                >
                  {vehicle.statut === 'disponible' ? 'Disponible' : 'Vendu'}
                </span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleView(vehicle)}
                  className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center
                    hover:bg-white shadow-sm"
                >
                  <Visibility sx={{ fontSize: 14, color: '#1976D2' }} />
                </button>
                {canManage && (
                  <>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center
                        hover:bg-white shadow-sm"
                    >
                      <Edit sx={{ fontSize: 14, color: '#ff9800' }} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(vehicle.id)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center
                        hover:bg-white shadow-sm"
                    >
                      <Delete sx={{ fontSize: 14, color: '#f44336' }} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-800">
                {vehicle.marque} {vehicle.modele}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <CalendarMonth sx={{ fontSize: 12 }} />
                  <span className="text-[10px]">{vehicle.annee}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <LocalGasStation sx={{ fontSize: 12 }} />
                  <span className="text-[10px]">{vehicle.carburant}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Settings sx={{ fontSize: 12 }} />
                  <span className="text-[10px]">{vehicle.transmission}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <Speed sx={{ fontSize: 12 }} />
                  <span className="text-[10px]">{vehicle.kilometrage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <ColorLens sx={{ fontSize: 12 }} />
                  <span className="text-[10px]">{vehicle.couleur}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-base font-bold text-[#1976D2]">
                  {formatPrice(vehicle.prix)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <DirectionsCar sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="text-sm text-gray-400 mt-3">Aucun véhicule trouvé</p>
        </div>
      )}

      {/* ==================== MODAL : AJOUTER / MODIFIER ==================== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-sm font-bold text-gray-800">
            {editMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative h-[120px] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={form.image}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop'; }}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">URL Image</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Marque</label>
                <input
                  type="text"
                  value={form.marque}
                  onChange={(e) => handleChange('marque', e.target.value)}
                  placeholder="Toyota"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Modèle</label>
                <input
                  type="text"
                  value={form.modele}
                  onChange={(e) => handleChange('modele', e.target.value)}
                  placeholder="Corolla"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Année</label>
                <input
                  type="number"
                  value={form.annee}
                  onChange={(e) => handleChange('annee', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Prix (CFA)</label>
                <input
                  type="number"
                  value={form.prix}
                  onChange={(e) => handleChange('prix', e.target.value)}
                  placeholder="3200000"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Couleur</label>
                <input
                  type="text"
                  value={form.couleur}
                  onChange={(e) => handleChange('couleur', e.target.value)}
                  placeholder="Blanc"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Kilométrage</label>
                <input
                  type="number"
                  value={form.kilometrage}
                  onChange={(e) => handleChange('kilometrage', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Carburant</label>
                <select
                  value={form.carburant}
                  onChange={(e) => handleChange('carburant', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Transmission</label>
                <select
                  value={form.transmission}
                  onChange={(e) => handleChange('transmission', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendu">Vendu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du véhicule..."
                rows={2}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button
            onClick={() => setOpenForm(false)}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-lg transition-colors"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ==================== MODAL : VOIR DÉTAILS ==================== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedVehicle && (
          <>
            <div className="relative h-[200px]">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.modele}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <IconButton
                  onClick={() => setOpenView(false)}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                  size="small"
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
              <div className="absolute bottom-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${selectedVehicle.statut === 'disponible'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    }`}
                >
                  {selectedVehicle.statut === 'disponible' ? '✓ Disponible' : '✗ Vendu'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedVehicle.marque} {selectedVehicle.modele}
              </h2>
              <p className="text-xl font-bold text-[#1976D2] mt-1">
                {formatPrice(selectedVehicle.prix)}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <CalendarMonth sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Année</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.annee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Speed sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Kilométrage</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.kilometrage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <LocalGasStation sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Carburant</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.carburant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Settings sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Transmission</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <ColorLens sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Couleur</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.couleur}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <DirectionsCar sx={{ fontSize: 16, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Marque</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedVehicle.marque}</p>
                  </div>
                </div>
              </div>

              {selectedVehicle.description && (
                <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
                  <p className="text-[10px] font-medium text-gray-400 mb-1">Description</p>
                  <p className="text-xs text-gray-600">{selectedVehicle.description}</p>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>

      {/* ==================== MODAL : CONFIRMER SUPPRESSION ==================== */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="p-5 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="text-sm font-bold text-gray-800 mt-3">Supprimer ce véhicule ?</h3>
          <p className="text-xs text-gray-400 mt-1">Cette action est irréversible.</p>
          <div className="flex gap-2 mt-5 justify-center">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Vehicles;