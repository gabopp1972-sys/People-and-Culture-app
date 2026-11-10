import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Sparkles,
  X,
  CheckCircle,
  Camera,
  MessageSquare,
  UserPlus,
  Users,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const sampleAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
];

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    userProfile,
    updateUserProfile,
    registerNewUser,
    usersDirectory,
    switchActiveUser,
  } = useApp();

  const [mode, setMode] = useState<'edit' | 'register' | 'switch'>('edit');

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [msTeamsUser, setMsTeamsUser] = useState(userProfile.msTeamsUser || '');
  const [department, setDepartment] = useState(userProfile.department);
  const [position, setPosition] = useState(userProfile.position);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [wellnessGoal, setWellnessGoal] = useState(userProfile.wellnessGoal);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar campos al cambiar de usuario activo o modo
  useEffect(() => {
    if (mode === 'edit') {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setMsTeamsUser(userProfile.msTeamsUser || '');
      setDepartment(userProfile.department);
      setPosition(userProfile.position);
      setAvatar(userProfile.avatar);
      setWellnessGoal(userProfile.wellnessGoal);
    } else if (mode === 'register') {
      setName('');
      setEmail('');
      setPhone('+5255');
      setMsTeamsUser('');
      setDepartment('');
      setPosition('');
      setAvatar(sampleAvatars[1]);
      setWellnessGoal('');
    }
  }, [mode, userProfile, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (mode === 'register') {
      registerNewUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        msTeamsUser: msTeamsUser.trim() || email.trim(),
        department: department.trim() || 'General',
        position: position.trim() || 'Colaborador',
        avatar: avatar.trim() || sampleAvatars[0],
        wellnessGoal: wellnessGoal.trim() || 'Bienestar integral',
      });
    } else {
      updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        msTeamsUser: msTeamsUser.trim() || email.trim(),
        department: department.trim() || 'General',
        position: position.trim() || 'Colaborador',
        avatar: avatar.trim(),
        wellnessGoal: wellnessGoal.trim(),
        registered: true,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setMode('edit');
      setIsProfileModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/50 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {mode === 'register'
                  ? 'Registrar Nuevo Usuario'
                  : mode === 'switch'
                  ? 'Cambiar Cuenta Activa'
                  : 'Mi Perfil & Canales de Contacto'}
              </h2>
              <p className="text-[11px] text-teal-100 mt-0.5">
                Rol actual: <strong className="uppercase">{userProfile.role}</strong> • Pantallas: {userProfile.allowedScreens.length}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Modo: solo administradores pueden crear o simular cuentas */}
        {userProfile.role === 'admin' && (
          <div className="px-5 pt-4">
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  mode === 'edit' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Mi Perfil</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  mode === 'register' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Nuevo Usuario</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('switch')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  mode === 'switch' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Cuentas ({usersDirectory.length})</span>
              </button>
            </div>
          </div>
        )}

        {savedSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400">
              {mode === 'register' ? '¡Usuario Registrado!' : '¡Perfil Actualizado!'}
            </h3>
            <p className="text-slate-300 text-sm">
              Tus canales de WhatsApp, Correo y Microsoft Teams quedaron vinculados correctamente.
            </p>
          </div>
        ) : mode === 'switch' ? (
          <div className="p-5 space-y-3 text-xs">
            <p className="text-slate-400 text-[11px]">
              Selecciona una cuenta para navegar por la app y comprobar sus notificaciones o permisos configurados desde el Comando Central:
            </p>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {usersDirectory.map((usr) => {
                const isCurrent = usr.id === userProfile.id;
                return (
                  <div
                    key={usr.id}
                    onClick={() => {
                      switchActiveUser(usr.id);
                      setIsProfileModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-teal-400 bg-teal-500/10 ring-1 ring-teal-400/30'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white truncate">{usr.name}</h4>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                            {usr.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{usr.email}</p>
                        <p className="text-[10px] text-indigo-300 truncate">
                          Teams: {usr.msTeamsUser} • Estado: {usr.active ? '🟢 Activo' : '🔴 Suspendido'}
                        </p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold text-teal-400 shrink-0">Activa</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Selector de Foto / Avatar */}
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
                Foto de Perfil / Avatar
              </label>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={avatar}
                  alt="Avatar seleccionado"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {sampleAvatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(av)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                          avatar === av ? 'border-teal-400 scale-110 ring-2 ring-teal-400/30' : 'border-slate-700 hover:scale-105'
                        }`}
                      >
                        <img src={av} alt="Avatar opción" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="URL de fotografía..."
                  className="bg-transparent text-[11px] text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Datos Personales + MS Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-teal-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana María Torres"
                    className="bg-transparent text-white focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Correo Gmail Autorizado *
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <input
                    type="email"
                    required
                    readOnly={mode === 'edit' && userProfile.role !== 'admin'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@gmail.com"
                    className={`bg-transparent text-white focus:outline-none w-full font-mono text-[11px] ${
                      mode === 'edit' && userProfile.role !== 'admin' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp *</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+5255..."
                    className="bg-transparent text-white focus:outline-none w-full font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-indigo-300 font-semibold mb-1">
                  Usuario Microsoft Teams *
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={msTeamsUser}
                    onChange={(e) => setMsTeamsUser(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="bg-transparent text-white focus:outline-none w-full font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Departamento / Área *</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ej. Operaciones"
                    className="bg-transparent text-white focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Puesto o Rol</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Briefcase className="w-4 h-4 text-teal-400 shrink-0" />
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ej. Analista Senior"
                    className="bg-transparent text-white focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Objetivo de Bienestar Personal</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={wellnessGoal}
                  onChange={(e) => setWellnessGoal(e.target.value)}
                  placeholder="Ej. Liderazgo consciente, pausas activas..."
                  className="bg-transparent text-white focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-xl text-[11px] text-indigo-200 flex items-start gap-2">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Tus canales de <strong>WhatsApp, Correo y Microsoft Teams</strong> se utilizarán automáticamente para notificarte la aprobación e inicio de procesos de coaching y alertas de eventos.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 hover:from-teal-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-teal-500/25 transition-all active:scale-[0.99] text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {mode === 'register'
                    ? 'Registrar Cuenta e Ingresar a Wellbeing'
                    : 'Guardar Datos de Perfil'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
