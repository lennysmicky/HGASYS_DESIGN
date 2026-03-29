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
import { PERMISSIONS } from '../utils/roles';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const unreadCount = mockNotifications.filter((n) => !n.lu).length;

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <MenuIcon fontSize="small" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-800">
            Bienvenue, {user?.name?.split(' ')[0]} 
          </h1>
          <p className="text-[11px] text-gray-400">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
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
            sx: { width: 300, maxHeight: 350, mt: 1, borderRadius: 2 }
          }}
        >
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-3 py-2.5 border-b border-gray-50 hover:bg-gray-50 cursor-pointer
                  ${!notif.lu ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!notif.lu && (
                    <Circle sx={{ fontSize: 8, color: '#1976D2', mt: '5px' }} />
                  )}
                  <div>
                    <p className="text-xs text-gray-700">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{notif.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Popover>

        {/* Profile */}
        <button
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <Avatar
            src={user?.avatar}
            sx={{ width: 32, height: 32 }}
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-gray-700">{user?.name}</p>
            <p className="text-[10px]" style={{ color: PERMISSIONS[user?.role]?.color }}>
              {PERMISSIONS[user?.role]?.label}
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
            sx: { width: 200, mt: 1, borderRadius: 2 }
          }}
        >
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <Avatar src={user?.avatar} sx={{ width: 36, height: 36 }} />
            <div>
              <p className="text-xs font-semibold">{user?.name}</p>
              <p className="text-[10px] text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="py-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
              <Person fontSize="small" /> Mon Profil
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
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