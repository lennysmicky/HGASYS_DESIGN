import { useState } from 'react';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Close,
  ConfirmationNumber,
  Person,
  SupportAgent,
  CalendarMonth,
  PriorityHigh,
  HourglassEmpty,
  CheckCircle,
  Pending,
  History,
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
import { mockReceptions, mockClients, mockUsers } from '../../../data/mockData';
import '../../../styles/reception.css';

const Reception = () => {
  const { user } = useAuth();
  const canManage = canDo(user?.role, 'canManageReception');

  const [tickets, setTickets] = useState(mockReceptions);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPriorite, setFilterPriorite] = useState('tous');
  const [filterType, setFilterType] = useState('tous');

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const agents = mockUsers.filter((u) => u.role === 'agent_client' || u.role === 'admin');

  const emptyForm = {
    clientId: '',
    clientName: '',
    type: 'Demande info',
    priorite: 'normale',
    sujet: '',
    description: '',
    statut: 'en_attente',
    agentId: '',
    agentName: '',
  };

  const [form, setForm] = useState(emptyForm);

  // Stats
  const stats = {
    total: tickets.length,
    enCours: tickets.filter((t) => t.statut === 'en_cours').length,
    enAttente: tickets.filter((t) => t.statut === 'en_attente').length,
    resolus: tickets.filter((t) => t.statut === 'resolu').length,
    urgents: tickets.filter((t) => t.priorite === 'urgente').length,
  };

  const getPriorityConfig = (priorite) => {
    const configs = {
      urgente: { label: 'Urgente', className: 'rec-priority-urgente', color: '#dc2626' },
      haute: { label: 'Haute', className: 'rec-priority-haute', color: '#ea580c' },
      normale: { label: 'Normale', className: 'rec-priority-normale', color: '#2563eb' },
      basse: { label: 'Basse', className: 'rec-priority-basse', color: '#64748b' },
    };
    return configs[priorite] || configs.normale;
  };

  const getTypeConfig = (type) => {
    const configs = {
      'Réclamation': { className: 'rec-type-reclamation' },
      'Demande info': { className: 'rec-type-info' },
      'Demande essai': { className: 'rec-type-essai' },
    };
    return configs[type] || { className: 'rec-type-info' };
  };

  const getStatusConfig = (statut) => {
    const configs = {
      en_cours: { label: 'En cours', className: 'rec-status-en_cours' },
      en_attente: { label: 'En attente', className: 'rec-status-en_attente' },
      resolu: { label: 'Résolu', className: 'rec-status-resolu' },
    };
    return configs[statut] || configs.en_attente;
  };

  // Filtrage
  const filtered = tickets.filter((t) => {
    const matchSearch = `${t.numero} ${t.sujet} ${t.clientName} ${t.agentName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || t.statut === filterStatut;
    const matchPriorite = filterPriorite === 'tous' || t.priorite === filterPriorite;
    const matchType = filterType === 'tous' || t.type === filterType;
    return matchSearch && matchStatut && matchPriorite && matchType;
  });

  // Handlers
  const handleAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (ticket) => {
    setForm({ ...ticket });
    setEditMode(true);
    setOpenForm(true);
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setOpenView(true);
  };

  const handleSave = () => {
    const client = mockClients.find((c) => c.id === Number(form.clientId));
    const agent = agents.find((a) => a.id === Number(form.agentId));
    const now = new Date().toISOString().split('T')[0];

    if (editMode) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === form.id
            ? {
                ...form,
                clientName: client?.name || form.clientName,
                agentName: agent?.name || form.agentName,
                dateMaj: now,
              }
            : t
        )
      );
    } else {
      const newTicket = {
        ...form,
        id: tickets.length + 1,
        numero: `TIC-2024-${String(tickets.length + 1).padStart(3, '0')}`,
        clientId: Number(form.clientId),
        agentId: Number(form.agentId),
        clientName: client?.name || '',
        agentName: agent?.name || '',
        dateCreation: now,
        dateMaj: now,
        historique: [
          { date: now, action: 'Ticket créé', agent: agent?.name || '' },
        ],
      };
      setTickets((prev) => [...prev, newTicket]);
    }
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rec-page">
      {/* ═══ Header ═══ */}
      <div className="rec-header">
        <div>
          <h1 className="rec-header-title">Réception - Tickets</h1>
          <p className="rec-header-subtitle">Gestion des demandes et réclamations clients</p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="rec-add-btn">
            <Add fontSize="small" />
            Nouveau ticket
          </button>
        )}
      </div>

      {/* ═══ Stats ═══ */}
      <div className="rec-stats-grid">
        <div className="rec-stat-card">
          <div className="rec-stat-row">
            <div>
              <p className="rec-stat-label">Total</p>
              <p className="rec-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p>
            </div>
            <div className="rec-stat-icon" style={{ background: '#eff6ff' }}>
              <ConfirmationNumber sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="rec-stat-card">
          <div className="rec-stat-row">
            <div>
              <p className="rec-stat-label">En cours</p>
              <p className="rec-stat-value" style={{ color: '#2563eb' }}>{stats.enCours}</p>
            </div>
            <div className="rec-stat-icon" style={{ background: '#dbeafe' }}>
              <Pending sx={{ fontSize: 22, color: '#2563eb' }} />
            </div>
          </div>
        </div>
        <div className="rec-stat-card">
          <div className="rec-stat-row">
            <div>
              <p className="rec-stat-label">En attente</p>
              <p className="rec-stat-value" style={{ color: '#b45309' }}>{stats.enAttente}</p>
            </div>
            <div className="rec-stat-icon" style={{ background: '#fffbeb' }}>
              <HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} />
            </div>
          </div>
        </div>
        <div className="rec-stat-card">
          <div className="rec-stat-row">
            <div>
              <p className="rec-stat-label">Résolus</p>
              <p className="rec-stat-value" style={{ color: '#16a34a' }}>{stats.resolus}</p>
            </div>
            <div className="rec-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} />
            </div>
          </div>
        </div>
        <div className="rec-stat-card">
          <div className="rec-stat-row">
            <div>
              <p className="rec-stat-label">Urgents</p>
              <p className="rec-stat-value" style={{ color: '#dc2626' }}>{stats.urgents}</p>
            </div>
            <div className="rec-stat-icon" style={{ background: '#fef2f2' }}>
              <PriorityHigh sx={{ fontSize: 22, color: '#ef4444' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="rec-filters">
        <div className="rec-filters-row">
          <div className="rec-search-wrapper">
            <Search fontSize="small" className="rec-search-icon" />
            <input
              type="text"
              placeholder="Rechercher ticket, client, sujet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rec-search-input"
            />
          </div>
          <div className="rec-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="rec-select">
              <option value="tous">Tous statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolu</option>
            </select>
            <select value={filterPriorite} onChange={(e) => setFilterPriorite(e.target.value)} className="rec-select">
              <option value="tous">Priorité</option>
              <option value="urgente">Urgente</option>
              <option value="haute">Haute</option>
              <option value="normale">Normale</option>
              <option value="basse">Basse</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rec-select">
              <option value="tous">Type</option>
              <option value="Réclamation">Réclamation</option>
              <option value="Demande info">Demande info</option>
              <option value="Demande essai">Demande essai</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Grid ═══ */}
      {filtered.length > 0 ? (
        <div className="rec-grid">
          {filtered.map((ticket) => {
            const priorityConfig = getPriorityConfig(ticket.priorite);
            const typeConfig = getTypeConfig(ticket.type);
            const statusConfig = getStatusConfig(ticket.statut);

            return (
              <div key={ticket.id} className="rec-card">
                <div className="rec-card-body">
                  {/* Top */}
                  <div className="rec-card-top">
                    <div className="rec-card-top-left">
                      <p className="rec-card-numero">{ticket.numero}</p>
                      <h3 className="rec-card-sujet">{ticket.sujet}</h3>
                    </div>
                    <div className="rec-card-badges">
                      <span className={`rec-priority-badge ${priorityConfig.className}`}>
                        {priorityConfig.label}
                      </span>
                      <span className={`rec-type-badge ${typeConfig.className}`}>
                        {ticket.type}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="rec-card-desc">{ticket.description}</p>

                  {/* Status */}
                  <span className={`rec-status-badge ${statusConfig.className}`}>
                    ● {statusConfig.label}
                  </span>

                  {/* Client */}
                  <div className="rec-card-client">
                    <Person sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <div>
                      <p className="rec-card-client-name">{ticket.clientName}</p>
                      <p className="rec-card-agent">Agent: {ticket.agentName}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="rec-card-footer">
                    <span className="rec-card-date">
                      <CalendarMonth sx={{ fontSize: 12 }} />
                      {ticket.dateCreation}
                    </span>
                    <span className="rec-card-history-count">
                      <History sx={{ fontSize: 12 }} />
                      {ticket.historique.length} action{ticket.historique.length > 1 ? 's' : ''}
                    </span>
                    <div className="rec-card-actions">
                      <button onClick={() => handleView(ticket)} className="rec-action-btn rec-action-view" title="Voir">
                        <Visibility sx={{ fontSize: 15 }} />
                      </button>
                      {canManage && (
                        <>
                          <button onClick={() => handleEdit(ticket)} className="rec-action-btn rec-action-edit" title="Modifier">
                            <Edit sx={{ fontSize: 15 }} />
                          </button>
                          <button onClick={() => setDeleteConfirm(ticket.id)} className="rec-action-btn rec-action-delete" title="Supprimer">
                            <Delete sx={{ fontSize: 15 }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rec-empty">
          <ConfirmationNumber sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="rec-empty-text">Aucun ticket trouvé</p>
        </div>
      )}

      {/* ═══ MODAL : AJOUTER / MODIFIER ═══ */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="rec-header-title" style={{ fontSize: '0.875rem' }}>
            {editMode ? 'Modifier le ticket' : 'Nouveau ticket'}
          </span>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <div className="rec-form-fields">
            <div>
              <label className="rec-form-label">Client</label>
              <select value={form.clientId} onChange={(e) => handleChange('clientId', e.target.value)} className="rec-form-select">
                <option value="">Sélectionner un client</option>
                {mockClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="rec-form-label">Sujet</label>
              <input type="text" value={form.sujet} onChange={(e) => handleChange('sujet', e.target.value)} placeholder="Objet de la demande" className="rec-form-input" />
            </div>

            <div className="rec-form-grid-2">
              <div>
                <label className="rec-form-label">Type</label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="rec-form-select">
                  <option value="Demande info">Demande info</option>
                  <option value="Réclamation">Réclamation</option>
                  <option value="Demande essai">Demande essai</option>
                </select>
              </div>
              <div>
                <label className="rec-form-label">Priorité</label>
                <select value={form.priorite} onChange={(e) => handleChange('priorite', e.target.value)} className="rec-form-select">
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="rec-form-grid-2">
              <div>
                <label className="rec-form-label">Agent assigné</label>
                <select value={form.agentId} onChange={(e) => handleChange('agentId', e.target.value)} className="rec-form-select">
                  <option value="">Sélectionner</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="rec-form-label">Statut</label>
                <select value={form.statut} onChange={(e) => handleChange('statut', e.target.value)} className="rec-form-select">
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="rec-form-label">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Détails de la demande..." className="rec-form-textarea" />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <button onClick={() => setOpenForm(false)} className="rec-modal-btn rec-modal-btn-cancel">Annuler</button>
          <button onClick={handleSave} className="rec-modal-btn rec-modal-btn-primary">
            {editMode ? 'Modifier' : 'Créer le ticket'}
          </button>
        </DialogActions>
      </Dialog>

      {/* ═══ MODAL : VOIR TICKET ═══ */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedTicket && (() => {
          const priorityConfig = getPriorityConfig(selectedTicket.priorite);
          const statusConfig = getStatusConfig(selectedTicket.statut);
          const typeConfig = getTypeConfig(selectedTicket.type);

          return (
            <>
              <DialogTitle sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="rec-header-title" style={{ fontSize: '0.875rem' }}>Détails du ticket</span>
                <IconButton onClick={() => setOpenView(false)} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <div className="rec-view-content">
                  {/* Header */}
                  <div className="rec-view-header">
                    <p className="rec-view-numero">{selectedTicket.numero}</p>
                    <h2 className="rec-view-sujet">{selectedTicket.sujet}</h2>
                    <div className="rec-view-badges">
                      <span className={`rec-priority-badge ${priorityConfig.className}`}>{priorityConfig.label}</span>
                      <span className={`rec-type-badge ${typeConfig.className}`}>{selectedTicket.type}</span>
                      <span className={`rec-status-badge ${statusConfig.className}`}>● {statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="rec-view-desc">{selectedTicket.description}</p>

                  {/* Fields */}
                  <div className="rec-view-fields">
                    <div className="rec-view-field">
                      <div className="rec-view-field-icon" style={{ background: '#eff6ff' }}>
                        <Person sx={{ fontSize: 16, color: '#1976D2' }} />
                      </div>
                      <div>
                        <p className="rec-view-field-label">Client</p>
                        <p className="rec-view-field-value">{selectedTicket.clientName}</p>
                      </div>
                    </div>
                    <div className="rec-view-field">
                      <div className="rec-view-field-icon" style={{ background: '#f0fdf4' }}>
                        <SupportAgent sx={{ fontSize: 16, color: '#16a34a' }} />
                      </div>
                      <div>
                        <p className="rec-view-field-label">Agent assigné</p>
                        <p className="rec-view-field-value">{selectedTicket.agentName}</p>
                      </div>
                    </div>
                    <div className="rec-view-field">
                      <div className="rec-view-field-icon" style={{ background: '#fff7ed' }}>
                        <CalendarMonth sx={{ fontSize: 16, color: '#ea580c' }} />
                      </div>
                      <div>
                        <p className="rec-view-field-label">Créé le</p>
                        <p className="rec-view-field-value">{selectedTicket.dateCreation}</p>
                      </div>
                    </div>
                    <div className="rec-view-field">
                      <div className="rec-view-field-icon" style={{ background: '#f3e8ff' }}>
                        <CalendarMonth sx={{ fontSize: 16, color: '#9c27b0' }} />
                      </div>
                      <div>
                        <p className="rec-view-field-label">Dernière MAJ</p>
                        <p className="rec-view-field-value">{selectedTicket.dateMaj}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {selectedTicket.historique && selectedTicket.historique.length > 0 && (
                    <div className="rec-timeline">
                      <h3 className="rec-timeline-title">Historique ({selectedTicket.historique.length})</h3>
                      <div className="rec-timeline-list">
                        {selectedTicket.historique.map((h, idx) => (
                          <div key={idx} className="rec-timeline-item">
                            <div className="rec-timeline-dot" />
                            <p className="rec-timeline-date">{h.date}</p>
                            <p className="rec-timeline-action">{h.action}</p>
                            <p className="rec-timeline-agent">par {h.agent}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* ═══ MODAL : SUPPRESSION ═══ */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <div className="rec-delete-modal">
          <div className="rec-delete-icon">
            <Delete sx={{ color: '#f44336' }} />
          </div>
          <h3 className="rec-delete-title">Supprimer ce ticket ?</h3>
          <p className="rec-delete-text">Cette action est irréversible.</p>
          <div className="rec-delete-actions">
            <button onClick={() => setDeleteConfirm(null)} className="rec-modal-btn rec-modal-btn-cancel">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="rec-modal-btn rec-modal-btn-danger">Supprimer</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Reception;