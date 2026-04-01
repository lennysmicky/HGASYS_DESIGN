import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Close,
  RequestQuote,
  Person,
  DirectionsCar,
  CalendarMonth,
  AttachMoney,
  Badge,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  NoteAlt,
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
import {
  mockQuotes,
  mockClients,
  mockVehicles,
  mockUsers,
} from '../../../data/mockData';
import '../../../styles/quotes.css';

const Quotes = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageQuotes');

  const [quotes, setQuotes] = useState(mockQuotes);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const vendeurs = mockUsers.filter(
    (u) => u.role === 'commercial' || u.role === 'manager' || u.role === 'admin'
  );

  const emptyForm = {
    clientId: '',
    clientName: '',
    vehicleId: '',
    vehicleName: '',
    vendeurId: '',
    vendeurName: '',
    montant: '',
    remise: 0,
    montantFinal: '',
    date: new Date().toISOString().split('T')[0],
    validite: '',
    statut: 'en_attente',
    notes: '',
  };

  const [form, setForm] = useState(emptyForm);

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

  const getStatusConfig = (statut) => {
    const configs = {
      en_attente: { label: 'En attente', className: 'qt-status-en_attente', icon: <HourglassEmpty sx={{ fontSize: 10 }} /> },
      accepte: { label: 'Accepté', className: 'qt-status-accepte', icon: <CheckCircle sx={{ fontSize: 10 }} /> },
      refuse: { label: 'Refusé', className: 'qt-status-refuse', icon: <Cancel sx={{ fontSize: 10 }} /> },
      expire: { label: 'Expiré', className: 'qt-status-expire', icon: <HourglassEmpty sx={{ fontSize: 10 }} /> },
    };
    return configs[statut] || configs.en_attente;
  };

  const isExpired = (validite) => {
    if (!validite) return false;
    return new Date(validite) < new Date();
  };

  // Filtrage
  const filtered = quotes.filter((q) => {
    const matchSearch = `${q.numero} ${q.clientName} ${q.vehicleName} ${q.vendeurName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const effectiveStatut = isExpired(q.validite) && q.statut === 'en_attente' ? 'expire' : q.statut;
    const matchStatut = filterStatut === 'tous' || effectiveStatut === filterStatut;
    return matchSearch && matchStatut;
  });

  // Stats
  const stats = {
    total: quotes.length,
    enAttente: quotes.filter((q) => q.statut === 'en_attente').length,
    acceptes: quotes.filter((q) => q.statut === 'accepte').length,
    refuses: quotes.filter((q) => q.statut === 'refuse').length,
  };

  // Handlers
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (quote) => {
    setForm({ ...quote });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (quote) => {
    setSelectedQuote(quote);
    setOpenView(true);
  };

  const handleSave = () => {
    const client = mockClients.find((c) => c.id === Number(form.clientId));
    const vehicle = mockVehicles.find((v) => v.id === Number(form.vehicleId));
    const vendeur = vendeurs.find((v) => v.id === Number(form.vendeurId));
    const montant = Number(form.montant) || 0;
    const remise = Number(form.remise) || 0;

    if (editMode) {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === form.id
            ? {
                ...form,
                montant,
                remise,
                montantFinal: montant - remise,
                clientName: client?.name || form.clientName,
                vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : form.vehicleName,
                vendeurName: vendeur?.name || form.vendeurName,
              }
            : q
        )
      );
    } else {
      const newQuote = {
        ...form,
        id: quotes.length + 1,
        numero: `DEV-2024-${String(quotes.length + 1).padStart(3, '0')}`,
        clientId: Number(form.clientId),
        vehicleId: Number(form.vehicleId),
        vendeurId: Number(form.vendeurId),
        montant,
        remise,
        montantFinal: montant - remise,
        clientName: client?.name || '',
        vehicleName: vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : '',
        vendeurName: vendeur?.name || '',
      };
      setQuotes((prev) => [...prev, newQuote]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="qt-page">
      {/* ═══ Header ═══ */}
      <div className="qt-header">
        <div>
          <h1 className="qt-header-title">Gestion des Devis</h1>
          <p className="qt-header-subtitle">Créer, suivre et gérer les devis clients</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="qt-add-btn">
            <Add fontSize="small" />
            Nouveau devis
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="qt-stats-grid">
        <div className="qt-stat-card">
          <div className="qt-stat-row">
            <div>
              <p className="qt-stat-label">Total</p>
              <p className="qt-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p>
            </div>
            <div className="qt-stat-icon" style={{ background: '#eff6ff' }}>
              <RequestQuote sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="qt-stat-card">
          <div className="qt-stat-row">
            <div>
              <p className="qt-stat-label">En attente</p>
              <p className="qt-stat-value" style={{ color: '#b45309' }}>{stats.enAttente}</p>
            </div>
            <div className="qt-stat-icon" style={{ background: '#fffbeb' }}>
              <HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} />
            </div>
          </div>
        </div>
        <div className="qt-stat-card">
          <div className="qt-stat-row">
            <div>
              <p className="qt-stat-label">Acceptés</p>
              <p className="qt-stat-value" style={{ color: '#16a34a' }}>{stats.acceptes}</p>
            </div>
            <div className="qt-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} />
            </div>
          </div>
        </div>
        <div className="qt-stat-card">
          <div className="qt-stat-row">
            <div>
              <p className="qt-stat-label">Refusés</p>
              <p className="qt-stat-value" style={{ color: '#ef4444' }}>{stats.refuses}</p>
            </div>
            <div className="qt-stat-icon" style={{ background: '#fef2f2' }}>
              <Cancel sx={{ fontSize: 22, color: '#ef4444' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="qt-filters">
        <div className="qt-filters-row">
          <div className="qt-search-wrapper">
            <Search fontSize="small" className="qt-search-icon" />
            <input
              type="text"
              placeholder="Rechercher n° devis, client, véhicule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="qt-search-input"
            />
          </div>
          <div className="qt-filter-selects">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="qt-select"
            >
              <option value="tous">Tous statuts</option>
              <option value="en_attente">En attente</option>
              <option value="accepte">Accepté</option>
              <option value="refuse">Refusé</option>
              <option value="expire">Expiré</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Table ═══ */}
      {filtered.length > 0 ? (
        <div className="qt-table-wrapper">
          <table className="qt-table">
            <thead>
              <tr>
                <th>N° Devis</th>
                <th>Client</th>
                <th>Véhicule</th>
                <th>Vendeur</th>
                <th>Montant</th>
                <th>Remise</th>
                <th>Total</th>
                <th>Date</th>
                <th>Validité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => {
                const effectiveStatut = isExpired(q.validite) && q.statut === 'en_attente' ? 'expire' : q.statut;
                const statusConfig = getStatusConfig(effectiveStatut);

                return (
                  <tr key={q.id}>
                    <td data-label="N° Devis">
                      <span className="qt-numero">{q.numero}</span>
                    </td>
                    <td data-label="Client">
                      <div className="qt-client-cell">
                        <span className="qt-client-name">{q.clientName}</span>
                      </div>
                    </td>
                    <td data-label="Véhicule">
                      <span className="qt-vehicle-name">{q.vehicleName}</span>
                    </td>
                    <td data-label="Vendeur">
                      <span className="qt-vendeur-name">{q.vendeurName}</span>
                    </td>
                    <td data-label="Montant">
                      <span className="qt-montant">{formatPrice(q.montant)}</span>
                    </td>
                    <td data-label="Remise">
                      {q.remise > 0 ? (
                        <span className="qt-montant-remise">-{formatPrice(q.remise)}</span>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.6875rem' }}>—</span>
                      )}
                    </td>
                    <td data-label="Total">
                      <span className="qt-montant-final">{formatPrice(q.montantFinal)}</span>
                    </td>
                    <td data-label="Date">
                      <span className="qt-date">{q.date}</span>
                    </td>
                    <td data-label="Validité">
                      <span className={`qt-validite ${isExpired(q.validite) ? 'qt-validite-expired' : 'qt-validite-active'}`}>
                        {q.validite}
                      </span>
                    </td>
                    <td data-label="Statut">
                      <span className={`qt-status-badge ${statusConfig.className}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="qt-actions">
                        <button onClick={() => handleView(q)} className="qt-action-btn qt-action-view" title="Voir">
                          <Visibility sx={{ fontSize: 15 }} />
                        </button>
                        {canManage && (
                          <>
                            <button onClick={() => handleEdit(q)} className="qt-action-btn qt-action-edit" title="Modifier">
                              <Edit sx={{ fontSize: 15 }} />
                            </button>
                            <button onClick={() => setDeleteConfirm(q.id)} className="qt-action-btn qt-action-delete" title="Supprimer">
                              <Delete sx={{ fontSize: 15 }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="qt-empty">
          <RequestQuote sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="qt-empty-text">Aucun devis trouvé</p>
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
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="qt-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? 'Modifier le devis' : 'Nouveau devis'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="qt-form-fields">
            <div>
              <label className="qt-form-label">Client</label>
              <select
                value={form.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className="qt-form-select"
              >
                <option value="">Sélectionner un client</option>
                {mockClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="qt-form-grid-2">
              <div>
                <label className="qt-form-label">Véhicule</label>
                <select
                  value={form.vehicleId}
                  onChange={(e) => handleChange('vehicleId', e.target.value)}
                  className="qt-form-select"
                >
                  <option value="">Sélectionner un véhicule</option>
                  {mockVehicles
                    .filter((v) => v.statut === 'disponible')
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.marque} {v.modele} {v.annee} — {formatPrice(v.prix)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="qt-form-label">Vendeur</label>
                <select
                  value={form.vendeurId}
                  onChange={(e) => handleChange('vendeurId', e.target.value)}
                  className="qt-form-select"
                >
                  <option value="">Sélectionner</option>
                  {vendeurs.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="qt-form-grid-3">
              <div>
                <label className="qt-form-label">Montant (CFA)</label>
                <input
                  type="number"
                  value={form.montant}
                  onChange={(e) => handleChange('montant', e.target.value)}
                  placeholder="4500000"
                  className="qt-form-input"
                />
              </div>
              <div>
                <label className="qt-form-label">Remise (CFA)</label>
                <input
                  type="number"
                  value={form.remise}
                  onChange={(e) => handleChange('remise', e.target.value)}
                  placeholder="0"
                  className="qt-form-input"
                />
              </div>
              <div>
                <label className="qt-form-label">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="qt-form-select"
                >
                  <option value="en_attente">En attente</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="qt-form-summary">
              <p className="qt-form-summary-label">Montant final</p>
              <p className="qt-form-summary-value">
                {formatPrice((Number(form.montant) || 0) - (Number(form.remise) || 0))}
              </p>
            </div>

            <div className="qt-form-grid-2">
              <div>
                <label className="qt-form-label">Date du devis</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="qt-form-input"
                />
              </div>
              <div>
                <label className="qt-form-label">Valide jusqu'au</label>
                <input
                  type="date"
                  value={form.validite}
                  onChange={(e) => handleChange('validite', e.target.value)}
                  className="qt-form-input"
                />
              </div>
            </div>

            <div>
              <label className="qt-form-label">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Remarques, conditions..."
                className="qt-form-textarea"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="qt-modal-btn qt-modal-btn-cancel">
            Annuler
          </button>
          <button onClick={handleSave} className="qt-modal-btn qt-modal-btn-primary">
            {editMode ? 'Modifier' : 'Créer le devis'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VOIR DEVIS ═══ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedQuote && (() => {
          const effectiveStatut = isExpired(selectedQuote.validite) && selectedQuote.statut === 'en_attente' ? 'expire' : selectedQuote.statut;
          const statusConfig = getStatusConfig(effectiveStatut);

          return (
            <>
              <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="qt-header-title" style={{ fontSize: '0.875rem' }}>Détails du devis</span>
                <IconButton onClick={() => setOpenView(false)} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <div className="qt-view-content">
                  {/* Header card */}
                  <div className="qt-view-header-card">
                    <div>
                      <h2 className="qt-view-numero">{selectedQuote.numero}</h2>
                      <p className="qt-view-date">Créé le {selectedQuote.date}</p>
                      <span className={`qt-status-badge ${statusConfig.className}`} style={{ marginTop: '0.375rem', display: 'inline-flex' }}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="qt-view-montant-box">
                      <p className="qt-view-montant-value">{formatPrice(selectedQuote.montantFinal)}</p>
                      <p className="qt-view-montant-label">Montant final</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="qt-view-fields">
                    <div className="qt-view-field">
                      <div className="qt-view-field-icon" style={{ background: '#eff6ff' }}>
                        <Person sx={{ fontSize: 16, color: '#1976D2' }} />
                      </div>
                      <div>
                        <p className="qt-view-field-label">Client</p>
                        <p className="qt-view-field-value">{selectedQuote.clientName}</p>
                      </div>
                    </div>
                    <div className="qt-view-field">
                      <div className="qt-view-field-icon" style={{ background: '#f3e8ff' }}>
                        <DirectionsCar sx={{ fontSize: 16, color: '#9c27b0' }} />
                      </div>
                      <div>
                        <p className="qt-view-field-label">Véhicule</p>
                        <p className="qt-view-field-value">{selectedQuote.vehicleName}</p>
                      </div>
                    </div>
                    <div className="qt-view-field">
                      <div className="qt-view-field-icon" style={{ background: '#f0fdf4' }}>
                        <Badge sx={{ fontSize: 16, color: '#16a34a' }} />
                      </div>
                      <div>
                        <p className="qt-view-field-label">Vendeur</p>
                        <p className="qt-view-field-value">{selectedQuote.vendeurName}</p>
                      </div>
                    </div>
                    <div className="qt-view-field">
                      <div className="qt-view-field-icon" style={{ background: '#fff7ed' }}>
                        <CalendarMonth sx={{ fontSize: 16, color: '#ea580c' }} />
                      </div>
                      <div>
                        <p className="qt-view-field-label">Validité</p>
                        <p className="qt-view-field-value">
                          {selectedQuote.validite}
                          {isExpired(selectedQuote.validite) && (
                            <span style={{ color: '#ef4444', marginLeft: '0.5rem', fontSize: '0.625rem' }}>Expiré</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Montant detail */}
                  <div className="qt-view-montant-detail">
                    <div className="qt-view-montant-grid">
                      <div className="qt-view-montant-item">
                        <p className="qt-view-montant-item-value" style={{ color: '#1e293b' }}>
                          {formatPrice(selectedQuote.montant)}
                        </p>
                        <p className="qt-view-montant-item-label">Montant brut</p>
                      </div>
                      <div className="qt-view-montant-item">
                        <p className="qt-view-montant-item-value" style={{ color: '#ef4444' }}>
                          -{formatPrice(selectedQuote.remise)}
                        </p>
                        <p className="qt-view-montant-item-label">Remise</p>
                      </div>
                      <div className="qt-view-montant-item">
                        <p className="qt-view-montant-item-value" style={{ color: '#16a34a' }}>
                          {formatPrice(selectedQuote.montantFinal)}
                        </p>
                        <p className="qt-view-montant-item-label">Net à payer</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedQuote.notes && (
                    <div className="qt-view-notes">
                      <p className="qt-view-notes-title">Notes</p>
                      <p className="qt-view-notes-text">{selectedQuote.notes}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* ═══ MODAL : SUPPRESSION ═══ */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <div className="qt-delete-modal">
          <div className="qt-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="qt-delete-title">Supprimer ce devis ?</h3>
          <p className="qt-delete-text">Cette action est irréversible.</p>
          <div className="qt-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="qt-modal-btn qt-modal-btn-cancel">
              Annuler
            </button>
            <button onClick={() => handleDelete(deleteConfirm)} className="qt-modal-btn qt-modal-btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Quotes;