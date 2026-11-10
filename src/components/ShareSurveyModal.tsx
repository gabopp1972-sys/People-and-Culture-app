import React, { useState } from 'react';
import { Share2, Mail, Phone, MessageSquare, X, Check, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShareSurveyModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, surveyToShare, setSurveyToShare, userProfile } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !surveyToShare) return null;

  const currentUrl = window.location.href;
  const shareText = `Hola, te invito a realizar la evaluación "${surveyToShare.title}" en la app de Wellbeing.\n\nDescripción: ${surveyToShare.description}\n\nPuedes completarla ingresando aquí: ${currentUrl}\n\nEnviado por: ${userProfile.name} (${userProfile.department})`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`[Wellbeing] Te invito a realizar: ${surveyToShare.title}`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-5 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Compartir Encuesta</h3>
          </div>
          <button
            onClick={() => {
              setIsShareModalOpen(false);
              setSurveyToShare(null);
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-teal-400 block mb-0.5">
              Encuesta seleccionada:
            </span>
            <h4 className="font-bold text-white text-sm">{surveyToShare.title}</h4>
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
              {surveyToShare.description}
            </p>
          </div>

          <p className="text-xs text-slate-300">
            Envía esta encuesta a tus compañeros de equipo para recolectar su percepción o para evaluación diagnóstica.
          </p>

          <div className="space-y-2.5 pt-1">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Compartir vía WhatsApp</span>
            </button>

            {/* Email */}
            <button
              type="button"
              onClick={handleShareEmail}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99]"
            >
              <Mail className="w-4 h-4" />
              <span>Compartir por Correo Electrónico</span>
            </button>

            {/* Copiar Portapapeles */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Texto y Enlace Copiados!' : 'Copiar Texto y Enlace'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

