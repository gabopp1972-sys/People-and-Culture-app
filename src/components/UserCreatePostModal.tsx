import React, { useState, useRef } from 'react';
import {
  Video,
  Image,
  FileText,
  Music,
  Sparkles,
  X,
  PlusCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  Film,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostType } from '../types';

const presetMediaExamples: Record<string, { label: string; url: string }[]> = {
  video: [
    { label: 'Reel Estiramiento Cuello (8s)', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-stretching-exercises-in-a-park-41398-large.mp4' },
    { label: 'Reel Respiración Abdominal (7s)', url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-green-plant-40994-large.mp4' },
  ],
  audio: [
    { label: 'Cápsula de Audio (8s) - Lluvia Relajante', url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg' },
    { label: 'Cápsula de Audio (6s) - Campanilla Zen', url: 'https://actions.google.com/sounds/v1/tools/tuning_fork_crystal.ogg' },
  ],
  infographic: [
    { label: 'Infografía Ergonomía Visual', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Infografía Hidratación & Foco', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80' },
  ],
  image: [
    { label: 'Foto Momento de Desconexión', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80' },
  ],
  news: [
    { label: 'Imagen de Comunicado', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
  ],
};

export const UserCreatePostModal: React.FC = () => {
  const { isCreatePostModalOpen, setIsCreatePostModalOpen, userProfile, createPost, hasScreenAccess } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<PostType>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'salud' | 'emociones' | 'nutricion' | 'comunidad'>('salud');
  const [mediaUrl, setMediaUrl] = useState(presetMediaExamples.video[0].url);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [audioSeconds, setAudioSeconds] = useState(8);
  const [tags, setTags] = useState('#PausaActiva #Bienestar');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  if (!isCreatePostModalOpen) return null;

  // Validar usuario activo y permiso de carga
  if (!userProfile.registered || !userProfile.active || !hasScreenAccess('upload_content')) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-slate-900 border border-amber-500/50 p-6 rounded-2xl max-w-sm text-center text-white space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold">Acceso No Autorizado</h3>
          <p className="text-xs text-slate-300">
            Debes tener un usuario activo con autorización para cargar contenido en la aplicación.
          </p>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // Manejador robusto para fotos, videos y audios desde la computadora o móvil
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorNotice(null);
    setAttachedFileName(file.name);

    // Detectar tipo por MIME o por extensión
    const lowerName = file.name.toLowerCase();
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi)$/i.test(lowerName);
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/i.test(lowerName);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(lowerName);

    if (isVideo) {
      setType('video');
      // Para videos locales usar ObjectURL garantiza reproducción instantánea sin pantalla negra ni bloqueo
      const blobUrl = URL.createObjectURL(file);
      setPreviewDataUrl(blobUrl);
      setMediaUrl(blobUrl);
    } else if (isAudio) {
      setType('audio');
      const blobUrl = URL.createObjectURL(file);
      setPreviewDataUrl(blobUrl);
      setMediaUrl(blobUrl);
    } else if (isImage) {
      setType((prev) => (prev === 'infographic' ? 'infographic' : 'image'));
      if (file.size <= 1.5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setPreviewDataUrl(result);
          setMediaUrl(result);
        };
        reader.readAsDataURL(file);
      } else {
        const blobUrl = URL.createObjectURL(file);
        setPreviewDataUrl(blobUrl);
        setMediaUrl(blobUrl);
      }
    } else {
      setErrorNotice('Formato no soportado. Selecciona una foto (JPG/PNG/WEBP), video (MP4/MOV/WEBM) o audio (MP3/WAV).');
    }
  };

  const handleTypeChange = (newType: PostType) => {
    setType(newType);
    if (!previewDataUrl) {
      if (newType === 'audio') {
        setMediaUrl(presetMediaExamples.audio[0].url);
        setAudioSeconds(8);
      } else if (newType === 'video') {
        setMediaUrl(presetMediaExamples.video[0].url);
      } else if (newType === 'infographic') {
        setMediaUrl(presetMediaExamples.infographic[0].url);
      } else {
        setMediaUrl(presetMediaExamples.image[0].url);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!title.trim()) {
      setErrorNotice('Por favor ingresa un título para tu publicación.');
      return;
    }

    const finalMedia = previewDataUrl || mediaUrl.trim();
    if (!finalMedia) {
      setErrorNotice('Por favor adjunta una foto, video o audio desde tu dispositivo, o ingresa un enlace.');
      return;
    }

    if (type === 'audio' && audioSeconds > 8) {
      setErrorNotice('Los audios no deben exceder los 8 segundos de duración como lo indica la política de pausas rápidas.');
      return;
    }

    createPost({
      author: {
        name: userProfile.name,
        role: userProfile.position || 'Colaborador',
        avatar: userProfile.avatar,
        department: userProfile.department,
      },
      type,
      title: title.trim(),
      description: description.trim() || 'Compartido por el colaborador en el feed de bienestar.',
      mediaUrl: finalMedia,
      audioDuration: type === 'audio' ? `${audioSeconds} seg` : undefined,
      category,
      tags: tags.split(' ').map((t) => t.trim()).filter(Boolean),
      isUserUpload: true,
    });

    setTitle('');
    setDescription('');
    setPreviewDataUrl(null);
    setAttachedFileName(null);
    setIsCreatePostModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/50 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Cargar Contenido al Feed</h2>
              <p className="text-[11px] text-teal-100">
                Adjunta fotos, reels, videos, infografías o audios (≤ 8s)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {errorNotice && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Formato de Publicación */}
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
              1. Selecciona el Tipo de Contenido
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { id: 'video', label: 'Reel / Video', icon: Video },
                { id: 'image', label: 'Foto / Imagen', icon: Image },
                { id: 'infographic', label: 'Infográfico', icon: FileText },
                { id: 'audio', label: 'Audio (≤8s)', icon: Music },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = type === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleTypeChange(fmt.id as PostType)}
                    className={`py-2.5 px-1 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/20 text-teal-300 ring-2 ring-teal-400/40 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] leading-tight">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ADJUNTAR ARCHIVO DIRECTO O USAR ENLACE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                2. Adjuntar Archivo Multimedia
              </label>
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    uploadMode === 'file' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Desde Equipo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    uploadMode === 'url' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Enlace URL
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!previewDataUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-teal-500/40 hover:border-teal-400 rounded-2xl p-5 text-center bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      {type === 'video' ? (
                        <Film className="w-6 h-6" />
                      ) : type === 'audio' ? (
                        <Music className="w-6 h-6" />
                      ) : (
                        <Camera className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Clic para seleccionar Foto, Imagen, Video o Audio
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        MP4, MOV, WebM, JPG, PNG, WEBP, MP3 desde tu computadora o galería
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="font-semibold text-teal-400 flex items-center gap-1 truncate">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{attachedFileName || 'Archivo listo'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewDataUrl(null);
                          setAttachedFileName(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-rose-400 hover:underline shrink-0 text-[10px] font-bold"
                      >
                        Cambiar archivo
                      </button>
                    </div>

                    <div className="rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                      {type === 'video' ? (
                        <video
                          key={previewDataUrl}
                          src={previewDataUrl}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full max-h-56 object-contain bg-black"
                        />
                      ) : type === 'audio' ? (
                        <div className="p-4 w-full text-center">
                          <audio key={previewDataUrl} src={previewDataUrl} controls className="w-full" />
                        </div>
                      ) : (
                        <img
                          src={previewDataUrl}
                          alt="Vista previa adjunta"
                          className="w-full max-h-56 object-contain bg-slate-900"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setPreviewDataUrl(null);
                  }}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-[11px]"
                />
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 mr-1 self-center">Muestras:</span>
                  {(presetMediaExamples[type] || []).map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMediaUrl(ex.url);
                        setPreviewDataUrl(null);
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-teal-300 px-2 py-0.5 rounded-lg border border-slate-700"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RESTRICCIÓN DE AUDIOS NO MÁS DE 8 SEGUNDOS */}
          {type === 'audio' && (
            <div className="bg-indigo-950/40 border border-indigo-500/40 p-3 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Política de Bienestar: Cápsulas de audio cortas (≤ 8 segundos)</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300 text-[11px]">Duración:</span>
                <div className="flex items-center gap-1.5">
                  {[3, 5, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setAudioSeconds(sec)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        audioSeconds === sec
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {sec} seg
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Categoría */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
            >
              <option value="salud">Salud Física & Pausas Activas</option>
              <option value="emociones">Mente & Relajación</option>
              <option value="nutricion">Nutrición & Hidratación</option>
              <option value="comunidad">Comunidad & Bienestar</option>
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título de la Publicación *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Mi pausa activa en video o foto del día"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Descripción / Mensaje</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe qué ejercicio, técnica o experiencia estás compartiendo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Etiquetas (Separadas por espacio)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-teal-500/25 transition-all active:scale-[0.99] text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publicar Contenido en el Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
