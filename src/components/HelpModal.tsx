import React, { useState } from 'react';
import { Mail, LifeBuoy, X, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pbpTopics = [
  'Acompañamiento en Plan de Carrera & Promociones',
  'Clima Laboral, Dinámicas de Equipo & Liderazgo',
  'Consultas de Beneficios, Permisos & Políticas de Personas',
  'Balance Vida - Trabajo & Manejo de Cargas Laborales',
  'Espacio de Escucha Confidencial con People Business Partner',
  'Otro asunto general de Recursos Humanos',
];

export const HelpModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, systemConfig, currentUser } = useApp();
  const [selectedTopic, setSelectedTopic] = useState(pbpTopics[0]);
  const [urgency, setUrgency] = useState<'normal' | 'alta'>('normal');
  const [comments, setComments] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('Por las mañanas (9:00 - 13:00)');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isHelpModalOpen) return null;

  const handleSendEmail = () => {
    const subject = `[Solicitud PBP] ${selectedTopic} - ${currentUser.name} (${currentUser.department})`;
    const body = `Hola equipo de People Business Partner,\n\n` +
      `Solicito apoyo y orientación con el siguiente tema:\n` +
      `• Asunto: ${selectedTopic}\n` +
      `• Colaborador: ${currentUser.name}\n` +
      `• Departamento: ${currentUser.department}\n` +
      `• Correo de contacto: ${currentUser.email}\n` +
      `• Nivel de prioridad: ${urgency === 'alta' ? 'Alta (requiere seguimiento esta semana)' : 'Normal'}\n` +
      `• Disponibilidad preferida para sesión: ${preferredSchedule}\n\n` +
      `Detalles o contexto de la inquietud:\n` +
      `${comments.trim() || 'Agradezco agendar una breve sesión de 20 minutos para revisar mi caso.'}\n\n` +
      `Saludos cordiales,\n${currentUser.name}`;

    const mailtoUrl = `mailto:${systemConfig.pbpEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    setSentSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
              <LifeBuoy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Botón de Ayuda People BP
              </h2>
              <p className="text-xs text-teal-100 font-medium">
                Atención personalizada con tu People Business Partner
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsHelpModalOpen(false);
              setSentSuccess(false);
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-teal-400">Solicitud Preparada</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hemos generado el correo electrónico hacia tu <strong className="text-white">People Business Partner</strong> ({systemConfig.pbpEmail}).
            </p>
            <div className="p-4 bg-slate-800 rounded-xl text-left border border-slate-700 text-xs text-slate-300 space-y-1.5">
              <p>• Asunto asignado: <span className="text-white font-medium">{selectedTopic}</span></p>
              <p>• Tiempo promedio de respuesta: <span className="text-teal-300 font-semibold">24 a 48 horas hábiles</span></p>
              <p>• Tu PBP asignado se pondrá en contacto a tu correo o agendará vía Google Calendar / Teams.</p>
            </div>
            <button
              onClick={() => {
                setIsHelpModalOpen(false);
                setSentSuccess(false);
              }}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all"
            >
              Listo, regresar a la App
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3.5 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <p className="text-xs text-teal-200 leading-relaxed">
                Tu People Business Partner es tu aliado estratégico para resolver dudas de desarrollo, clima o bienestar organizacional de manera confidencial y profesional.
              </p>
            </div>

            {/* Tema */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tema de Consulta o Apoyo
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400"
              >
                {pbpTopics.map((topic, idx) => (
                  <option key={idx} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgencia y Horario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Nivel de prioridad</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`flex-1 py-2 text-xs rounded-lg border font-medium transition-all ${
                      urgency === 'normal'
                        ? 'border-teal-400 bg-teal-500/20 text-teal-300'
                        : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Normal (24-48h)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('alta')}
                    className={`flex-1 py-2 text-xs rounded-lg border font-medium transition-all ${
                      urgency === 'alta'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Alta (Mismo día)
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Disponibilidad preferida</label>
                <input
                  type="text"
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  placeholder="Ej. Mañanas / Viernes tarde"
                />
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">
                Describe brevemente en qué podemos apoyarte
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400 resize-none"
                placeholder="Cuéntanos brevemente sobre tu duda, situación o proyecto que deseas platicar..."
              />
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform active:scale-[0.99]"
              >
                <Mail className="w-5 h-5" />
                <span>Enviar Solicitud a People Business Partner (Correo)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Correo destinatario: <span className="text-teal-300">{systemConfig.pbpEmail}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

