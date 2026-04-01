import { useState } from 'react';
import {
  Search,
  DirectionsCar,
  CheckCircle,
  Cancel,
  BookmarkAdded,
  Build,
  Warning,
  LocalGasStation,
  Speed,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { mockVehicles } from '../../../data/mockData';
import '../../../styles/vehicleStock.css';

const VehiculeStock = () => {
  const [vehicles] = useState(mockVehicles);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterCarburant, setFilterCarburant] = useState('tous');
  const [filterTransmission, setFilterTransmission] = useState('tous');

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' DA';

  // Stats
  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter((v) => v.statut === 'disponible').length,
    vendu: vehicles.filter((v) => v.statut === 'vendu').length,
    reserve: vehicles.filter((v) => v.statut === 'reserve').length,
    enRevision: vehicles.filter((v) => v.statut === 'en_revision').length,
  };

  // Données graphiques
  const statusData = [
    { name: 'Disponible', value: stats.disponible, color: '#22c55e' },
    { name: 'Vendu', value: stats.vendu, color: '#ef4444' },
    { name: 'Réservé', value: stats.reserve, color: '#f59e0b' },
    { name: 'En révision', value: stats.enRevision, color: '#8b5cf6' },
  ];

  const marqueCount = {};
  vehicles.forEach((v) => {
    marqueCount[v.marque] = (marqueCount[v.marque] || 0) + 1;
  });
  const marqueData = Object.entries(marqueCount)
    .map(([marque, count]) => ({ marque, count }))
    .sort((a, b) => b.count - a.count);

  // Filtrage
  const filtered = vehicles.filter((v) => {
    const matchSearch = `${v.marque} ${v.modele} ${v.vin} ${v.couleur}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || v.statut === filterStatut;
    const matchCarburant =
      filterCarburant === 'tous' || v.carburant === filterCarburant;
    const matchTransmission =
      filterTransmission === 'tous' || v.transmission === filterTransmission;
    return matchSearch && matchStatut && matchCarburant && matchTransmission;
  });

  const getStatusConfig = (statut) => {
    const configs = {
      disponible: { label: 'Disponible', className: 'vs-status-disponible' },
      vendu: { label: 'Vendu', className: 'vs-status-vendu' },
      reserve: { label: 'Réservé', className: 'vs-status-reserve' },
      en_revision: { label: 'En révision', className: 'vs-status-en_revision' },
    };
    return configs[statut] || configs.disponible;
  };

  const getColorHex = (couleur) => {
    const colors = {
      Blanc: '#f8fafc', BLANC: '#f8fafc', blanc: '#f8fafc',
      Noir: '#1e293b', noir: '#1e293b',
      Gris: '#94a3b8', gris: '#94a3b8',
      Bleu: '#3b82f6', bleu: '#3b82f6',
      Rouge: '#ef4444', rouge: '#ef4444',
      Vert: '#22c55e', vert: '#22c55e',
    };
    return colors[couleur] || '#94a3b8';
  };

  return (
    <div className="vs-page">
      {/* ═══ Header ═══ */}
      <div className="vs-header">
        <div>
          <h1 className="vs-header-title">Stock Véhicules</h1>
          <p className="vs-header-subtitle">
            Vue d'ensemble du parc automobile et disponibilité
          </p>
        </div>
      </div>

      {/* ═══ Alert si stock bas ═══ */}
      {stats.disponible <= 3 && (
        <div className="vs-alert vs-alert-warning">
          <Warning sx={{ fontSize: 18 }} className="vs-alert-icon" />
          <p className="vs-alert-text">
            <span className="vs-alert-bold">Attention !</span> Seulement{' '}
            {stats.disponible} véhicule{stats.disponible > 1 ? 's' : ''}{' '}
            disponible{stats.disponible > 1 ? 's' : ''} en stock.
          </p>
        </div>
      )}

      {/* ═══ Stats ═══ */}
      <div className="vs-stats-grid">
        <div className="vs-stat-card">
          <div className="vs-stat-row">
            <div>
              <p className="vs-stat-label">Total</p>
              <p className="vs-stat-value" style={{ color: '#1e293b' }}>
                {stats.total}
              </p>
            </div>
            <div className="vs-stat-icon" style={{ background: '#eff6ff' }}>
              <DirectionsCar sx={{ fontSize: 22, color: '#1976D2' }} />
            </div>
          </div>
        </div>
        <div className="vs-stat-card">
          <div className="vs-stat-row">
            <div>
              <p className="vs-stat-label">Disponibles</p>
              <p className="vs-stat-value" style={{ color: '#16a34a' }}>
                {stats.disponible}
              </p>
            </div>
            <div className="vs-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} />
            </div>
          </div>
        </div>
        <div className="vs-stat-card">
          <div className="vs-stat-row">
            <div>
              <p className="vs-stat-label">Vendus</p>
              <p className="vs-stat-value" style={{ color: '#ef4444' }}>
                {stats.vendu}
              </p>
            </div>
            <div className="vs-stat-icon" style={{ background: '#fef2f2' }}>
              <Cancel sx={{ fontSize: 22, color: '#ef4444' }} />
            </div>
          </div>
        </div>
        <div className="vs-stat-card">
          <div className="vs-stat-row">
            <div>
              <p className="vs-stat-label">Réservés</p>
              <p className="vs-stat-value" style={{ color: '#f59e0b' }}>
                {stats.reserve}
              </p>
            </div>
            <div className="vs-stat-icon" style={{ background: '#fffbeb' }}>
              <BookmarkAdded sx={{ fontSize: 22, color: '#f59e0b' }} />
            </div>
          </div>
        </div>
        <div className="vs-stat-card">
          <div className="vs-stat-row">
            <div>
              <p className="vs-stat-label">En révision</p>
              <p className="vs-stat-value" style={{ color: '#8b5cf6' }}>
                {stats.enRevision}
              </p>
            </div>
            <div className="vs-stat-icon" style={{ background: '#ede9fe' }}>
              <Build sx={{ fontSize: 22, color: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Charts ═══ */}
      <div className="vs-charts-section">
        {/* PieChart statut */}
        <div className="vs-chart-card">
          <h3 className="vs-chart-title">Répartition par statut</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {statusData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} véhicules`, name]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '0.6875rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {statusData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                <span style={{ fontSize: '0.625rem', color: '#64748b' }}>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* BarChart par marque */}
        <div className="vs-chart-card">
          <h3 className="vs-chart-title">Véhicules par marque</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={marqueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="marque" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '0.6875rem',
                }}
              />
              <Bar dataKey="count" fill="#1976D2" radius={[4, 4, 0, 0]} name="Véhicules" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="vs-filters">
        <div className="vs-filters-row">
          <div className="vs-search-wrapper">
            <Search fontSize="small" className="vs-search-icon" />
            <input
              type="text"
              placeholder="Rechercher marque, modèle, VIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="vs-search-input"
            />
          </div>
          <div className="vs-filter-selects">
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="vs-select">
              <option value="tous">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="vendu">Vendu</option>
              <option value="reserve">Réservé</option>
              <option value="en_revision">En révision</option>
            </select>
            <select value={filterCarburant} onChange={(e) => setFilterCarburant(e.target.value)} className="vs-select">
              <option value="tous">Carburant</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
            </select>
            <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)} className="vs-select">
              <option value="tous">Transmission</option>
              <option value="Automatique">Automatique</option>
              <option value="Manuelle">Manuelle</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Table ═══ */}
      {filtered.length > 0 ? (
        <div className="vs-table-wrapper">
          <table className="vs-table">
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Année</th>
                <th>Couleur</th>
                <th>Km</th>
                <th>Carburant</th>
                <th>Transmission</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const statusConfig = getStatusConfig(v.statut);
                return (
                  <tr key={v.id}>
                    <td data-label="Véhicule">
                      <div className="vs-vehicle-cell">
                        <img src={v.image} alt={v.modele} className="vs-vehicle-img" />
                        <div>
                          <p className="vs-vehicle-name">{v.marque} {v.modele}</p>
                          <p className="vs-vehicle-vin">{v.vin}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Année">
                      <span className="vs-vehicle-year">{v.annee}</span>
                    </td>
                    <td data-label="Couleur">
                      <span className="vs-vehicle-color-dot" style={{ background: getColorHex(v.couleur) }} />
                      <span className="vs-vehicle-color">{v.couleur}</span>
                    </td>
                    <td data-label="Km">
                      <span className="vs-vehicle-km">
                        {v.kilometrage === 0 ? 'Neuf' : `${new Intl.NumberFormat('fr-DZ').format(v.kilometrage)} km`}
                      </span>
                    </td>
                    <td data-label="Carburant">
                      <span className={`vs-badge ${v.carburant === 'Essence' ? 'vs-badge-essence' : 'vs-badge-diesel'}`}>
                        {v.carburant}
                      </span>
                    </td>
                    <td data-label="Transmission">
                      <span className={`vs-badge ${v.transmission === 'Automatique' ? 'vs-badge-auto' : 'vs-badge-manuelle'}`}>
                        {v.transmission}
                      </span>
                    </td>
                    <td data-label="Prix">
                      <span className="vs-vehicle-price">{formatPrice(v.prix)}</span>
                    </td>
                    <td data-label="Statut">
                      <span className={`vs-status-badge ${statusConfig.className}`}>
                        ● {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="vs-empty">
          <DirectionsCar sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="vs-empty-text">Aucun véhicule trouvé</p>
        </div>
      )}
    </div>
  );
};

export default VehiculeStock;