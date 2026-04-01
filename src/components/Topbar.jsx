// src/components/Topbar.jsx
import { useState } from 'react';
import {
  Menu as MenuIcon,
  Notifications,
  Logout,
  Person,
  Circle,
} from '@mui/icons-material';
import { Badge, Avatar, Popover } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../data/mockData';
import { PERMISSIONS, getRoleLabel, getRoleColor } from '../utils/roles';
import '../styles/topbar.css';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const unreadCount = mockNotifications.filter((n) => !n.lu).length;

  return (
    <header className="topbar">
      {/* ═══ Left ═══ */}
      <div className="topbar-left">
        <button
          onClick={onMenuClick}
          className="topbar-menu-btn"
        >
          <MenuIcon fontSize="small" />
        </button>

        <div className="topbar-welcome">
          <h1 className="topbar-welcome-title">
            Bienvenue, {user?.name?.split(' ')[0]}
          </h1>
          <p className="topbar-welcome-date">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* ═══ Right ═══ */}
      <div className="topbar-right">
        {/* ─── Notifications ─── */}
        <button
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          className="topbar-notif-btn"
        >
          <Badge badgeContent={unreadCount} color="error" variant="dot">
            <Notifications fontSize="small" />
          </Badge>
        </button>

        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 300, maxHeight: 350, mt: 1, borderRadius: 2 },
          }}
        >
          <div className="topbar-notif-header">
            <p>Notifications</p>
          </div>
          <div className="topbar-notif-list">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`topbar-notif-item ${!notif.lu ? 'topbar-notif-item-unread' : ''}`}
              >
                <div className="topbar-notif-item-content">
                  {!notif.lu && (
                    <Circle
                      className="topbar-notif-dot"
                      sx={{ fontSize: 8, color: '#1976D2' }}
                    />
                  )}
                  <div>
                    <p className="topbar-notif-text">{notif.message}</p>
                    <p className="topbar-notif-date">{notif.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Popover>

        {/* ─── Profile ─── */}
        <button
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          className="topbar-profile-btn"
        >
          <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
          <div className="topbar-profile-info">
            <p className="topbar-profile-name">{user?.name}</p>
            <p
              className="topbar-profile-role"
              style={{ color: getRoleColor(user?.role) }}
            >
              {getRoleLabel(user?.role)}
            </p>
          </div>
        </button>

        <Popover
          open={Boolean(profileAnchor)}
          anchorEl={profileAnchor}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 200, mt: 1, borderRadius: 2 },
          }}
        >
          <div className="topbar-profile-header">
            <Avatar src={user?.avatar} sx={{ width: 36, height: 36 }} />
            <div>
              <p className="topbar-profile-header-name">{user?.name}</p>
              <p className="topbar-profile-header-email">{user?.email}</p>
            </div>
          </div>
          <div className="topbar-profile-menu">
            <button className="topbar-profile-menu-item topbar-profile-menu-item-default">
              <Person fontSize="small" /> Mon Profil
            </button>
            <button
              onClick={logout}
              className="topbar-profile-menu-item topbar-profile-menu-item-danger"
            >
              <Logout fontSize="small" /> Déconnexion
            </button>
          </div>
        </Popover>
      </div>
    </header>
  );
};

export default Topbar;