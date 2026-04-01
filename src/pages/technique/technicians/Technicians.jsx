import { useState } from 'react';
import {
  Engineering, Phone, Email, CheckCircle,
  HourglassEmpty, Build, TrendingUp,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { mockTechnicians } from '../../../data/mockData';
import '../../../styles/technicians.css';

const Technicians = () => {
  const [technicians] = useState(mockTechnicians);

  const stats = {
    total: technicians.length,
    disponibles: technicians.filter((t) => t.status === 'disponible').length,
    occupes: technicians.filter((t) => t.status === 'occupe').length,
    totalInterventions: technicians.reduce((sum, t) => sum + t.interventionsTotal, 0),
  };

  const getProgressColor = (taux) => {
    if (taux >= 95) return '#22c55e';
    if (taux >= 90) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="tch-page">
      <div className="tch-header">
        <div>
          <h1 className="tch-header-title">Techniciens</h1>
          <p className="tch-header-subtitle">Gestion et suivi du personnel technique</p>
        </div>
      </div>

      <div className="tch-stats-grid">
        <div className="tch-stat-card">
          <div className="tch-stat-row">
            <div><p className="tch-stat-label">Total</p><p className="tch-stat-value" style={{ color: '#1e293b' }}>{stats.total}</p></div>
            <div className="tch-stat-icon" style={{ background: '#eff6ff' }}><Engineering sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
        <div className="tch-stat-card">
          <div className="tch-stat-row">
            <div><p className="tch-stat-label">Disponibles</p><p className="tch-stat-value" style={{ color: '#16a34a' }}>{stats.disponibles}</p></div>
            <div className="tch-stat-icon" style={{ background: '#f0fdf4' }}><CheckCircle sx={{ fontSize: 22, color: '#22c55e' }} /></div>
          </div>
        </div>
        <div className="tch-stat-card">
          <div className="tch-stat-row">
            <div><p className="tch-stat-label">Occupés</p><p className="tch-stat-value" style={{ color: '#b45309' }}>{stats.occupes}</p></div>
            <div className="tch-stat-icon" style={{ background: '#fffbeb' }}><HourglassEmpty sx={{ fontSize: 22, color: '#f59e0b' }} /></div>
          </div>
        </div>
        <div className="tch-stat-card">
          <div className="tch-stat-row">
            <div><p className="tch-stat-label">Interventions</p><p className="tch-stat-value" style={{ color: '#1976D2' }}>{stats.totalInterventions}</p></div>
            <div className="tch-stat-icon" style={{ background: '#eff6ff' }}><Build sx={{ fontSize: 22, color: '#1976D2' }} /></div>
          </div>
        </div>
      </div>

      {technicians.length > 0 ? (
        <div className="tch-grid">
          {technicians.map((tech) => (
            <div key={tech.id} className="tch-card">
              <div className="tch-card-body">
                {/* Profile */}
                <div className="tch-card-profile">
                  <div className="tch-avatar-wrapper">
                    <Avatar src={tech.photo} sx={{ width: 52, height: 52 }} />
                    <div className={`tch-status-dot ${tech.status === 'disponible' ? 'tch-status-dot-disponible' : 'tch-status-dot-occupe'}`} />
                  </div>
                  <div>
                    <h3 className="tch-card-name">{tech.name}</h3>
                    <p className="tch-card-specialite">{tech.specialite}</p>
                    <span className="tch-card-niveau">{tech.niveau}</span>
                  </div>
                </div>

                {/* Status */}
                <span className={`tch-status-badge ${tech.status === 'disponible' ? 'tch-status-disponible' : 'tch-status-occupe'}`}>
                  ● {tech.status === 'disponible' ? 'Disponible' : 'Occupé'}
                  {tech.interventionsEnCours > 0 && ` (${tech.interventionsEnCours} en cours)`}
                </span>

                {/* Contact */}
                <div className="tch-card-contact">
                  <div className="tch-contact-row">
                    <Phone /> {tech.telephone}
                  </div>
                  <div className="tch-contact-row">
                    <Email /> {tech.email}
                  </div>
                </div>

                {/* Performance */}
                <div className="tch-card-performance">
                  <p className="tch-perf-title">Performance</p>
                  <div className="tch-perf-grid">
                    <div className="tch-perf-item">
                      <p className="tch-perf-value" style={{ color: '#1976D2' }}>{tech.interventionsTotal}</p>
                      <p className="tch-perf-label">Total</p>
                    </div>
                    <div className="tch-perf-item">
                      <p className="tch-perf-value" style={{ color: '#f59e0b' }}>{tech.interventionsEnCours}</p>
                      <p className="tch-perf-label">En cours</p>
                    </div>
                    <div className="tch-perf-item">
                      <p className="tch-perf-value" style={{ color: '#22c55e' }}>{tech.tauxReussite}%</p>
                      <p className="tch-perf-label">Réussite</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="tch-progress-wrapper">
                    <div className="tch-progress-header">
                      <span className="tch-progress-label">Taux de réussite</span>
                      <span className="tch-progress-value">{tech.tauxReussite}%</span>
                    </div>
                    <div className="tch-progress-bar">
                      <div
                        className="tch-progress-fill"
                        style={{
                          width: `${tech.tauxReussite}%`,
                          background: getProgressColor(tech.tauxReussite),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tch-empty">
          <Engineering sx={{ fontSize: 48, color: '#e0e0e0' }} />
          <p className="tch-empty-text">Aucun technicien trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Technicians;