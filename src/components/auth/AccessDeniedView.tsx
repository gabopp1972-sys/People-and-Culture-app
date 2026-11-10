import React from 'react';
import {
  ShieldAlert,
  Lock,
  LogOut,
  Mail,
  UserX,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import { AuthUser } from '../../types/auth';

interface AccessDeniedViewProps {
  user?: AuthUser | null;
  email?: string;
  isInactive?: boolean;
  reason?: string;
  onLogout: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  user,
  email,
  isInactive,
  reason,
  onLogout,
}) => {
  const currentEmail = email || user?.email || 'correo.desconocido@gmail.com';
  const currentName = user?.name || 'Usuario Autenticado';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1a0b16] to-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[140px] pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <span className="text-lg font-black text-white">
            Wellbeing<span className="text-teal-400">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border text-amber-300 bg-amber-950/40 border-amber-500/30">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">
            {isInactive ? 'Perfil Suspendido / Inactivo' : 'Acceso Restringido'}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="w-full max-w-lg bg-slate-900/95 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-amber-500/50 bg-amber-950/60 shadow-lg mb-4 animate-pulse">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>

            <h1 className="text-2xl font-black text-white">
              {isInactive ? 'Perfil Marcado como Inactivo' : 'Acceso Denegado'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              {reason ||
                'Tu cuenta de Google fue autenticada correctamente, pero tu perfil se encuentra temporalmente inactivo en el Comando Central de Wellbeing.'}
            </p>
          </div>

          <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Correo Google:</span>
              </span>
              <span className="font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded-md text-[11px]">
                {currentEmail}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <UserX className="w-3.5 h-3.5 text-amber-400" />
                <span>Usuario:</span>
              </span>
              <span className="font-semibold text-slate-200">{currentName}</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Estado:
              </span>
              <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] border bg-rose-500/20 text-rose-300 border-rose-500/40">
                {isInactive ? 'PERFIL SUSPENDIDO' : 'NO AUTORIZADO'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión e Ingresar con Otra Cuenta</span>
          </button>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-6 py-4 text-center text-xs text-slate-500">
        Control de Accesos Wellbeing • People & Culture
      </footer>
    </div>
  );
};
