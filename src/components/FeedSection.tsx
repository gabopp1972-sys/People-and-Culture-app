import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  Send,
  CheckCircle,
  Flame,
  Apple,
  Brain,
  Megaphone,
  PlusCircle,
  Radio,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostType } from '../types';

/**
 * Reproductor de Video/Reel con Autoplay automático al hacer scroll (IntersectionObserver).
 * Usa src directo en <video> para compatibilidad total con BlobURL, DataURL, MP4, MOV y WebM.
 */
const FeedVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          } else {
            el.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.55 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[500px]">
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        onClick={togglePlay}
        className="w-full max-h-[500px] object-cover cursor-pointer bg-black"
      />

      {/* Botón flotante de Mute/Unmute estilo Instagram Reels */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
      </button>

      {/* Indicador sutil si está pausado manualmente */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export const FeedSection: React.FC = () => {
  const {
    posts,
    toggleLikePost,
    addCommentToPost,
    userProfile,
    setIsCreatePostModalOpen,
    liveBroadcast,
    acceptLiveBroadcast,
    deletePost,
    viewMode,
    hasScreenAccess,
  } = useApp();

  const [activeStoryFilter, setActiveStoryFilter] = useState<string>('todos');
  const [activeAudioPostId, setActiveAudioPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [zoomInfographicUrl, setZoomInfographicUrl] = useState<string | null>(null);

  const stories = [
    { id: 'todos', label: 'Todo', icon: Sparkles, color: 'from-amber-400 to-pink-500' },
    { id: 'salud', label: 'Salud & Pausas', icon: Flame, color: 'from-emerald-400 to-teal-500' },
    { id: 'emociones', label: 'Mente Zen', icon: Brain, color: 'from-indigo-400 to-purple-500' },
    { id: 'nutricion', label: 'Nutrición', icon: Apple, color: 'from-lime-400 to-green-600' },
    { id: 'anuncio', label: 'Anuncios', icon: Megaphone, color: 'from-rose-400 to-red-500' },
  ];

  const filteredPosts =
    activeStoryFilter === 'todos'
      ? posts
      : posts.filter((p) => p.category === activeStoryFilter);

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addCommentToPost(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const getPostBadge = (type: PostType, duration?: string) => {
    switch (type) {
      case 'video':
        return { label: 'Video / Reel', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'infographic':
        return { label: 'Infografía', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'audio':
        return { label: duration ? `Audio (${duration})` : 'Audio (≤8s)', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'news':
        return { label: 'Noticia Oficial', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Foto / Post', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-28 space-y-4">
      {/* Banner de Transmisión en Vivo si está activa */}
      {liveBroadcast.active && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 rounded-2xl shadow-xl text-white flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-white shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider block text-red-100">
                🔴 EN VIVO DESDE EL COMANDO CENTRAL
              </span>
              <h4 className="text-xs font-bold truncate text-white">{liveBroadcast.title}</h4>
            </div>
          </div>
          <button
            type="button"
            onClick={acceptLiveBroadcast}
            className="px-3.5 py-1.5 bg-white text-slate-950 font-black text-xs rounded-xl shadow-md shrink-0 flex items-center gap-1 active:scale-95"
          >
            <span>Unirme</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Stories / Categorías superiores tipo Instagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3.5 min-w-max">
          {stories.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStoryFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStoryFilter(st.id)}
                className="flex flex-col items-center gap-1 focus:outline-none group"
              >
                <div
                  className={`p-0.5 rounded-full bg-gradient-to-tr ${st.color} transition-transform transform group-hover:scale-105 ${
                    isSelected ? 'ring-2 ring-white scale-105' : 'opacity-80'
                  }`}
                >
                  <div className="w-13 h-13 rounded-full bg-slate-950 flex items-center justify-center p-2">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white">
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Subida de Contenido para Usuarios Activos con permiso upload_content */}
      {hasScreenAccess('upload_content') && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-teal-400 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-teal-300 block truncate">
                Comparte un reel, foto, infografía o audio (≤8s)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatePostModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shrink-0 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cargar</span>
          </button>
        </div>
      )}

      {/* Feed Scrolleable */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <p>No hay publicaciones en esta categoría por el momento.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const badge = getPostBadge(post.type, post.audioDuration);
            const isPlayingAudio = activeAudioPostId === post.id;
            const isExpanded = !!expandedComments[post.id];
            const visibleComments = isExpanded
              ? post.comments
              : post.comments.slice(-2);

            return (
              <article
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white transition-all hover:border-slate-700"
              >
                {/* Header del Post */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-white">{post.author.name}</h3>
                        <CheckCircle className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {post.author.role} {post.author.department ? `• ${post.author.department}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    {viewMode === 'admin' && (
                      <button
                        type="button"
                        onClick={() => deletePost(post.id, 'Eliminación directa desde vista previa')}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Borrar publicación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Multimedia según el tipo */}
                <div className="relative bg-black w-full overflow-hidden">
                  {post.type === 'video' ? (
                    <FeedVideoPlayer src={post.mediaUrl} />
                  ) : post.type === 'audio' ? (
                    <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border-y border-indigo-900/40">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAudioPostId(isPlayingAudio ? null : post.id)
                          }
                          className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all shrink-0"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-indigo-200 mb-1 font-semibold">
                            <span>{isPlayingAudio ? 'Reproduciendo audio...' : 'Cápsula de pausa rápida'}</span>
                            <span className="font-mono text-teal-300 font-bold">
                              ⏱️ {post.audioDuration || '≤ 8 seg'}
                            </span>
                          </div>
                          {isPlayingAudio && (
                            <audio src={post.mediaUrl} autoPlay onEnded={() => setActiveAudioPostId(null)} className="hidden" />
                          )}
                          {/* Sound wave bars */}
                          <div className="flex items-center gap-1 h-7 px-2 bg-slate-950/70 rounded-lg">
                            {[40, 75, 30, 90, 60, 40, 85, 30, 65, 45, 95, 50, 75, 35, 60].map(
                              (height, idx) => (
                                <div
                                  key={idx}
                                  className={`flex-1 rounded-full transition-all duration-300 ${
                                    isPlayingAudio
                                      ? 'bg-teal-400 animate-pulse'
                                      : 'bg-indigo-400/40'
                                  }`}
                                  style={{
                                    height: isPlayingAudio ? `${height}%` : '25%',
                                    animationDelay: `${idx * 0.08}s`,
                                  }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-indigo-300/80 mt-2.5 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        Micro-pausa auditiva recomendada de máximo 8 segundos.
                      </p>
                    </div>
                  ) : post.type === 'infographic' ? (
                    <div
                      className="relative cursor-pointer group bg-slate-950"
                      onClick={() => setZoomInfographicUrl(post.mediaUrl)}
                    >
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full min-h-[240px] max-h-[460px] object-cover transition-transform group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-black/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Ver infografía ampliada
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-slate-950">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full min-h-[240px] max-h-[460px] object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Acciones del Post: Like, Comentar, Compartir */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like */}
                      <button
                        type="button"
                        onClick={() => toggleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-transform active:scale-125 ${
                          post.isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`}
                        />
                        <span className="text-xs font-bold">{post.likesCount}</span>
                      </button>

                      {/* Comments toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !isExpanded,
                          }))
                        }
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-bold">{post.comments.length}</span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => {
                          const text = `Te comparto esta publicación de Wellbeing: "${post.title}"`;
                          if (navigator.share) {
                            navigator.share({ title: post.title, text, url: window.location.href }).catch(() => {});
                          } else {
                            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
                          }
                        }}
                        className="text-slate-300 hover:text-white transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Título y descripción */}
                  <div>
                    <h4 className="text-sm font-bold text-white">{post.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {post.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {post.tags.map((tg, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-teal-400/90"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500">{post.createdAt}</div>

                  {/* SECCIÓN DE COMENTARIOS ESTILO INSTAGRAM SIEMPRE ACCESIBLE */}
                  <div className="pt-2.5 border-t border-slate-800/80 space-y-2.5">
                    {post.comments.length > 2 && !isExpanded && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedComments((prev) => ({ ...prev, [post.id]: true }))
                        }
                        className="text-[11px] text-slate-400 hover:text-teal-300 font-semibold"
                      >
                        Ver los {post.comments.length} comentarios...
                      </button>
                    )}

                    {visibleComments.length > 0 && (
                      <div className="space-y-1.5">
                        {visibleComments.map((comm) => (
                          <div key={comm.id} className="flex items-start gap-2 text-xs">
                            <img
                              src={comm.avatar}
                              alt={comm.author}
                              className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 bg-slate-800/60 px-2.5 py-1.5 rounded-xl">
                              <span className="font-bold text-white text-[11px] mr-1.5">
                                {comm.author}
                              </span>
                              <span className="text-slate-200 text-xs">{comm.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input directo de comentario */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 flex items-center bg-slate-950 rounded-xl px-3 py-1.5 border border-slate-800 focus-within:border-teal-500/50 transition-colors">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(post.id);
                          }}
                          placeholder="Agrega un comentario..."
                          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleCommentSubmit(post.id)}
                          className="text-teal-400 hover:text-teal-300 ml-1 p-1"
                          title="Enviar comentario"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal para ver infografía en pantalla completa */}
      {zoomInfographicUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setZoomInfographicUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomInfographicUrl}
              alt="Infografía ampliada"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-slate-700"
            />
            <p className="text-center text-xs text-slate-300 mt-2">
              Haz clic en cualquier parte para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
