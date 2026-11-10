import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X, Send, AlertTriangle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmergencyType } from '../types';

const emergencyCategories: {
  id: EmergencyType;
  label: string;
  icon: string;
  severity: string;
  description: string;
}[] = [
  {
    id: 'fallecimiento',
    label: 'Aviso de fallecimiento',
    icon: '🕊️',
    severity: 'Prioridad Máxima',
    description: 'Notificación de deceso de un colaborador o familiar directo para activación de protocolos y pólizas funerarias.',
  },
  {
    id: 'accidente_grave',
    label: 'Accidente grave',
    icon: '🚑',
    severity: 'Emergencia Inmediata',
    description: 'Siniestro físico que requiere atención hospitalaria urgente, asistencia médica o coordinación de ambulancia.',
  },
  {
    id: 'robo_extravio_equipo',
    label: 'Robo o extravío de equipo de cómputo o móvil',
    icon: '💻',
    severity: 'Seguridad de Información',
    description: 'Bloqueo preventivo de credenciales, tokens, borrado remoto y reporte de salvaguarda de datos corporativos.',
  },
  {
    id: 'amenaza_seguridad',
    label: 'Amenaza grave a la seguridad personal o de la empresa',
    icon: '🚨',
    severity: 'Alerta Crítica',
    description: 'Situaciones de riesgo inminente, extorsión, violencia, acoso grave o vulneración a instalaciones.',
  },
];

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, systemConfig, currentUser } = useApp();
  const [selectedType, setSelectedType] = useState<EmergencyType>('accidente_grave');
  const [location, setLocation] = useState('Sede Corporativa - CDMX');
  const [phone, setPhone] = useState('+52 55 9876 5432');
  const [details, setDetails] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isEmergencyModalOpen) return null;

  const currentCategory = emergencyCategories.find((c) => c.id === selectedType);

  const handleSendToWhatsApp = () => {
    const rawNumber = systemConfig.emergencyWhatsAppNumber.replace(/[^0-9]/g, '');
    const message = `🚨 *ALERTA DE EMERGENCIA WELLBEING* 🚨
━━━━━━━━━━━━━━━━━━━━━━
📌 *TIPO:* ${currentCategory?.label.toUpperCase()}
👤 *COLABORADOR:* ${currentUser.name}
🏢 *ÁREA:* ${currentUser.department}
📍 *UBICACIÓN:* ${location}
📞 *TELÉFONO DE CONTACTO:* ${phone}
⏰ *HORA:* ${new Date().toLocaleTimeString('es-MX')}

📝 *DESCRIPCIÓN DE LA SITUACIÓN:*
${details.trim() || 'Se solicita comunicación y asistencia inmediata del equipo de guardia.'}
━━━━━━━━━━━━━━━━━━━━━━
_Enviado desde el Botón de Emergencia de la App Wellbeing._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    setSentSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-rose-600 p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Botón de Emergencia
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Conexión inmediata con WhatsApp del Centro de Comando
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsEmergencyModalOpen(false);
              setSentSuccess(false);
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <PhoneCall className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400">¡Alerta Transmitida!</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              El reporte de <strong className="text-white">{currentCategory?.label}</strong> se ha derivado vía WhatsApp al Centro de Comando de RRHH & Seguridad.
            </p>
            <div className="p-4 bg-slate-800 rounded-xl text-left border border-slate-700 text-xs text-slate-300 space-y-1">
              <p>• Coordinador de guardia: <span className="text-white font-medium">{systemConfig.emergencyCoordinatorName}</span></p>
              <p>• Número de enlace: <span className="text-emerald-400 font-mono">+{systemConfig.emergencyWhatsAppNumber}</span></p>
              <p>• Si requieres hablar por voz directa llama al 911 o al conmutador central.</p>
            </div>
            <button
              onClick={() => {
                setIsEmergencyModalOpen(false);
                setSentSuccess(false);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
            >
              Cerrar Ventana
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Warning banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed">
                Utiliza este botón exclusivamente ante situaciones imprevistas de gravedad. Al confirmar, serás canalizado directamente al WhatsApp de respuesta inmediata corporativo.
              </p>
            </div>

            {/* Select emergency topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Selecciona la situación de emergencia
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {emergencyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedType(cat.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedType === cat.id
                        ? 'border-red-500 bg-red-500/15 ring-2 ring-red-500/30'
                        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-white">{cat.label}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                          {cat.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{cat.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Ubicación / Sucursal</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  placeholder="Ej. Oficina Central piso 5 o domicilio"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Teléfono de contacto</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  placeholder="+52 55 ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">
                Detalles adicionales o requerimientos (Opcional)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                placeholder="Indica nombres de afectados, requerimiento de ambulancia, folio de denuncia, etc."
              />
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all transform active:scale-[0.99]"
              >
                <Send className="w-5 h-5" />
                <span>Notificar Inmediatamente a WhatsApp de Emergencia</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Destino: {systemConfig.emergencyCoordinatorName} (+{systemConfig.emergencyWhatsAppNumber})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

