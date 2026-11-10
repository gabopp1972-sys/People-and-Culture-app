import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Check,
  Calendar,
  Send,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Coach, CoachingGoalArea } from '../types';

const goalAreaOptions: { id: CoachingGoalArea; label: string; icon: string }[] = [
  { id: 'team_building', label: 'Construcción de equipo', icon: '🤝' },
  { id: 'communication', label: 'Comunicación', icon: '💬' },
  { id: 'leadership', label: 'Liderazgo', icon: '🦁' },
  { id: 'customer_relation', label: 'Relación con el cliente', icon: '👥' },
  { id: 'decision_making', label: 'Toma de decisiones', icon: '🧭' },
  { id: 'conflict_resolution', label: 'Solución de Conflictos', icon: '⚖️' },
  { id: 'personal_vision', label: 'Visión Personal', icon: '🎯' },
  { id: 'others', label: 'Otros...', icon: '✨' },
];

export const CoachingSection: React.FC = () => {
  const { coaches, createCoachingRequest, currentUser, coachingRequests } = useApp();
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const [reason, setReason] = useState('');
  const [startDatePreference, setStartDatePreference] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<CoachingGoalArea[]>(['leadership']);
  const [otherDetails, setOtherDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Solo coaches activos en la vista de colaborador y filtrados por búsqueda
  const activeCoaches = coaches
    .filter((c) => c.active)
    .filter((c) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.specialties.some((s) => s.toLowerCase().includes(term))
      );
    });

  const toggleSelectCoach = (coachId: string) => {
    if (selectedCoachIds.includes(coachId)) {
      setSelectedCoachIds(selectedCoachIds.filter((id) => id !== coachId));
    } else {
      if (selectedCoachIds.length >= 3) {
        alert('Puedes seleccionar como máximo tres (3) opciones de coaches prioritarios.');
        return;
      }
      setSelectedCoachIds([...selectedCoachIds, coachId]);
    }
  };

  const toggleGoal = (goal: CoachingGoalArea) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length === 1) {
        alert('Debes seleccionar al menos un (1) tema de trabajo.');
        return;
      }
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      if (selectedGoals.length >= 3) {
        alert('Puedes elegir de uno a tres (1 a 3) temas de trabajo.');
        return;
      }
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCoachIds.length === 0) {
      alert('Por favor selecciona al menos un coach de tu preferencia.');
      return;
    }

    if (!reason.trim()) {
      alert('Por favor indica brevemente el motivo del coaching.');
      return;
    }

    if (!startDatePreference) {
      alert('Por favor indica a partir de qué fecha estás disponible.');
      return;
    }

    if (selectedGoals.length < 1 || selectedGoals.length > 3) {
      alert('Debes elegir de 1 a 3 temas de trabajo.');
      return;
    }

    createCoachingRequest({
      coacheeName: currentUser.name,
      coacheeEmail: currentUser.email,
      coacheePhone: currentUser.phone,
      coacheeTeams: currentUser.msTeamsUser,
      coacheeDepartment: currentUser.department,
      selectedCoachIds,
      reason: reason.trim(),
      startDatePreference,
      goalAreas: selectedGoals,
      otherDetails: otherDetails.trim() || undefined,
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSubmittedSuccess(true);
  };

  // Mis solicitudes anteriores
  const myRequests = coachingRequests.filter(
    (r) => r.coacheeEmail === currentUser.email
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6 text-white animate-fade-in">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Acompañamiento Personal & Ejecutivo
          </div>
          <h2 className="text-2xl font-black text-white">Roster de Coaches Certificados</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Explora los perfiles de nuestros mentores y coaches. Selecciona hasta 3 alternativas y levanta tu solicitud personalizada para tu plan de desarrollo.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs text-purple-300 font-semibold flex items-center gap-2">
            <span>Coaches seleccionados:</span>
            <span className="w-6 h-6 rounded-full bg-purple-500 text-slate-950 font-black flex items-center justify-center text-xs">
              {selectedCoachIds.length}/3
            </span>
          </div>
          {selectedCoachIds.length > 0 && !isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Continuar con Solicitud</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Roster de Coaches */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Coaches Disponibles ({activeCoaches.length})
            </h3>
            <span className="text-xs text-slate-400">
              Elige hasta 3 opciones en orden de preferencia
            </span>
          </div>

          {/* Barra de búsqueda interactiva */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 w-full sm:w-64 focus-within:border-purple-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por especialidad o coach..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeCoaches.map((coach) => {
            const isSelected = selectedCoachIds.includes(coach.id);
            const selectionIndex = selectedCoachIds.indexOf(coach.id) + 1;

            return (
              <div
                key={coach.id}
                className={`bg-slate-900 border rounded-2xl p-5 text-white transition-all shadow-lg flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badge de prioridad si fue seleccionado */}
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border border-purple-300 flex items-center gap-1 animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Opción {selectionIndex}</span>
                  </div>
                )}

                <div>
                  {/* Header coach */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-white truncate">{coach.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{coach.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-purple-300 font-medium truncate mt-0.5">
                        {coach.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{coach.availableDays}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                    {coach.bio}
                  </p>

                  {/* Especialidades / Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {coach.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Credenciales */}
                  <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Certificaciones Clave
                    </span>
                    {coach.credentials.map((cred, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-teal-400 shrink-0" />
                        <span className="truncate">{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de selección */}
                <button
                  type="button"
                  onClick={() => toggleSelectCoach(coach.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Seleccionado como Opción {selectionIndex}</span>
                    </>
                  ) : (
                    <span>Elegir como alternativa ({selectedCoachIds.length}/3)</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating CTA to open form */}
      {selectedCoachIds.length > 0 && !isFormOpen && (
        <div className="sticky bottom-6 z-20 bg-slate-900 border border-purple-500/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold text-white block">
              Has seleccionado {selectedCoachIds.length} coach{selectedCoachIds.length > 1 ? 'es' : ''}
            </span>
            <span className="text-slate-400 text-[11px]">
              Completa los objetivos y fecha disponible para enviar tu solicitud
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-1.5 transition-all"
          >
            <span>Levantar Solicitud</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulario de Solicitud de Coaching */}
      {isFormOpen && (
        <div className="bg-slate-900 border-2 border-purple-500/60 rounded-2xl p-6 shadow-2xl text-white space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/40">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Solicitud Formal de Coaching</h3>
                <p className="text-xs text-slate-400">
                  La administración central gestionará la asignación final con tu coach
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cerrar Formulario
            </button>
          </div>

          {submittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-emerald-400">¡Solicitud Registrada con Éxito!</h4>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Tu solicitud ha sido transmitida al <strong>Comando Central de Coaching</strong>. El equipo revisará tus opciones prioritarias y formalizará la asignación con el coach seleccionado.
              </p>
              <div className="p-4 bg-slate-950 rounded-xl max-w-md mx-auto text-left text-xs text-slate-300 space-y-1 border border-slate-800">
                <p>• Solicitante: <span className="text-white font-medium">{currentUser.name}</span></p>
                <p>• Temas elegidos: <span className="text-purple-300 font-medium">{selectedGoals.join(', ')}</span></p>
                <p>• Estado actual: <span className="text-amber-400 font-bold uppercase">Pendiente de asignación central</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setIsFormOpen(false);
                  setSelectedCoachIds([]);
                  setReason('');
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Resumen de Coaches Elegidos */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">
                  Tus alternativas seleccionadas ({selectedCoachIds.length}/3):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCoachIds.map((id, idx) => {
                    const c = coaches.find((coach) => coach.id === id);
                    if (!c) return null;
                    return (
                      <div
                        key={id}
                        className="bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
                      >
                        <span className="w-4 h-4 rounded-full bg-purple-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1. Motivo del coaching */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  1. Motivo breve del coaching <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe brevemente cuál es tu reto actual, situación o qué te motiva a iniciar este proceso de acompañamiento..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 resize-none placeholder-slate-400"
                />
              </div>

              {/* 2. Fecha disponible */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. ¿A partir de cuándo estás disponible para tomarlo? <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <input
                    type="date"
                    required
                    value={startDatePreference}
                    onChange={(e) => setStartDatePreference(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* 3. Selección de 1 a 3 temas de trabajo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    3. Resultados que esperas obtener (Elige de 1 a 3 temas de trabajo) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-purple-300 font-mono font-bold">
                    {selectedGoals.length}/3 seleccionados
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {goalAreaOptions.map((goal) => {
                    const isChecked = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isChecked
                            ? 'border-purple-400 bg-purple-500/20 text-purple-200 font-bold ring-1 ring-purple-400/40'
                            : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xl mb-1">{goal.icon}</span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs leading-tight">{goal.label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalle si eligió 'Otros...' o notas complementarias */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detalles adicionales sobre los resultados esperados (Opcional)
                </label>
                <input
                  type="text"
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  placeholder="Detalla expectativas específicas, estilo de feedback preferido o temas complementarios..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 placeholder-slate-400"
                />
              </div>

              {/* Botón de Enviar Solicitud */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Levantar Solicitud al Comando Central</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Historial de Solicitudes del Colaborador */}
      {myRequests.length > 0 && (
        <div className="pt-4 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Mis Solicitudes de Coaching Registradas ({myRequests.length})
          </h3>
          <div className="space-y-3">
            {myRequests.map((req) => {
              const assignedCoach = coaches.find((c) => c.id === req.assignedCoachId);
              return (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-400">Folio: {req.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        req.status === 'asignado'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : req.status === 'en_proceso'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : req.status === 'rechazado'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {req.status === 'asignado'
                        ? 'Aprobado & Asignado'
                        : req.status === 'en_proceso'
                        ? 'En Proceso'
                        : req.status === 'rechazado'
                        ? 'No Aprobado / Rechazado'
                        : 'Pendiente en Comando Central'}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs">
                    <strong>Motivo:</strong> {req.reason}
                  </p>

                  <div className="text-slate-400 text-[11px] flex flex-wrap gap-4">
                    <span>📅 Disponible desde: {req.startDatePreference}</span>
                    <span>🎯 Temas: {req.goalAreas.join(', ')}</span>
                  </div>

                  {req.status === 'rechazado' && req.rejectionReason && (
                    <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
                      <strong>Motivo de rechazo:</strong> {req.rejectionReason}
                    </div>
                  )}

                  {assignedCoach ? (
                    <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={assignedCoach.avatar}
                          alt={assignedCoach.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            Coach Asignado(a) por Administración:
                          </span>
                          <span className="text-xs font-bold text-white">{assignedCoach.name}</span>
                        </div>
                      </div>
                      {req.dispatchLog && (
                        <div className="text-[10px] text-emerald-200 bg-emerald-950/50 p-2 rounded-lg border border-emerald-500/20">
                          ✅ Notificaciones enviadas a ti y a tu coach vía: <strong>App • Correo • WhatsApp • Microsoft Teams</strong> ({req.dispatchLog.sentAt})
                        </div>
                      )}
                    </div>
                  ) : req.status !== 'rechazado' ? (
                    <div className="text-[11px] text-slate-400 italic">
                      En revisión por el equipo central de People & Coaching para confirmación de agenda.
                    </div>
                  ) : null}

                  {req.adminNotes && (
                    <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded border border-indigo-900/40">
                      <strong>Nota del Administrador:</strong> {req.adminNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

