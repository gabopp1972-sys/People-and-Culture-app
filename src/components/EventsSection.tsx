import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { EventItem } from '../types';

export const EventsSection: React.FC = () => {
  const { events, toggleEventEnrollment, addEventReview, currentUser } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const categories = ['todos', 'Programa XEX', 'All Hands', 'Mindfulness'];

  const filteredEvents =
    activeCategory === 'todos'
      ? events
      : events.filter((e) => e.category === activeCategory);

  const handleEnroll = (event: EventItem) => {
    const isEnrolled = event.enrolledUsers.includes(currentUser.name);
    toggleEventEnrollment(event.id);

    if (!isEnrolled) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    if (selectedEvent && selectedEvent.id === event.id) {
      setSelectedEvent({
        ...selectedEvent,
        enrolledUsers: isEnrolled
          ? selectedEvent.enrolledUsers.filter((u) => u !== currentUser.name)
          : [...selectedEvent.enrolledUsers, currentUser.name],
      });
    }
  };

  const handleSubmitReview = (eventId: string) => {
    if (!newComment.trim()) return;
    addEventReview(eventId, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);

    // Actualizar vista local del modal
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        reviews: [
          {
            id: `rev-${Date.now()}`,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            rating: newRating,
            comment: newComment.trim(),
            createdAt: 'Justo ahora',
          },
          ...selectedEvent.reviews,
        ],
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6 text-white animate-fade-in">
      {/* Banner de eventos */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Cartelera Corporativa Wellbeing
          </div>
          <h2 className="text-2xl font-black text-white">Eventos, Programa XEX & All Hands</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Descubre los encuentros de liderazgo, aceleración y salud integral. Inscríbete en segundos y evalúa tus sesiones.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/70 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <Calendar className="w-4 h-4 text-teal-400" />
          <span>Agenda Q4 2026</span>
        </div>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'todos' ? 'Todos los Eventos' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((evt) => {
          const isEnrolled = evt.enrolledUsers.includes(currentUser.name);
          const remainingSlots = Math.max(0, evt.capacity - evt.enrolledUsers.length);
          const avgRating =
            evt.reviews.length > 0
              ? (
                  evt.reviews.reduce((acc, r) => acc + r.rating, 0) /
                  evt.reviews.length
                ).toFixed(1)
              : null;

          return (
            <div
              key={evt.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md">
                  {evt.category}
                </span>
                {avgRating && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {avgRating} ({evt.reviews.length})
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evt.isVirtual ? (
                        <Video className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {remainingSlots} cupos disponibles de {evt.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Speaker pill */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2.5">
                  <img
                    src={evt.speakerAvatar}
                    alt={evt.speaker}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div className="text-[11px] truncate">
                    <div className="font-semibold text-white truncate">{evt.speaker}</div>
                    <div className="text-slate-400 text-[10px] truncate">{evt.speakerRole}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(evt)}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1"
                  >
                    <span>Conocer más & Reviews</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnroll(evt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isEnrolled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md active:scale-95'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Inscrito</span>
                      </>
                    ) : (
                      <span>Inscribirme</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle de Evento e Inscripción / Reviews */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white">
            {/* Modal header image */}
            <div className="relative h-48 sm:h-60 bg-slate-950">
              <img
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Datos rápidos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Fecha</span>
                  <span className="font-semibold text-white">{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Horario</span>
                  <span className="font-semibold text-white">{selectedEvent.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Modalidad</span>
                  <span className="font-semibold text-teal-400">
                    {selectedEvent.isVirtual ? 'Virtual en vivo' : 'Presencial'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Inscritos</span>
                  <span className="font-semibold text-amber-400">
                    {selectedEvent.enrolledUsers.length} / {selectedEvent.capacity}
                  </span>
                </div>
              </div>

              {/* Speaker Card */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <img
                  src={selectedEvent.speakerAvatar}
                  alt={selectedEvent.speaker}
                  className="w-12 h-12 rounded-full object-cover border border-teal-500/40"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Facilitador / Speaker
                  </span>
                  <h4 className="text-sm font-bold text-white">{selectedEvent.speaker}</h4>
                  <p className="text-xs text-slate-300">{selectedEvent.speakerRole}</p>
                </div>
              </div>

              {/* Descripción completa */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Acerca del Evento
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  {selectedEvent.fullDetails}
                </p>
              </div>

              {/* Botón de Inscripción destacado */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleEnroll(selectedEvent)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    selectedEvent.enrolledUsers.includes(currentUser.name)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-500/25 active:scale-95'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {selectedEvent.enrolledUsers.includes(currentUser.name)
                      ? 'Estás Inscrito(a) • Clic para cancelar'
                      : 'Confirmar mi Asistencia al Evento'}
                  </span>
                </button>

                {selectedEvent.virtualLink && (
                  <a
                    href={selectedEvent.virtualLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Abrir enlace de reunión"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* SECCIÓN DE REVIEWS Y CALIFICACIONES */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    Reviews y Calificaciones ({selectedEvent.reviews.length})
                  </h4>
                  <span className="text-xs text-slate-400">Comparte tu experiencia</span>
                </div>

                {/* Formulario para dejar review */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Califica este evento:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu opinión o aprendizaje del evento..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitReview(selectedEvent.id)}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar</span>
                    </button>
                  </div>
                  {reviewSubmitted && (
                    <p className="text-xs text-emerald-400 font-medium">
                      ✓ ¡Gracias por tu reseña! Ha sido añadida a la cartelera.
                    </p>
                  )}
                </div>

                {/* Lista de Reviews */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedEvent.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1">{rev.createdAt}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-8">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

