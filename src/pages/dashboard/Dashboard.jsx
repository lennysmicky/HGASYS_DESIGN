import { useAuth } from '../../context/AuthContext';
import { canDo } from '../../utils/roles';
import { mockStats, mockSales, mockVehicles, mockClients } from '../../data/mockData';
import {
  DirectionsCar,
  People,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  BadgeOutlined,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'];

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1.5">
            {trend === 'up' ? (
              <TrendingUp sx={{ fontSize: 14, color: '#4caf50' }} />
            ) : trend === 'down' ? (
              <TrendingDown sx={{ fontSize: 14, color: '#f44336' }} />
            ) : null}
            <span className={`text-[10px] font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color + '15' }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const showReports = canDo(user?.role, 'canViewReports');

  const recentSales = mockSales.slice(0, 5);
  const recentVehicles = mockVehicles.filter(v => v.statut === 'disponible').slice(0, 4);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ').format(price) + ' CFA';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-xs text-gray-400 mt-0.5">Vue d'ensemble de l'activité</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Véhicules"
          value={mockStats.totalVehicules}
          icon={<DirectionsCar fontSize="small" />}
          color="#1976D2"
          subtitle={`${mockStats.vehiculesDisponibles} disponibles`}
          trend="up"
        />
        <StatCard
          title="Ventes"
          value={mockStats.totalVentes}
          icon={<ShoppingCart fontSize="small" />}
          color="#9c27b0"
          subtitle={`${mockStats.ventesEnCours} en cours`}
          trend="up"
        />
        <StatCard
          title="Clients"
          value={mockStats.totalClients}
          icon={<People fontSize="small" />}
          color="#ff9800"
          subtitle="+2 ce mois"
          trend="up"
        />
        {showReports && (
          <StatCard
            title="Revenus"
            value={formatPrice(mockStats.revenus)}
            icon={<AttachMoney fontSize="small" />}
            color="#4caf50"
            subtitle="+12% vs mois dernier"
            trend="up"
          />
        )}
        {!showReports && (
          <StatCard
            title="Employés"
            value={mockStats.employesActifs}
            icon={<BadgeOutlined fontSize="small" />}
            color="#4caf50"
            subtitle="Tous actifs"
          />
        )}
      </div>

      {/* Charts Row */}
      {showReports && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenus Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Revenus mensuels</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Évolution sur l'année 2024</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md">
                <TrendingUp sx={{ fontSize: 12, color: '#4caf50' }} />
                <span className="text-[10px] font-semibold text-green-600">+12%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockStats.ventesParMois}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976D2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#9e9e9e' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9e9e9e' }} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e0e0e0' }}
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

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-800">Ventes par marque</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 mb-3">Répartition des ventes</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={mockStats.ventesParMarque}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="ventes"
                  nameKey="marque"
                >
                  {mockStats.ventesParMarque.map((entry, index) => (
                    <Cell key={entry.marque} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Ventes par mois - Bar chart */}
      {showReports && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800">Nombre de ventes par mois</h3>
          <p className="text-[10px] text-gray-400 mt-0.5 mb-4">Année 2024</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockStats.ventesParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#9e9e9e' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9e9e9e' }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e0e0e0' }}
              />
              <Bar dataKey="ventes" fill="#1976D2" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Dernières ventes</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Transactions récentes</p>
            </div>
            <ShoppingCart sx={{ fontSize: 18, color: '#9e9e9e' }} />
          </div>
          <div className="space-y-2">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    ${sale.paiement.statut === 'payé' ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {sale.paiement.statut === 'payé' ? (
                      <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                    ) : (
                      <HourglassEmpty sx={{ fontSize: 16, color: '#ff9800' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{sale.vehicleName}</p>
                    <p className="text-[10px] text-gray-400">{sale.clientName} • {sale.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-800">{formatPrice(sale.montant)}</p>
                  <p className={`text-[10px] font-medium
                    ${sale.paiement.statut === 'payé' ? 'text-green-500' : 'text-orange-500'}`}>
                    {sale.paiement.statut === 'payé' ? 'Payé' : 'En attente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Vehicles */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Véhicules disponibles</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{mockStats.vehiculesDisponibles} en stock</p>
            </div>
            <DirectionsCar sx={{ fontSize: 18, color: '#9e9e9e' }} />
          </div>
          <div className="space-y-2">
            {recentVehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={v.image}
                  alt={v.modele}
                  className="w-14 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {v.marque} {v.modele}
                  </p>
                  <p className="text-[10px] text-gray-400">{v.annee} • {v.couleur} • {v.carburant}</p>
                </div>
                <p className="text-xs font-bold text-[#1976D2] whitespace-nowrap">
                  {formatPrice(v.prix)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats for Employee */}
      {!showReports && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Mes performances</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50/50 rounded-lg">
              <p className="text-xl font-bold text-[#1976D2]">12</p>
              <p className="text-[10px] text-gray-500 mt-1">Ventes ce mois</p>
            </div>
            <div className="text-center p-3 bg-green-50/50 rounded-lg">
              <p className="text-xl font-bold text-green-600">8</p>
              <p className="text-[10px] text-gray-500 mt-1">Clients actifs</p>
            </div>
            <div className="text-center p-3 bg-purple-50/50 rounded-lg">
              <p className="text-xl font-bold text-purple-600">95%</p>
              <p className="text-[10px] text-gray-500 mt-1">Taux réussite</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;