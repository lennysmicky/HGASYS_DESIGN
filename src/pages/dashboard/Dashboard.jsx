// src/pages/dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';
import {
  mockStats,
  mockSales,
  mockVehicles,
  mockClients,
  mockReceptions,
  mockRepairs,
  mockInterventions,
  mockParts,
  mockOrders,
} from '../../data/mockData';
import {
  DirectionsCar,
  People,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  HourglassEmpty,
  Build,
  Inventory,
  SupportAgent,
  Warning,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import '../../styles/dashboard.css';

const COLORS = ['#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'];

// ═══════════════════════════════════════════
// COMPOSANT STAT CARD
// ═══════════════════════════════════════════
const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-top">
      <div>
        <p className="dash-stat-title">{title}</p>
        <p className={`dash-stat-value ${String(value).length > 10 ? 'dash-stat-value-small' : ''}`}>
          {value}
        </p>
        {subtitle && (
          <div className="dash-stat-subtitle">
            {trend === 'up' && <TrendingUp sx={{ fontSize: 14 }} />}
            {trend === 'down' && <TrendingDown sx={{ fontSize: 14 }} />}
            <span className={
              trend === 'up'
                ? 'dash-stat-subtitle-up'
                : trend === 'down'
                ? 'dash-stat-subtitle-down'
                : 'dash-stat-subtitle-neutral'
            }>
              {subtitle}
            </span>
          </div>
        )}
      </div>
      <div
        className="dash-stat-icon"
        style={{ backgroundColor: color + '15', color }}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════
const formatPrice = (price) =>
  new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;

  const recentSales = mockSales.slice(0, 4);
  const recentVehicles = mockVehicles
    .filter((v) => v.statut === 'disponible')
    .slice(0, 4);

  // ─── Rendu par rôle ───
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-left">
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de l'activité</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* ADMIN / MANAGER : Vue complète          */}
      {/* ═══════════════════════════════════════ */}
      {(role === ROLES.ADMIN || role === ROLES.MANAGER) && (
        <>
          {/* Stats */}
          <div className="dash-stats-grid">
            <StatCard
              title="Ventes du mois"
              value={mockStats.totalVentes}
              icon={<ShoppingCart fontSize="small" />}
              color="#9c27b0"
              subtitle={`${mockStats.ventesEnCours} en cours`}
              trend="up"
            />
            <StatCard
              title="Véhicules dispo"
              value={mockStats.vehiculesDisponibles}
              icon={<DirectionsCar fontSize="small" />}
              color="#1976D2"
              subtitle={`${mockStats.totalVehicules} total`}
            />
            <StatCard
              title="Clients"
              value={mockStats.totalClients}
              icon={<People fontSize="small" />}
              color="#ff9800"
              subtitle="+2 ce mois"
              trend="up"
            />
            {role === ROLES.ADMIN && (
              <StatCard
                title="Chiffre d'affaires"
                value={formatPrice(mockStats.revenus)}
                icon={<AttachMoney fontSize="small" />}
                color="#4caf50"
                subtitle="+12% vs mois dernier"
                trend="up"
              />
            )}
            {role === ROLES.MANAGER && (
              <StatCard
                title="Employés actifs"
                value={mockStats.employesActifs}
                icon={<People fontSize="small" />}
                color="#4caf50"
                subtitle={`${mockStats.totalEmployes} total`}
              />
            )}
          </div>

          {/* Chart revenus (Admin uniquement) */}
          {role === ROLES.ADMIN && (
            <div className="dash-card">
              <div className="dash-chart-header">
                <div>
                  <h3 className="dash-card-title">Revenus mensuels</h3>
                  <p className="dash-card-subtitle">Évolution 2024</p>
                </div>
                <div className="dash-chart-badge">
                  <TrendingUp sx={{ fontSize: 12 }} />
                  <span>+12%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockStats.ventesParMois}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976D2" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#9e9e9e' }} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9e9e9e' }}
                    tickFormatter={(v) => `${v / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                    }}
                    formatter={(value) => [formatPrice(value), 'Revenus']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenus"
                    stroke="#1976D2"
                    strokeWidth={2}
                    fill="url(#colorRevenus)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Ventes + Véhicules */}
          <div className="dash-content-grid">
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h3 className="dash-card-title">Dernières ventes</h3>
                  <p className="dash-card-subtitle">Transactions récentes</p>
                </div>
                <ShoppingCart className="dash-card-icon" sx={{ fontSize: 18 }} />
              </div>
              <div className="dash-list">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="dash-sale-item">
                    <div className="dash-sale-left">
                      <div className={`dash-sale-status-icon ${
                        sale.paiement.statut === 'payé'
                          ? 'dash-sale-status-paid'
                          : 'dash-sale-status-pending'
                      }`}>
                        {sale.paiement.statut === 'payé' ? (
                          <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                        ) : (
                          <HourglassEmpty sx={{ fontSize: 16, color: '#ff9800' }} />
                        )}
                      </div>
                      <div>
                        <p className="dash-sale-name">{sale.vehicleName}</p>
                        <p className="dash-sale-meta">
                          {sale.clientName} • {sale.date}
                        </p>
                      </div>
                    </div>
                    <div className="dash-sale-right">
                      <p className="dash-sale-amount">{formatPrice(sale.montant)}</p>
                      <p className={`dash-sale-payment ${
                        sale.paiement.statut === 'payé'
                          ? 'dash-sale-payment-paid'
                          : 'dash-sale-payment-pending'
                      }`}>
                        {sale.paiement.statut === 'payé' ? 'Payé' : 'En attente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h3 className="dash-card-title">Véhicules disponibles</h3>
                  <p className="dash-card-subtitle">
                    {mockStats.vehiculesDisponibles} en stock
                  </p>
                </div>
                <DirectionsCar className="dash-card-icon" sx={{ fontSize: 18 }} />
              </div>
              <div className="dash-list">
                {recentVehicles.map((v) => (
                  <div key={v.id} className="dash-vehicle-item">
                    <img
                      src={v.image}
                      alt={v.modele}
                      className="dash-vehicle-img"
                    />
                    <div className="dash-vehicle-info">
                      <p className="dash-vehicle-name">
                        {v.marque} {v.modele}
                      </p>
                      <p className="dash-vehicle-meta">
                        {v.annee} • {v.couleur} • {v.carburant}
                      </p>
                    </div>
                    <span className="dash-vehicle-price">
                      {formatPrice(v.prix)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* COMMERCIAL : Ventes + Clients           */}
      {/* ═══════════════════════════════════════ */}
      {role === ROLES.COMMERCIAL && (
        <>
          <div className="dash-stats-grid">
            <StatCard
              title="Mes ventes"
              value={mockSales.filter((s) => s.vendeurId === user.id).length}
              icon={<ShoppingCart fontSize="small" />}
              color="#9c27b0"
              subtitle="Ce mois"
              trend="up"
            />
            <StatCard
              title="Véhicules dispo"
              value={mockStats.vehiculesDisponibles}
              icon={<DirectionsCar fontSize="small" />}
              color="#1976D2"
              subtitle={`${mockStats.totalVehicules} total`}
            />
            <StatCard
              title="Mes clients"
              value={mockStats.totalClients}
              icon={<People fontSize="small" />}
              color="#ff9800"
              subtitle="Clients actifs"
            />
            <StatCard
              title="En attente"
              value={mockStats.ventesEnCours}
              icon={<HourglassEmpty fontSize="small" />}
              color="#f44336"
              subtitle="Paiements en cours"
            />
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: '0.75rem' }}>
              Mes performances
            </h3>
            <div className="dash-kpi-grid">
              <div className="dash-kpi-item dash-kpi-blue">
                <p className="dash-kpi-value">
                  {mockSales.filter((s) => s.vendeurId === user.id).length}
                </p>
                <p className="dash-kpi-label">Ventes réalisées</p>
              </div>
              <div className="dash-kpi-item dash-kpi-green">
                <p className="dash-kpi-value">
                  {formatPrice(
                    mockSales
                      .filter((s) => s.vendeurId === user.id)
                      .reduce((sum, s) => sum + s.montant, 0)
                  )}
                </p>
                <p className="dash-kpi-label">CA généré</p>
              </div>
              <div className="dash-kpi-item dash-kpi-purple">
                <p className="dash-kpi-value">95%</p>
                <p className="dash-kpi-label">Taux conversion</p>
              </div>
            </div>
          </div>

          <div className="dash-content-grid">
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h3 className="dash-card-title">Dernières ventes</h3>
                  <p className="dash-card-subtitle">Mes transactions</p>
                </div>
              </div>
              <div className="dash-list">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="dash-sale-item">
                    <div className="dash-sale-left">
                      <div className={`dash-sale-status-icon ${
                        sale.paiement.statut === 'payé'
                          ? 'dash-sale-status-paid'
                          : 'dash-sale-status-pending'
                      }`}>
                        {sale.paiement.statut === 'payé' ? (
                          <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                        ) : (
                          <HourglassEmpty sx={{ fontSize: 16, color: '#ff9800' }} />
                        )}
                      </div>
                      <div>
                        <p className="dash-sale-name">{sale.vehicleName}</p>
                        <p className="dash-sale-meta">{sale.clientName} • {sale.date}</p>
                      </div>
                    </div>
                    <div className="dash-sale-right">
                      <p className="dash-sale-amount">{formatPrice(sale.montant)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h3 className="dash-card-title">Véhicules disponibles</h3>
                  <p className="dash-card-subtitle">À proposer aux clients</p>
                </div>
              </div>
              <div className="dash-list">
                {recentVehicles.map((v) => (
                  <div key={v.id} className="dash-vehicle-item">
                    <img src={v.image} alt={v.modele} className="dash-vehicle-img" />
                    <div className="dash-vehicle-info">
                      <p className="dash-vehicle-name">{v.marque} {v.modele}</p>
                      <p className="dash-vehicle-meta">{v.annee} • {v.couleur}</p>
                    </div>
                    <span className="dash-vehicle-price">{formatPrice(v.prix)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* TECHNICIEN : Interventions               */}
      {/* ═══════════════════════════════════════ */}
      {role === ROLES.TECHNICIEN && (
        <>
          <div className="dash-stats-grid">
            <StatCard
              title="Interventions"
              value={mockStats.totalInterventions}
              icon={<Build fontSize="small" />}
              color="#7B1FA2"
              subtitle={`${mockStats.interventionsEnCours} en cours`}
            />
            <StatCard
              title="Réparations"
              value={mockStats.reparationsEnCours}
              icon={<Build fontSize="small" />}
              color="#f44336"
              subtitle="En cours"
            />
            <StatCard
              title="Révisions"
              value={mockStats.revisionsplanifiees}
              icon={<DirectionsCar fontSize="small" />}
              color="#1976D2"
              subtitle="Planifiées"
            />
            <StatCard
              title="Terminées"
              value={mockStats.interventionsTerminees}
              icon={<CheckCircle fontSize="small" />}
              color="#4caf50"
              subtitle="Ce mois"
              trend="up"
            />
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: '0.75rem' }}>
              Mes indicateurs
            </h3>
            <div className="dash-kpi-grid">
              <div className="dash-kpi-item dash-kpi-blue">
                <p className="dash-kpi-value">{mockStats.totalInterventions}</p>
                <p className="dash-kpi-label">Total interventions</p>
              </div>
              <div className="dash-kpi-item dash-kpi-green">
                <p className="dash-kpi-value">{mockStats.tempsMoyenIntervention}</p>
                <p className="dash-kpi-label">Temps moyen</p>
              </div>
              <div className="dash-kpi-item dash-kpi-purple">
                <p className="dash-kpi-value">96%</p>
                <p className="dash-kpi-label">Taux réussite</p>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">Interventions récentes</h3>
                <p className="dash-card-subtitle">Mes tâches</p>
              </div>
            </div>
            <div className="dash-list">
              {mockInterventions.slice(0, 4).map((inter) => (
                <div key={inter.id} className="dash-sale-item">
                  <div className="dash-sale-left">
                    <div className={`dash-sale-status-icon ${
                      inter.statut === 'terminee'
                        ? 'dash-sale-status-paid'
                        : 'dash-sale-status-pending'
                    }`}>
                      {inter.statut === 'terminee' ? (
                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <Build sx={{ fontSize: 16, color: '#ff9800' }} />
                      )}
                    </div>
                    <div>
                      <p className="dash-sale-name">{inter.vehicleName}</p>
                      <p className="dash-sale-meta">
                        {inter.type} • {inter.dateDebut}
                      </p>
                    </div>
                  </div>
                  <div className="dash-sale-right">
                    <p className={`dash-sale-payment ${
                      inter.statut === 'terminee'
                        ? 'dash-sale-payment-paid'
                        : 'dash-sale-payment-pending'
                    }`}>
                      {inter.statut === 'terminee' ? 'Terminée' : 'En cours'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* GESTIONNAIRE STOCK : Pièces + Commandes  */}
      {/* ═══════════════════════════════════════ */}
      {role === ROLES.GESTIONNAIRE_STOCK && (
        <>
          <div className="dash-stats-grid">
            <StatCard
              title="Pièces en stock"
              value={mockStats.totalPieces}
              icon={<Inventory fontSize="small" />}
              color="#00796B"
              subtitle="Références"
            />
            <StatCard
              title="Stock critique"
              value={mockStats.piecesStockCritique}
              icon={<Warning fontSize="small" />}
              color="#f44336"
              subtitle="Alerte !"
              trend="down"
            />
            <StatCard
              title="Commandes"
              value={mockStats.commandesEnCours}
              icon={<ShoppingCart fontSize="small" />}
              color="#ff9800"
              subtitle="En cours"
            />
            <StatCard
              title="Fournisseurs"
              value={mockStats.totalFournisseurs}
              icon={<People fontSize="small" />}
              color="#1976D2"
              subtitle="Actifs"
            />
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: '0.75rem' }}>
              Alertes stock
            </h3>
            <div className="dash-list">
              {mockParts
                .filter((p) => p.statut === 'stock_critique')
                .map((part) => (
                  <div key={part.id} className="dash-sale-item">
                    <div className="dash-sale-left">
                      <div className="dash-sale-status-icon dash-sale-status-pending">
                        <Warning sx={{ fontSize: 16, color: '#f44336' }} />
                      </div>
                      <div>
                        <p className="dash-sale-name">{part.nom}</p>
                        <p className="dash-sale-meta">
                          Réf: {part.reference} • {part.emplacement}
                        </p>
                      </div>
                    </div>
                    <div className="dash-sale-right">
                      <p className="dash-sale-amount">{part.stock} restant(s)</p>
                      <p className="dash-sale-payment dash-sale-payment-pending">
                        Min: {part.stockMin}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">Commandes récentes</h3>
                <p className="dash-card-subtitle">Suivi fournisseurs</p>
              </div>
            </div>
            <div className="dash-list">
              {mockOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="dash-sale-item">
                  <div className="dash-sale-left">
                    <div className={`dash-sale-status-icon ${
                      order.statut === 'livree'
                        ? 'dash-sale-status-paid'
                        : 'dash-sale-status-pending'
                    }`}>
                      {order.statut === 'livree' ? (
                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <HourglassEmpty sx={{ fontSize: 16, color: '#ff9800' }} />
                      )}
                    </div>
                    <div>
                      <p className="dash-sale-name">{order.numero}</p>
                      <p className="dash-sale-meta">
                        {order.fournisseurName} • {order.dateCommande}
                      </p>
                    </div>
                  </div>
                  <div className="dash-sale-right">
                    <p className="dash-sale-amount">{formatPrice(order.montantTotal)}</p>
                    <p className={`dash-sale-payment ${
                      order.statut === 'livree'
                        ? 'dash-sale-payment-paid'
                        : 'dash-sale-payment-pending'
                    }`}>
                      {order.statut === 'livree'
                        ? 'Livrée'
                        : order.statut === 'en_cours'
                        ? 'En cours'
                        : 'Confirmée'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* AGENT CLIENT : Tickets + Clients         */}
      {/* ═══════════════════════════════════════ */}
      {role === ROLES.AGENT_CLIENT && (
        <>
          <div className="dash-stats-grid">
            <StatCard
              title="Tickets"
              value={mockStats.ticketsTotal}
              icon={<SupportAgent fontSize="small" />}
              color="#388e3c"
              subtitle={`${mockStats.ticketsEnCours} en cours`}
            />
            <StatCard
              title="Urgents"
              value={mockStats.ticketsUrgents}
              icon={<Warning fontSize="small" />}
              color="#f44336"
              subtitle="À traiter"
              trend="down"
            />
            <StatCard
              title="En attente"
              value={mockStats.ticketsEnAttente}
              icon={<HourglassEmpty fontSize="small" />}
              color="#ff9800"
              subtitle="Non assignés"
            />
            <StatCard
              title="Clients actifs"
              value={mockClients.filter((c) => c.status === 'actif').length}
              icon={<People fontSize="small" />}
              color="#1976D2"
              subtitle="Total"
            />
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">Tickets récents</h3>
                <p className="dash-card-subtitle">Demandes clients</p>
              </div>
            </div>
            <div className="dash-list">
              {mockReceptions.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="dash-sale-item">
                  <div className="dash-sale-left">
                    <div className={`dash-sale-status-icon ${
                      ticket.statut === 'resolu'
                        ? 'dash-sale-status-paid'
                        : 'dash-sale-status-pending'
                    }`}>
                      {ticket.statut === 'resolu' ? (
                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : ticket.priorite === 'urgente' ? (
                        <Warning sx={{ fontSize: 16, color: '#f44336' }} />
                      ) : (
                        <SupportAgent sx={{ fontSize: 16, color: '#ff9800' }} />
                      )}
                    </div>
                    <div>
                      <p className="dash-sale-name">{ticket.sujet}</p>
                      <p className="dash-sale-meta">
                        {ticket.clientName} • {ticket.type}
                      </p>
                    </div>
                  </div>
                  <div className="dash-sale-right">
                    <p className={`dash-sale-payment ${
                      ticket.statut === 'resolu'
                        ? 'dash-sale-payment-paid'
                        : 'dash-sale-payment-pending'
                    }`}>
                      {ticket.statut === 'resolu'
                        ? 'Résolu'
                        : ticket.statut === 'en_cours'
                        ? 'En cours'
                        : 'En attente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;