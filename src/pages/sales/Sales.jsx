import { useState } from 'react';
import {
  Add,
  Search,
  Visibility,
  Close,
  ShoppingCart,
  CheckCircle,
  HourglassEmpty,
  Receipt,
  Person,
  DirectionsCar,
  CalendarMonth,
  Payment,
  AccountBalance,
  CreditCard,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { canDo } from '../../utils/roles';
import { mockSales, mockClients, mockVehicles, mockEmployees } from '../../data/mockData';

const Sales = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageSales');

  const [sales, setSales] = useState(mockSales);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPaiement, setFilterPaiement] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const availableVehicles = mockVehicles.filter((v) => v.statut === 'disponible');
  const vendeurs = mockEmployees.filter((e) =>
    e.departement === 'Ventes' || e.departement === 'Commercial'
  );

  const emptyForm = {
    clientId: '',
    clientName: '',
    vehicleId: '',
    vehicleName: '',
    vendeurId: '',
    vendeurName: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    statut: 'en_cours',
    paiement: {
      methode: 'Virement',
      statut: 'en attente',
      montantPaye: 0,
      reste: 0,
    },
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  // Filtrage
  const filtered = sales.filter((s) => {
    const matchSearch = `${s.clientName} ${s.vehicleName} ${s.vendeurName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || s.statut === filterStatut;
    const matchPaiement = filterPaiement === 'tous' || s.paiement.statut === filterPaiement;
    return matchSearch && matchStatut && matchPaiement;
  });

  // Stats
  const stats = {
    total: sales.length,
    completees: sales.filter((s) => s.statut === 'completee').length,
    enCours: sales.filter((s) => s.statut === 'en_cours').length,
    revenus: sales.reduce((sum, s) => sum + s.montant, 0),
    paye: sales.reduce((sum, s) => sum + s.paiement.montantPaye, 0),
    reste: sales.reduce((sum, s) => sum + s.paiement.reste, 0),
  };

  // Handlers
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleView = (sale) => {
    setSelectedSale(sale);
    setOpenView(true);
  };

  const handleEdit = (sale) => {
    setForm({ ...sale });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleSave = () => {
    const selectedClient = mockClients.find((c) => c.id === Number(form.clientId));
    const selectedVehicle = mockVehicles.find((v) => v.id === Number(form.vehicleId));
    const selectedVendeur = mockEmployees.find((e) => e.id === Number(form.vendeurId));

    const montant = Number(form.montant) || (selectedVehicle?.prix || 0);
    const montantPaye = Number(form.paiement.montantPaye) || 0;

    const saleData = {
      ...form,
      clientId: Number(form.clientId),
      clientName: selectedClient?.name || form.clientName,
      vehicleId: Number(form.vehicleId),
      vehicleName: selectedVehicle
        ? `${selectedVehicle.marque} ${selectedVehicle.modele} ${selectedVehicle.annee}`
        : form.vehicleName,
      vendeurId: Number(form.vendeurId),
      vendeurName: selectedVendeur?.name || form.vendeurName,
      montant,
      paiement: {
        ...form.paiement,
        montantPaye,
        reste: montant - montantPaye,
        statut: montantPaye >= montant ? 'payé' : 'en attente',
      },
      statut: montantPaye >= montant ? 'completee' : 'en_cours',
    };

    if (editMode) {
      setSales((prev) => prev.map((s) => (s.id === form.id ? { ...saleData } : s)));
    } else {
      setSales((prev) => [...prev, { ...saleData, id: prev.length + 1 }]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    if (field.startsWith('paiement.')) {
      const key = field.split('.')[1];
      setForm((prev) => ({
        ...prev,
        paiement: { ...prev.paiement, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));

      // Auto-fill montant quand on choisit un véhicule
      if (field === 'vehicleId') {
        const v = mockVehicles.find((v) => v.id === Number(value));
        if (v) {
          setForm((prev) => ({ ...prev, montant: v.prix }));
        }
      }
    }
  };

  const getPaymentIcon = (methode) => {
    switch (methode) {
      case 'Virement':
        return <AccountBalance sx={{ fontSize: 14 }} />;
      case 'Chèque':
        return <Receipt sx={{ fontSize: 14 }} />;
      case 'Crédit':
        return <CreditCard sx={{ fontSize: 14 }} />;
      default:
        return <Payment sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestion des Ventes</h1>
          <p className="text-xs text-gray-400 mt-0.5">Suivi des ventes et paiements</p>
        </div>
        {canManage && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white
              text-xs font-medium rounded-lg transition-colors self-start"
          >
            <Add fontSize="small" />
            Nouvelle vente
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total ventes</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{stats.total}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Complétées</p>
              <p className="text-xl font-bold text-green-600 mt-0.5">{stats.completees}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Montant reçu</p>
              <p className="text-lg font-bold text-[#1976D2] mt-0.5">{formatPrice(stats.paye)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Payment sx={{ fontSize: 18, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reste à payer</p>
              <p className="text-lg font-bold text-orange-500 mt-0.5">{formatPrice(stats.reste)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <HourglassEmpty sx={{ fontSize: 18, color: '#ff9800' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher client, véhicule, vendeur..."
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
              <option value="completee">Complétée</option>
              <option value="en_cours">En cours</option>
            </select>
            <select
              value={filterPaiement}
              onChange={(e) => setFilterPaiement(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
            >
              <option value="tous">Tous paiements</option>
              <option value="payé">Payé</option>
              <option value="en attente">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-2">
        {filtered.map((sale) => (
          <div
            key={sale.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Left : sale info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${sale.statut === 'completee' ? 'bg-green-100' : 'bg-orange-100'}`}
                >
                  {sale.statut === 'completee' ? (
                    <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                  ) : (
                    <HourglassEmpty sx={{ fontSize: 20, color: '#ff9800' }} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-800">{sale.vehicleName}</h3>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold
                        ${sale.statut === 'completee'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                        }`}
                    >
                      {sale.statut === 'completee' ? 'Complétée' : 'En cours'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Person sx={{ fontSize: 11 }} />
                      <span className="text-[11px]">{sale.clientName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <CalendarMonth sx={{ fontSize: 11 }} />
                      <span className="text-[11px]">{sale.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      {getPaymentIcon(sale.paiement.methode)}
                      <span className="text-[11px]">{sale.paiement.methode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle : payment progress */}
              <div className="flex-shrink-0 w-full md:w-[200px]">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400">
                    Payé : {formatPrice(sale.paiement.montantPaye)}
                  </span>
                  <span
                    className={`font-medium ${sale.paiement.statut === 'payé' ? 'text-green-500' : 'text-orange-500'}`}
                  >
                    {sale.paiement.statut === 'payé'
                      ? '✓ Payé'
                      : `Reste : ${formatPrice(sale.paiement.reste)}`}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sale.paiement.statut === 'payé' ? 'bg-green-500' : 'bg-[#1976D2]'
                    }`}
                    style={{
                      width: `${(sale.paiement.montantPaye / sale.montant) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Right : amount + actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-base font-bold text-gray-800">{formatPrice(sale.montant)}</p>
                  <p className="text-[10px] text-gray-400">Vendeur : {sale.vendeurName}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(sale)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-[#1976D2] transition-colors"
                  >
                    <Visibility sx={{ fontSize: 16 }} />
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleEdit(sale)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sale.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <ShoppingCart sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="text-sm text-gray-400 mt-3">Aucune vente trouvée</p>
        </div>
      )}

      {/* ==================== MODAL : NOUVELLE VENTE / MODIFIER ==================== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-sm font-bold text-gray-800">
            {editMode ? 'Modifier la vente' : 'Nouvelle vente'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="space-y-3">
            {/* Client */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Client</label>
              <select
                value={form.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="">-- Sélectionner un client --</option>
                {mockClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Véhicule */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Véhicule</label>
              <select
                value={form.vehicleId}
                onChange={(e) => handleChange('vehicleId', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="">-- Sélectionner un véhicule --</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marque} {v.modele} {v.annee} - {formatPrice(v.prix)}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendeur */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Vendeur</label>
              <select
                value={form.vendeurId}
                onChange={(e) => handleChange('vendeurId', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="">-- Sélectionner un vendeur --</option>
                {vendeurs.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} - {v.poste}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Montant */}
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Montant (CFA)</label>
                <input
                  type="number"
                  value={form.montant}
                  onChange={(e) => handleChange('montant', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              {/* Date */}
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Paiement */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-3">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Informations paiement
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 mb-1 block">Méthode</label>
                  <select
                    value={form.paiement.methode}
                    onChange={(e) => handleChange('paiement.methode', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Virement">Virement</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Crédit">Crédit</option>
                    <option value="Espèces">Espèces</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 mb-1 block">Montant payé (CFA)</label>
                  <input
                    type="number"
                    value={form.paiement.montantPaye}
                    onChange={(e) => handleChange('paiement.montantPaye', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              {form.montant && form.paiement.montantPaye && (
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-200">
                  <span className="text-gray-400">Reste à payer :</span>
                  <span className="font-bold text-orange-500">
                    {formatPrice(Number(form.montant) - Number(form.paiement.montantPaye))}
                  </span>
                </div>
              )}
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
            {editMode ? 'Modifier' : 'Enregistrer'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ==================== MODAL : DÉTAILS VENTE ==================== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedSale && (
          <>
            <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-sm font-bold text-gray-800">Détails de la vente #{selectedSale.id}</span>
              <IconButton onClick={() => setOpenView(false)} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: '16px !important' }}>
              {/* Statut */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full
                    ${selectedSale.statut === 'completee'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                    }`}
                >
                  {selectedSale.statut === 'completee' ? (
                    <CheckCircle sx={{ fontSize: 18 }} />
                  ) : (
                    <HourglassEmpty sx={{ fontSize: 18 }} />
                  )}
                  <span className="text-xs font-bold">
                    {selectedSale.statut === 'completee' ? 'Vente complétée' : 'Vente en cours'}
                  </span>
                </div>
              </div>

              {/* Montant principal */}
              <div className="text-center mb-5">
                <p className="text-2xl font-bold text-gray-800">{formatPrice(selectedSale.montant)}</p>
                <p className="text-[10px] text-gray-400 mt-1">{selectedSale.date}</p>
              </div>

              {/* Infos */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DirectionsCar sx={{ fontSize: 18, color: '#1976D2' }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Véhicule</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedSale.vehicleName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Person sx={{ fontSize: 18, color: '#9c27b0' }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Client</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedSale.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Person sx={{ fontSize: 18, color: '#ff9800' }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Vendeur</p>
                    <p className="text-xs font-semibold text-gray-700">{selectedSale.vendeurName}</p>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="p-4 border border-gray-100 rounded-xl">
                <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <Payment sx={{ fontSize: 14 }} />
                  Détails du paiement
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400">Méthode</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {getPaymentIcon(selectedSale.paiement.methode)}
                      <p className="text-xs font-semibold text-gray-700">{selectedSale.paiement.methode}</p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400">Statut</p>
                    <p
                      className={`text-xs font-bold mt-1
                        ${selectedSale.paiement.statut === 'payé' ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      {selectedSale.paiement.statut === 'payé' ? '✓ Payé' : '⏳ En attente'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Montant total</span>
                    <span className="font-bold text-gray-800">{formatPrice(selectedSale.montant)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Montant payé</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(selectedSale.paiement.montantPaye)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Reste à payer</span>
                    <span className="font-bold text-orange-500">
                      {formatPrice(selectedSale.paiement.reste)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>
                      {Math.round(
                        (selectedSale.paiement.montantPaye / selectedSale.montant) * 100
                      )}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedSale.paiement.statut === 'payé'
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-[#1976D2] to-[#42A5F5]'
                      }`}
                      style={{
                        width: `${(selectedSale.paiement.montantPaye / selectedSale.montant) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
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
          <h3 className="text-sm font-bold text-gray-800 mt-3">Supprimer cette vente ?</h3>
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

export default Sales;