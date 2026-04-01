// src/pages/clients/Clients.jsx
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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { canDo } from '../../../utils/roles';
import { mockClients, mockSales } from '../../../data/mockData';
import '../../../styles/clients.css';

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

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  // ─── Filtrage ───
  const filtered = clients.filter((c) => {
    const matchSearch = `${c.name} ${c.email} ${c.telephone} ${c.adresse}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = filterType === 'tous' || c.type === filterType;
    return matchSearch && matchType;
  });

  const getClientSales = (clientId) =>
    mockSales.filter((s) => s.clientId === clientId);

  const getClientTotal = (clientId) =>
    getClientSales(clientId).reduce((sum, s) => sum + s.montant, 0);

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  // ─── Handlers ───
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
      setClients((prev) =>
        prev.map((c) => (c.id === form.id ? { ...form } : c))
      );
    } else {
      const newClient = {
        ...form,
        id: clients.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'actif',
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

  const stats = {
    total: clients.length,
    particulier: clients.filter((c) => c.type === 'Particulier').length,
    entreprise: clients.filter((c) => c.type === 'Entreprise').length,
  };

  return (
    <div className="clients-page">
      {/* ═══ Header ═══ */}
      <div className="cli-header">
        <div>
          <h1 className="cli-header-title">Gestion des Clients</h1>
          <p className="cli-header-subtitle">Base de données clients</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="cli-add-btn">
            <Add fontSize="small" />
            Ajouter un client
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="cli-stats-grid">
        <div className="cli-stat-card">
          <p className="cli-stat-value" style={{ color: '#1e293b' }}>
            {stats.total}
          </p>
          <p className="cli-stat-label">Total clients</p>
        </div>
        <div className="cli-stat-card">
          <p className="cli-stat-value" style={{ color: '#1976D2' }}>
            {stats.particulier}
          </p>
          <p className="cli-stat-label">Particuliers</p>
        </div>
        <div className="cli-stat-card">
          <p className="cli-stat-value" style={{ color: '#7c3aed' }}>
            {stats.entreprise}
          </p>
          <p className="cli-stat-label">Entreprises</p>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="cli-filters">
        <div className="cli-filters-row">
          <div className="cli-search-wrapper">
            <Search fontSize="small" className="cli-search-icon" />
            <input
              type="text"
              placeholder="Rechercher nom, email, téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cli-search-input"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cli-select"
          >
            <option value="tous">Tous types</option>
            <option value="Particulier">Particulier</option>
            <option value="Entreprise">Entreprise</option>
          </select>
        </div>
      </div>

      {/* ═══ Clients List ═══ */}
      <div className="cli-list">
        {filtered.map((client) => {
          const clientSales = getClientSales(client.id);
          const totalSpent = getClientTotal(client.id);

          return (
            <div key={client.id} className="cli-card">
              <div className="cli-card-row">
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor:
                      client.type === 'Entreprise'
                        ? '#9c27b0'
                        : '#1976D2',
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
                <div className="cli-card-info">
                  <div className="cli-card-name-row">
                    <h3 className="cli-card-name">{client.name}</h3>
                    <span
                      className={`cli-type-badge ${
                        client.type === 'Entreprise'
                          ? 'cli-type-entreprise'
                          : 'cli-type-particulier'
                      }`}
                    >
                      {client.type}
                    </span>
                  </div>
                  <div className="cli-card-contacts">
                    <div className="cli-contact-item">
                      <Phone sx={{ fontSize: 11 }} />
                      <span className="cli-contact-text">
                        {client.telephone}
                      </span>
                    </div>
                    <div className="cli-contact-item">
                      <Email sx={{ fontSize: 11 }} />
                      <span className="cli-contact-text">
                        {client.email}
                      </span>
                    </div>
                    <div className="cli-contact-item">
                      <LocationOn sx={{ fontSize: 11 }} />
                      <span className="cli-contact-text">
                        {client.adresse}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="cli-card-stats">
                  <div className="cli-card-stat">
                    <p
                      className="cli-card-stat-value"
                      style={{ color: '#1e293b' }}
                    >
                      {clientSales.length}
                    </p>
                    <p className="cli-card-stat-label">Achats</p>
                  </div>
                  <div className="cli-card-stat">
                    <p
                      className="cli-card-stat-value"
                      style={{ color: '#1976D2' }}
                    >
                      {totalSpent > 0 ? formatPrice(totalSpent) : '-'}
                    </p>
                    <p className="cli-card-stat-label">Total</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="cli-card-actions">
                  <button
                    onClick={() => handleView(client)}
                    className="cli-action-btn cli-action-view"
                    title="Voir"
                  >
                    <Visibility sx={{ fontSize: 16 }} />
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleEdit(client)}
                        className="cli-action-btn cli-action-edit"
                        title="Modifier"
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(client.id)}
                        className="cli-action-btn cli-action-delete"
                        title="Supprimer"
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
        <div className="cli-empty">
          <People sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="cli-empty-text">Aucun client trouvé</p>
        </div>
      )}

      {/* ═══ MODAL : AJOUTER / MODIFIER ═══ */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            className="cli-header-title"
            style={{ fontSize: '0.875rem' }}
          >
            {editMode ? 'Modifier le client' : 'Ajouter un client'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="cli-form-fields">
            <div>
              <label className="cli-form-label">
                Nom complet / Raison sociale
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Mohamed Cherif"
                className="cli-form-input"
              />
            </div>

            <div className="cli-form-grid-2">
              <div>
                <label className="cli-form-label">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) =>
                    handleChange('telephone', e.target.value)
                  }
                  placeholder="0555 12 34 56"
                  className="cli-form-input"
                />
              </div>
              <div>
                <label className="cli-form-label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="nom@email.com"
                  className="cli-form-input"
                />
              </div>
            </div>

            <div>
              <label className="cli-form-label">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                placeholder="Alger Centre"
                className="cli-form-input"
              />
            </div>

            <div>
              <label className="cli-form-label">Type de client</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="cli-form-select"
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
            className="cli-modal-btn cli-modal-btn-cancel"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="cli-modal-btn cli-modal-btn-primary"
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VOIR DÉTAILS ═══ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedClient && (
          <>
            <DialogTitle
              sx={{
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="cli-header-title"
                style={{ fontSize: '0.875rem' }}
              >
                Fiche client
              </span>
              <IconButton
                onClick={() => setOpenView(false)}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Header */}
              <div className="cli-view-header">
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor:
                      selectedClient.type === 'Entreprise'
                        ? '#9c27b0'
                        : '#1976D2',
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
                  <h3 className="cli-view-name">{selectedClient.name}</h3>
                  <span
                    className={`cli-type-badge ${
                      selectedClient.type === 'Entreprise'
                        ? 'cli-type-entreprise'
                        : 'cli-type-particulier'
                    }`}
                  >
                    {selectedClient.type}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="cli-view-fields">
                <div className="cli-view-field">
                  <Phone sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="cli-view-field-label">Téléphone</p>
                    <p className="cli-view-field-value">
                      {selectedClient.telephone}
                    </p>
                  </div>
                </div>
                <div className="cli-view-field">
                  <Email sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="cli-view-field-label">Email</p>
                    <p className="cli-view-field-value">
                      {selectedClient.email}
                    </p>
                  </div>
                </div>
                <div className="cli-view-field">
                  <LocationOn sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  <div>
                    <p className="cli-view-field-label">Adresse</p>
                    <p className="cli-view-field-value">
                      {selectedClient.adresse}
                    </p>
                  </div>
                </div>
                <div className="cli-view-field">
                  <CalendarMonth
                    sx={{ fontSize: 14, color: '#9e9e9e' }}
                  />
                  <div>
                    <p className="cli-view-field-label">Client depuis</p>
                    <p className="cli-view-field-value">
                      {selectedClient.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Historique achats */}
              <div>
                <h4 className="cli-history-title">
                  <ShoppingCart sx={{ fontSize: 14 }} />
                  Historique des achats
                </h4>

                {getClientSales(selectedClient.id).length > 0 ? (
                  <div className="cli-history-list">
                    {getClientSales(selectedClient.id).map((sale) => (
                      <div key={sale.id} className="cli-history-item">
                        <div className="cli-history-row">
                          <div>
                            <p className="cli-history-vehicle">
                              {sale.vehicleName}
                            </p>
                            <p className="cli-history-meta">
                              {sale.date} • Vendeur : {sale.vendeurName}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p className="cli-history-amount">
                              {formatPrice(sale.montant)}
                            </p>
                            <span
                              className={`cli-payment-badge ${
                                sale.paiement.statut === 'payé'
                                  ? 'cli-payment-paid'
                                  : 'cli-payment-pending'
                              }`}
                            >
                              {sale.paiement.statut === 'payé'
                                ? '✓ Payé'
                                : '⏳ En attente'}
                            </span>
                          </div>
                        </div>
                        {sale.paiement.statut !== 'payé' && (
                          <div className="cli-payment-detail">
                            <div className="cli-payment-row">
                              <span className="cli-payment-paid-text">
                                Payé :{' '}
                                {formatPrice(sale.paiement.montantPaye)}
                              </span>
                              <span className="cli-payment-rest-text">
                                Reste :{' '}
                                {formatPrice(sale.paiement.reste)}
                              </span>
                            </div>
                            <div className="cli-payment-bar">
                              <div
                                className="cli-payment-bar-fill"
                                style={{
                                  width: `${
                                    (sale.paiement.montantPaye /
                                      sale.montant) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="cli-total-box">
                      <p className="cli-total-label">Total dépensé</p>
                      <p className="cli-total-value">
                        {formatPrice(
                          getClientTotal(selectedClient.id)
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="cli-history-empty">
                    <ShoppingCart
                      sx={{ fontSize: 24, color: '#e0e0e0' }}
                    />
                    <p className="cli-history-empty-text">
                      Aucun achat enregistré
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ═══ MODAL : SUPPRESSION ═══ */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="cli-delete-modal">
          <div className="cli-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="cli-delete-title">Supprimer ce client ?</h3>
          <p className="cli-delete-text">
            Cette action est irréversible.
          </p>
          <div className="cli-delete-actions">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="cli-modal-btn cli-modal-btn-cancel"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="cli-modal-btn cli-modal-btn-danger"
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