import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Close,
  People,
  Visibility,
  Phone,
  Email,
  LocationOn,
  ShoppingCart,
  Business,
  Person,
  CalendarMonth,
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { canDo } from '../../utils/roles';
import { mockClients, mockSales, mockVehicles } from '../../data/mockData';

const Clients = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageClients');

  const [clients, setClients] = useState(mockClients);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    name: '',
    telephone: '',
    email: '',
    adresse: '',
    type: 'Particulier',
    achats: [],
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  // Filtrage
  const filtered = clients.filter((c) => {
    const matchSearch = `${c.name} ${c.email} ${c.telephone} ${c.adresse}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = filterType === 'tous' || c.type === filterType;
    return matchSearch && matchType;
  });

  // Récupérer les ventes d'un client
  const getClientSales = (clientId) => {
    return mockSales.filter((s) => s.clientId === clientId);
  };

  // Récupérer le total dépensé
  const getClientTotal = (clientId) => {
    return getClientSales(clientId).reduce((sum, s) => sum + s.montant, 0);
  };

  // Handlers
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (client) => {
    setForm({ ...client });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setOpenView(true);
  };

  const handleSave = () => {
    if (editMode) {
      setClients((prev) => prev.map((c) => (c.id === form.id ? { ...form } : c)));
    } else {
      const newClient = {
        ...form,
        id: clients.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [...prev, newClient]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = {
    total: clients.length,
    particulier: clients.filter((c) => c.type === 'Particulier').length,
    entreprise: clients.filter((c) => c.type === 'Entreprise').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestion des Clients</h1>
          <p className="text-xs text-gray-400 mt-0.5">Base de données clients</p>
        </div>
        {canManage && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1976D2] hover:bg-[#1565C0] text-white
              text-xs font-medium rounded-lg transition-colors self-start"
          >
            <Add fontSize="small" />
            Ajouter un client
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Total clients</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-[#1976D2]">{stats.particulier}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Particuliers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-bold text-purple-600">{stats.entreprise}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Entreprises</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Rechercher nom, email, téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                placeholder:text-gray-300"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-600"
          >
            <option value="tous">Tous types</option>
            <option value="Particulier">Particulier</option>
            <option value="Entreprise">Entreprise</option>
          </select>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-2">
        {filtered.map((client) => {
          const clientSales = getClientSales(client.id);
          const totalSpent = getClientTotal(client.id);

          return (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: client.type === 'Entreprise' ? '#9c27b0' : '#1976D2',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {client.type === 'Entreprise' ? (
                    <Business sx={{ fontSize: 20 }} />
                  ) : (
                    getInitials(client.name)
                  )}
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{client.name}</h3>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold
                        ${client.type === 'Entreprise'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {client.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Phone sx={{ fontSize: 11 }} />
                      <span className="text-[11px]">{client.telephone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Email sx={{ fontSize: 11 }} />
                      <span className="text-[11px]">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <LocationOn sx={{ fontSize: 11 }} />
                      <span className="text-[11px]">{client.adresse}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{clientSales.length}</p>
                    <p className="text-[9px] text-gray-400">Achats</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1976D2]">
                      {totalSpent > 0 ? formatPrice(totalSpent) : '-'}
                    </p>
                    <p className="text-[9px] text-gray-400">Total</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(client)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-[#1976D2] transition-colors"
                  >
                    <Visibility sx={{ fontSize: 16 }} />
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleEdit(client)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(client.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <People sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="text-sm text-gray-400 mt-3">Aucun client trouvé</p>
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
            {editMode ? 'Modifier le client' : 'Ajouter un client'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Nom complet / Raison sociale</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Mohamed Cherif"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="0555 12 34 56"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="nom@email.com"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="Alger Centre"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">Type de client</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
              </select>
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

      {/* ==================== MODAL : VOIR DÉTAILS + HISTORIQUE ==================== */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedClient && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-sm font-bold text-gray-800">Fiche client</span>
              <IconButton onClick={() => setOpenView(false)} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Client Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: selectedClient.type === 'Entreprise' ? '#9c27b0' : '#1976D2',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {selectedClient.type === 'Entreprise' ? (
                    <Business sx={{ fontSize: 24 }} />
                  ) : (
                    getInitials(selectedClient.name)
                  )}
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{selectedClient.name}</h3>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold
                      ${selectedClient.type === 'Entreprise'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {selectedClient.type}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 gap-2 mb-5">
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Phone sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Téléphone</p>
                    <p className="text-xs font-medium text-gray-700">{selectedClient.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <Email sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-xs font-medium text-gray-700">{selectedClient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <LocationOn sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Adresse</p>
                    <p className="text-xs font-medium text-gray-700">{selectedClient.adresse}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <CalendarMonth sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="text-[10px] text-gray-400">Client depuis</p>
                    <p className="text-xs font-medium text-gray-700">{selectedClient.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Historique achats */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <ShoppingCart sx={{ fontSize: 14 }} />
                  Historique des achats
                </h4>

                {getClientSales(selectedClient.id).length > 0 ? (
                  <div className="space-y-2">
                    {getClientSales(selectedClient.id).map((sale) => (
                      <div key={sale.id} className="p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-gray-700">{sale.vehicleName}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {sale.date} • Vendeur : {sale.vendeurName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#1976D2]">{formatPrice(sale.montant)}</p>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded
                                ${sale.paiement.statut === 'payé'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {sale.paiement.statut === 'payé' ? '✓ Payé' : '⏳ En attente'}
                            </span>
                          </div>
                        </div>
                        {sale.paiement.statut !== 'payé' && (
                          <div className="mt-2 pt-2 border-t border-gray-50">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-gray-400">Payé : {formatPrice(sale.paiement.montantPaye)}</span>
                              <span className="text-red-500 font-medium">Reste : {formatPrice(sale.paiement.reste)}</span>
                            </div>
                            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1976D2] rounded-full"
                                style={{ width: `${(sale.paiement.montantPaye / sale.montant) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="p-2 bg-blue-50/50 rounded-lg text-center">
                      <p className="text-[10px] text-gray-400">Total dépensé</p>
                      <p className="text-sm font-bold text-[#1976D2]">
                        {formatPrice(getClientTotal(selectedClient.id))}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-lg">
                    <ShoppingCart sx={{ fontSize: 24, color: '#e0e0e0' }} />
                    <p className="text-[11px] text-gray-400 mt-2">Aucun achat enregistré</p>
                  </div>
                )}
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
          <h3 className="text-sm font-bold text-gray-800 mt-3">Supprimer ce client ?</h3>
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

export default Clients;