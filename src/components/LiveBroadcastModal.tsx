import React from 'react';
import { Video, ExternalLink, X, Users, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveBroadcastModal: React.FC = () => {
  const {
    liveBroadcast,
    acceptLiveBroadcast,
    hasDismissedCurrentLive,
    setHasDismissedCurrentLive,
    viewMode,
  } = useApp();

  // Solo mostrar a los usuarios en la vista app cuando hay transmisión activa y no la ha cerrado
  if (!liveBroadcast.active || hasDismissedCurrentLive || viewMode === 'admin') {
    return null;
  }

  const handleJoin = () => {
    acceptLiveBroadcast();
  };

  const handleDecline = () => {
    setHasDismissedCurrentLive(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-white ring-4 ring-rose-500/20">
        {/* Header con indicador de EN VIVO */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
              <Radio className="w-3 h-3 text-red-200" />
              <span>Transmisión en Vivo Iniciada</span>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Descartar por ahora"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
              <Video className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-black text-white leading-tight">
              {liveBroadcast.title}
            </h3>

            <p className="text-xs text-rose-300 font-semibold flex items-center justify-center gap-1">
              <span>Emisor:</span>
              <span className="text-white">{liveBroadcast.hostName}</span>
              <span className="text-slate-400">• {liveBroadcast.startedAt}</span>
            </p>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              {liveBroadcast.description || 'El Comando Central está transmitiendo un evento especial en vivo en Google Meet para toda la organización.'}
            </p>
          </div>

          {/* Estadísticas de asistentes */}
          <div className="flex items-center justify-between bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Compañeros conectados:</span>
            </span>
            <span className="font-bold text-emerald-400">
              {liveBroadcast.acceptedUsers.length} en la llamada
            </span>
          </div>

          {/* Botones de Aceptar o Rechazar */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleJoin}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black rounded-2xl shadow-lg shadow-rose-600/30 transition-all active:scale-[0.99] text-xs flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Aceptar e Integrarme a la Transmisión (Meet)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </button>

            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              No unirme por ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

