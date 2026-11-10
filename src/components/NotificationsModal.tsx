import React from 'react';
import { Bell, Calendar, CheckCheck, X, Video, AlertTriangle, GraduationCap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    userNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setUserTab,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl text-white flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Centro de Notificaciones</h3>
              <p className="text-[11px] text-slate-400">Eventos, coaching y avisos de administración</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userNotifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Leídas</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Notificaciones */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {userNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            userNotifications.map((notif) => {
              const isEvent = notif.type === 'event_enrollment' || notif.type === 'event_reminder';
              const isLive = notif.type === 'live_stream';
              const isModeration = notif.type === 'moderation';
              const isCoaching = notif.type === 'coaching';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (isEvent) {
                      setUserTab('events');
                      setIsNotificationsOpen(false);
                    } else if (isCoaching) {
                      setUserTab('coaching');
                      setIsNotificationsOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                      : isModeration
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-md'
                      : 'bg-slate-950 border-teal-500/40 shadow-md ring-1 ring-teal-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isLive || isModeration
                          ? 'bg-rose-500/20 text-rose-400'
                          : isCoaching
                          ? 'bg-purple-500/20 text-purple-400'
                          : isEvent
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {isLive ? (
                        <Video className="w-4 h-4" />
                      ) : isModeration ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isCoaching ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Calendar className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {(isEvent || isCoaching) && (
                        <div className="mt-2 text-[10px] font-bold text-teal-400 flex items-center gap-1">
                          <span>{isEvent ? 'Ir a Eventos' : 'Ver Estado en Coaching'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
