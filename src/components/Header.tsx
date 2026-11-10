import React from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  LifeBuoy,
  LayoutDashboard,
  Smartphone,
  Bell,
  Radio,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setIsEmergencyModalOpen,
    setIsHelpModalOpen,
    setIsProfileModalOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    userProfile,
    liveBroadcast,
    acceptLiveBroadcast,
    hasScreenAccess,
    syncStatus,
    lastCloudSyncAt,
    forceSyncNow,
  } = useApp();

  const { logout } = useAuth();
  const canAccessAdmin = hasScreenAccess('admin_console');

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white w-full">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1">
                  Wellbeing<span className="text-teal-400">.</span>
                </h1>
                <button
                  type="button"
                  onClick={() => forceSyncNow()}
                  title={`Sincronización Cloud en tiempo real (<2s)${lastCloudSyncAt ? ` • Última: ${lastCloudSyncAt}` : ''}`}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border transition-all ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : syncStatus === 'syncing'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      syncStatus === 'synced'
                        ? 'bg-emerald-400 animate-pulse'
                        : syncStatus === 'syncing'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span className="hidden md:inline">
                    {syncStatus === 'synced' ? 'Live' : syncStatus === 'syncing' ? 'Sync...' : 'Offline'}
                  </span>
                </button>
              </div>
              <p className="text-[9px] text-slate-400 hidden md:block">Salud & Personas</p>
            </div>
          </div>

          {/* Indicador EN VIVO si hay transmisión activa de Meet */}
          {liveBroadcast.active && (
            <button
              type="button"
              onClick={acceptLiveBroadcast}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/50 hover:bg-rose-600/30 text-[10px] sm:text-xs font-bold transition-all animate-pulse shrink-0"
              title="Transmisión en Google Meet en vivo. Clic para unirte"
            >
              <Radio className="w-3 h-3 text-rose-400" />
              <span className="font-black uppercase hidden xs:inline">En Vivo (Meet)</span>
              <span className="font-black uppercase xs:hidden">Meet</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </button>
          )}

          {/* Center / View Mode Switcher Compacto y Responsivo */}
          {canAccessAdmin && (
            <div className="flex items-center bg-slate-900 p-0.5 sm:p-1 rounded-xl border border-slate-800 text-[11px] sm:text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('user')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${viewMode === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Colaborador</span>
                <span className="sm:hidden text-[10px]">App</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${viewMode === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Comando Central</span>
                <span className="sm:hidden text-[10px]">Admin</span>
              </button>
            </div>
          )}

          {/* Actions: Notifications, Profile, Help, Emergency (PRIORIDAD GARANTIZADA AL SOS) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Campanita de Notificaciones */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all shrink-0"
              title="Notificaciones de eventos y avisos"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Botón Mi Perfil / Avatar (editable) */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1 p-0.5 sm:px-2 sm:py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white transition-all shrink-0"
              title="Editar mis datos personales"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-teal-400 shrink-0"
              />
              <span className="hidden xl:inline text-xs font-semibold max-w-[80px] truncate">
                {userProfile.name.split(' ')[0]}
              </span>
            </button>

            {/* Botón de Ayuda PBP */}
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] sm:text-xs font-bold transition-all active:scale-95 shrink-0"
              title="Solicitar atención con People Business Partner (Correo)"
            >
              <LifeBuoy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
              <span className="hidden xs:inline">PBP</span>
            </button>

            {/* BOTÓN DE EMERGENCIA SOS: MÁXIMA PRIORIDAD Y VISIBILIDAD */}
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] sm:text-xs font-black shadow-lg shadow-red-600/40 transition-all active:scale-95 ring-2 ring-red-400/50 animate-pulse hover:animate-none shrink-0 z-10"
              title="Botón de Emergencia Inmediata (WhatsApp)"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="tracking-wide">SOS</span>
            </button>

            {/* Botón Cerrar Sesión OAuth */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition-all shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Botón Flotante Permanente de Emergencia (Floating Action Button para Móvil) */}
      {viewMode === 'user' && (
        <button
          type="button"
          onClick={() => setIsEmergencyModalOpen(true)}
          className="fixed bottom-20 right-3.5 z-40 bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white p-3 rounded-full shadow-[0_8px_25px_rgba(225,29,72,0.6)] border-2 border-white/30 flex items-center justify-center animate-bounce hover:animate-none active:scale-90 transition-transform sm:hidden"
          title="Botón de Emergencia Rápida"
        >
          <ShieldAlert className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  );
};
