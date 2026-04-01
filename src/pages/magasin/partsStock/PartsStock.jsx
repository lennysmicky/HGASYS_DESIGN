import { useState } from 'react';
import {
  Inventory, Warning, Category, AttachMoney,
  CheckCircle, TrendingDown,
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { mockParts } from '../../../data/mockData';
import '../../../styles/partsStock.css';

const PartsStock = () => {
  const [parts] = useState(mockParts);

  const formatPrice = (p) => new Intl.NumberFormat('fr-DZ').format(p) + 'CFA';

  const criticalParts = parts.filter((p) => p.stock <= p.stockMin);
  const okParts = parts.filter((p) => p.stock > p.stockMin);

  const stats = {
    total: parts.length,
    totalStock: parts.reduce((sum, p) => sum + p.stock, 0),
    critique: criticalParts.length,
    valeurStock: parts.reduce((sum, p) => sum + (p.prixVente * p.stock), 0),
  };

  // Données par catégorie
  const catMap = {};
  parts.forEach((p) => {
    if (!catMap[p.categorie]) catMap[p.categorie] = { count: 0, stock: 0 };
    catMap[p.categorie].count++;
    catMap[p.categorie].stock += p.stock;
  });

  const catData = Object.entries(catMap).map(([cat, data]) => ({
    categorie: cat, count: data.count, stock: data.stock,
  })).sort((a, b) => b.stock - a.stock);

  // PieChart
  const statusData = [
    { name: 'OK', value: okParts.length, color: '#22c55e' },
    { name: 'Critique', value: criticalParts.length, color: '#ef4444' },
  ];

  const catColors = {
    Filtres: '#3b82f6', Freinage: '#ef4444', Huiles: '#f59e0b',
    Climatisation: '#6366f1', Distribution: '#8b5cf6', Electronique: '#10b981',
    Electricité: '#f97316', Suspension: '#14b8a6', Liquides: '#2563eb',
  };

  const getCatBg = (cat) => {
    const bgs = {
      Filtres: '#dbeafe', Freinage: '#fee2e2', Huiles: '#fef3c7',
      Climatisation: '#e0e7ff', Distribution: '#f3e8ff', Electronique: '#d1fae5',
      Electricité: '#ffedd5', Suspension: '#ccfbf1', Liquides: '#eff6ff',
    };
    return bgs[cat] || '#f1f5f9';
  };

  return (
    <div className="psk-page">
      <div className="psk-header">
        <div>
          <h1 className="psk-header-title">Stock Pièces</h1>
          <p className="psk-header-subtitle">Vue d'ensemble et alertes stock</p>
        </div>
      </div>

      {criticalParts.length > 0 && (
        <div className="psk-alert">
          <Warning sx={{ fontSize: 18 }} />
          <span><span className="psk-alert-bold">Attention !</span> {criticalParts.length} pièce{criticalParts.length > 1 ? 's' : ''} en stock critique nécessitant un réapprovisionnement.</span>
        </div>
      )}

      <div className="psk-stats-grid">
        <div className="psk-stat-card">
          <div className="psk-stat-row">
            <div><p className="psk-stat-label">Références</p><p className="psk-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div>
            <div className="psk-stat-icon" style={{ background: '#eff6ff' }}><Inventory sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
        <div className="psk-stat-card">
          <div className="psk-stat-row">
            <div><p className="psk-stat-label">Pièces en stock</p><p className="psk-stat-value" style={{ color: '#16a34a' }}>{stats.totalStock}</p></div>
            <div className="psk-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div>
          </div>
        </div>
        <div className="psk-stat-card">
          <div className="psk-stat-row">
            <div><p className="psk-stat-label">Stock critique</p><p className="psk-stat-value" style={{ color: '#ef4444' }}>{stats.critique}</p></div>
            <div className="psk-stat-icon" style={{ background: '#fef2f2' }}><Warning sx={{ fontSize: 22, color: '#ef4444' }} /></div>
          </div>
        </div>
        <div className="psk-stat-card">
          <div className="psk-stat-row">
            <div><p className="psk-stat-label">Valeur stock</p><p className="psk-stat-value" style={{ color: '#1976D2', fontSize: '1rem' }}>{formatPrice(stats.valeurStock)}</p></div>
            <div className="psk-stat-icon" style={{ background: '#eff6ff' }}><AttachMoney sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="psk-charts-section">
        <div className="psk-chart-card">
          <h3 className="psk-chart-title">État du stock</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>
                {statusData.map((e, i) => (<Cell key={i} fill={e.color} />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.6875rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {statusData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                <span style={{ fontSize: '0.625rem', color: '#64748b' }}>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="psk-chart-card">
          <h3 className="psk-chart-title">Stock par catégorie</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="categorie" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.6875rem' }} />
              <Bar dataKey="stock" fill="#1976D2" radius={[4, 4, 0, 0]} name="Quantité" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical items */}
      {criticalParts.length > 0 && (
        <div className="psk-critical-section">
          <h3 className="psk-critical-title"><TrendingDown sx={{ fontSize: 16 }} /> Pièces en stock critique</h3>
          <div className="psk-critical-grid">
            {criticalParts.map((p) => (
              <div key={p.id} className="psk-critical-card">
                <div className="psk-critical-icon"><Warning sx={{ fontSize: 18, color: '#ef4444' }} /></div>
                <div className="psk-critical-info">
                  <p className="psk-critical-name">{p.nom}</p>
                  <p className="psk-critical-ref">{p.reference} • {p.emplacement}</p>
                </div>
                <div className="psk-critical-stock">
                  <p className="psk-critical-stock-value">{p.stock}</p>
                  <p className="psk-critical-stock-label">/ min {p.stockMin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview by category */}
      <div className="psk-overview">
        <h3 className="psk-overview-title">Vue par catégorie</h3>
        <div className="psk-overview-grid">
          {catData.map((cat) => (
            <div key={cat.categorie} className="psk-cat-card" style={{ background: getCatBg(cat.categorie) }}>
              <p className="psk-cat-count" style={{ color: catColors[cat.categorie] || '#64748b' }}>{cat.count}</p>
              <p className="psk-cat-name">{cat.categorie}</p>
              <p className="psk-cat-stock">{cat.stock} pièces en stock</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartsStock;