import React, { useEffect, useRef } from 'react';
import { AuthProviderComponent, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FeedSection } from './components/FeedSection';
import { SurveysSection } from './components/SurveysSection';
import { EventsSection } from './components/EventsSection';
import { CoachingSection } from './components/CoachingSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmergencyModal } from './components/EmergencyModal';
import { HelpModal } from './components/HelpModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UserCreatePostModal } from './components/UserCreatePostModal';
import { LiveBroadcastModal } from './components/LiveBroadcastModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ShareSurveyModal } from './components/ShareSurveyModal';
import { LoginView } from './components/auth/LoginView';
import { AccessDeniedView } from './components/auth/AccessDeniedView';
import {
  Sparkles,
  ClipboardCheck,
  Calendar,
  GraduationCap,
  Smartphone,
  Maximize2,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    viewMode,
    userTab,
    setUserTab,
    isMobileDeviceFrame,
    setIsMobileDeviceFrame,
    userProfile,
    hasScreenAccess,
  } = useApp();

  const navItems: {
    id: 'feed' | 'surveys' | 'events' | 'coaching';
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'feed', label: 'Feed', icon: Sparkles },
    { id: 'surveys', label: 'Encuestas', icon: ClipboardCheck },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'coaching', label: 'Coaching', icon: GraduationCap },
  ];

  const authorizedNavItems = navItems.filter((item) => hasScreenAccess(item.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      {/* Header Superior Global */}
      <Header />

      {/* Contenido Principal */}
      <main className="flex-1 w-full mx-auto px-2 sm:px-4 pt-3 sm:pt-6 pb-28 flex flex-col items-center">
        {viewMode === 'admin' && hasScreenAccess('admin_console') ? (
          <div className="w-full max-w-6xl">
            <AdminDashboard />
          </div>
        ) : (
          <div
            className={`w-full transition-all duration-300 ${
              isMobileDeviceFrame
                ? 'max-w-[420px] bg-slate-900/95 border-[8px] border-slate-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-3 pt-5 min-h-[820px] relative'
                : 'max-w-2xl'
            }`}
          >
            {isMobileDeviceFrame && (
              <div className="w-28 h-5 bg-black rounded-full mx-auto mb-4 border border-slate-700/60 shadow-inner flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                <div className="w-2 h-2 rounded-full bg-blue-900/40" />
              </div>
            )}

            {/* Toggle de Enmarcado Móvil */}
            <div className="hidden lg:flex items-center justify-end mb-3">
              <button
                type="button"
                onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
                className="text-[11px] font-semibold text-slate-400 hover:text-teal-300 flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 shadow-sm transition-all"
              >
                {isMobileDeviceFrame ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Expandir Vista</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    <span>Simular Teléfono Móvil</span>
                  </>
                )}
              </button>
            </div>

            {/* Selector de pestañas Desktop dinámico según pantallas autorizadas */}
            {authorizedNavItems.length > 0 && (
              <div className="hidden sm:flex items-center justify-center mb-5">
                <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-lg">
                  {authorizedNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUserTab(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          userTab === item.id
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vistas según pestaña y autorización */}
            {authorizedNavItems.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                No tienes pantallas habilitadas. Contacta al administrador del Comando Central.
              </div>
            ) : (
              <div className="w-full">
                {userTab === 'feed' && hasScreenAccess('feed') && <FeedSection />}
                {userTab === 'surveys' && hasScreenAccess('surveys') && <SurveysSection />}
                {userTab === 'events' && hasScreenAccess('events') && <EventsSection />}
                {userTab === 'coaching' && hasScreenAccess('coaching') && <CoachingSection />}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CINTILLO INFERIOR MÓVIL DE ALTA VISIBILIDAD (DINÁMICO POR PERMISOS) */}
      {viewMode === 'user' && userProfile.active && authorizedNavItems.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t-2 border-teal-500/40 px-2 py-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.9)]">
          <div
            className="max-w-md mx-auto grid gap-1"
            style={{ gridTemplateColumns: `repeat(${authorizedNavItems.length}, minmax(0, 1fr))` }}
          >
            {authorizedNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setUserTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                    userTab === item.id
                      ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/30 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Modales Globales */}
      <EmergencyModal />
      <HelpModal />
      <UserProfileModal />
      <UserCreatePostModal />
      <LiveBroadcastModal />
      <NotificationsModal />
      <ShareSurveyModal />
    </div>
  );
};

const AuthGate: React.FC = () => {
  const { user, isAuthenticated, deniedInfo, logout } = useAuth();
  const { userProfile, syncAuthenticatedGoogleUser, findAuthorizedProfileByEmail } = useApp();
  const syncedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && syncedEmailRef.current !== user.email) {
      syncedEmailRef.current = user.email;
      syncAuthenticatedGoogleUser(user);
    }
    if (!isAuthenticated) {
      syncedEmailRef.current = null;
    }
  }, [isAuthenticated, user, syncAuthenticatedGoogleUser]);

  if (deniedInfo) {
    return (
      <AccessDeniedView
        email={deniedInfo.email}
        isInactive={deniedInfo.isInactive}
        reason={deniedInfo.reason}
        onLogout={logout}
      />
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

  const authorizedProfile = findAuthorizedProfileByEmail(user.email);

  if (!authorizedProfile) {
    return (
      <AccessDeniedView
        user={user}
        email={user.email}
        isInactive={false}
        reason={`Acceso denegado: El correo electrónico "${user.email}" no se encuentra registrado en la configuración de accesos del Comando Central de Wellbeing.`}
        onLogout={logout}
      />
    );
  }

  if (!authorizedProfile.active || !userProfile.active) {
    return (
      <AccessDeniedView
        user={user}
        email={authorizedProfile.email}
        isInactive={true}
        reason={`La cuenta "${authorizedProfile.name}" (${user.email}) se encuentra actualmente marcada como INACTIVA / SUSPENDIDA desde el Comando Central.`}
        onLogout={logout}
      />
    );
  }

  return <MainAppContent />;
};

export default function App() {
  return (
    <AuthProviderComponent>
      <AppProvider>
        <AuthGate />
      </AppProvider>
    </AuthProviderComponent>
  );
}
