import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Image,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  UserCheck,
  Radio,
  Video,
  ExternalLink,
  Flame,
  Phone,
  Mail,
  ShieldAlert,
  Users,
  RefreshCw,
  Heart,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Lock,
  Unlock,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppScreenId, PostType, UserProfile, UserRole } from '../../types';

const allScreensConfig: { id: AppScreenId; label: string }[] = [
  { id: 'feed', label: 'Feed Social' },
  { id: 'surveys', label: 'Encuestas & IA' },
  { id: 'events', label: 'Eventos & XEX' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'upload_content', label: 'Subir Reels/Fotos' },
  { id: 'admin_console', label: 'Comando Central' },
];

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    posts,
    popularPosts,
    createPost,
    deletePost,
    deleteComment,
    events,
    createEvent,
    deleteEvent,
    coaches,
    toggleCoachActive,
    createCoach,
    deleteCoach,
    coachingRequests,
    acceptAndAssignCoaching,
    rejectCoachingRequest,
    surveyResults,
    systemConfig,
    updateSystemConfig,
    resetAllData,
    liveBroadcast,
    startLiveBroadcast,
    stopLiveBroadcast,
    usersDirectory,
    updateUserPermissions,
    adminCreateUser,
    adminDeleteUser,
    switchActiveUser,
    setViewMode,
  } = useApp();

  // New User Access Creation Modal
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+5255');
  const [newUserTeams, setNewUserTeams] = useState('');
  const [newUserDept, setNewUserDept] = useState('Operaciones');
  const [newUserRole, setNewUserRole] = useState<UserRole>('colaborador');
  const [newUserScreens, setNewUserScreens] = useState<AppScreenId[]>([
    'feed',
    'surveys',
    'events',
    'coaching',
    'upload_content',
  ]);

  // Edit Existing User Profile Modal
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserTeams, setEditUserTeams] = useState('');
  const [editUserDept, setEditUserDept] = useState('');
  const [editUserPosition, setEditUserPosition] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const [editUserGoal, setEditUserGoal] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('colaborador');
  const [editUserScreens, setEditUserScreens] = useState<AppScreenId[]>([]);

  // Transmisión en Vivo Meet State
  const [liveTitle, setLiveTitle] = useState('Sesión Extraordinaria de Bienestar & Anuncios Directivos');
  const [liveMeetUrl, setLiveMeetUrl] = useState('https://meet.google.com/wel-live-stream');
  const [liveHost, setLiveHost] = useState('Comando Central & Dirección de People');
  const [liveDesc, setLiveDesc] = useState('Conéctate para conocer los nuevos programas de coaching y beneficios de fin de año.');

  // Coaching Request Management Modal
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [reqAssignedCoachId, setReqAssignedCoachId] = useState('');
  const [reqAdminNotes, setReqAdminNotes] = useState('');
  const [reqRejectionReason, setReqRejectionReason] = useState('');
  const [reqActionMode, setReqActionMode] = useState<'accept' | 'reject'>('accept');

  // Coach Creation Modal
  const [isNewCoachModalOpen, setIsNewCoachModalOpen] = useState(false);
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachTitle, setNewCoachTitle] = useState('');
  const [newCoachBio, setNewCoachBio] = useState('');
  const [newCoachSpecialties, setNewCoachSpecialties] = useState('Liderazgo, Comunicación, Solución de Conflictos');
  const [newCoachCredentials, setNewCoachCredentials] = useState('PCC ICF, Maestría en Desarrollo Humano');
  const [newCoachAvatar, setNewCoachAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [newCoachDays, setNewCoachDays] = useState('Lunes a Jueves (9:00 - 17:00)');
  const [newCoachEmail, setNewCoachEmail] = useState('');
  const [newCoachPhone, setNewCoachPhone] = useState('5255');
  const [newCoachTeams, setNewCoachTeams] = useState('');

  // Feed Post Creation Modal
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postType, setPostType] = useState<PostType>('video');
  const [postCategory, setPostCategory] = useState<'salud' | 'emociones' | 'nutricion' | 'comunidad' | 'anuncio'>('salud');
  const [postDescription, setPostDescription] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-stretching-exercises-in-a-park-41398-large.mp4');
  const [postAudioDuration] = useState('8 seg');
  const [postTags, setPostTags] = useState('#Wellbeing #PausaActiva');

  // Event Creation Modal
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'Programa XEX' | 'All Hands' | 'Mindfulness' | 'Salud & Deporte' | 'Conferencia'>('Programa XEX');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFullDetails, setEventFullDetails] = useState('');
  const [eventDate, setEventDate] = useState('15 Diciembre 2026');
  const [eventTime, setEventTime] = useState('11:00 AM - 13:00 PM');
  const [eventLocation, setEventLocation] = useState('Sala Magna / Enlace Virtual');
  const [eventCapacity, setEventCapacity] = useState(150);

  // Settings state
  const [emergencyPhone, setEmergencyPhone] = useState(systemConfig.emergencyWhatsAppNumber);
  const [emergencyName, setEmergencyName] = useState(systemConfig.emergencyCoordinatorName);
  const [pbpMail, setPbpMail] = useState(systemConfig.pbpEmail);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Manejo de Transmisión Meet
  const handleToggleLive = () => {
    if (liveBroadcast.active) {
      stopLiveBroadcast();
    } else {
      if (!liveTitle.trim() || !liveMeetUrl.trim()) return;
      startLiveBroadcast(liveTitle.trim(), liveMeetUrl.trim(), liveHost.trim(), liveDesc.trim());
    }
  };

  const openEditRequest = (reqId: string) => {
    const req = coachingRequests.find((r) => r.id === reqId);
    if (!req) return;
    setEditingRequest(reqId);
    setReqAssignedCoachId(req.assignedCoachId || (req.selectedCoachIds[0] || coaches.find((c) => c.active)?.id || ''));
    setReqAdminNotes(req.adminNotes || '');
    setReqRejectionReason(req.rejectionReason || '');
    setReqActionMode(req.status === 'rechazado' ? 'reject' : 'accept');
  };

  const handleConfirmCoachingAction = () => {
    if (!editingRequest) return;
    if (reqActionMode === 'accept') {
      if (!reqAssignedCoachId) {
        alert('Selecciona un Coach para asignar el proceso.');
        return;
      }
      acceptAndAssignCoaching(editingRequest, reqAssignedCoachId, reqAdminNotes.trim());
    } else {
      if (!reqRejectionReason.trim()) {
        alert('Indica brevemente el motivo del rechazo para notificar al solicitante.');
        return;
      }
      rejectCoachingRequest(editingRequest, reqRejectionReason.trim());
    }
    setEditingRequest(null);
  };

  const handleCreateCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoachName.trim()) return;

    createCoach({
      name: newCoachName.trim(),
      title: newCoachTitle.trim(),
      bio: newCoachBio.trim(),
      specialties: newCoachSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      credentials: newCoachCredentials.split(',').map((c) => c.trim()).filter(Boolean),
      avatar: newCoachAvatar.trim(),
      availableDays: newCoachDays.trim(),
      email: newCoachEmail.trim() || 'coach@wellbeing-coaching.com',
      phone: newCoachPhone.trim() || '525500000000',
      msTeamsUser: newCoachTeams.trim() || newCoachEmail.trim() || 'coach@wellbeing-coaching.com',
      active: true,
    });

    setIsNewCoachModalOpen(false);
    setNewCoachName('');
    setNewCoachBio('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    createPost({
      author: {
        name: 'Comando Central Wellbeing',
        role: 'Administración Oficial',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        department: 'Dirección de Personas',
      },
      type: postType,
      title: postTitle.trim(),
      description: postDescription.trim(),
      mediaUrl: postMediaUrl.trim(),
      audioDuration: postType === 'audio' ? postAudioDuration : undefined,
      category: postCategory,
      tags: postTags.split(' ').map((t) => t.trim()).filter(Boolean),
    });

    setIsNewPostModalOpen(false);
    setPostTitle('');
    setPostDescription('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    createEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      description: eventDescription.trim(),
      fullDetails: eventFullDetails.trim() || eventDescription.trim(),
      speaker: 'Comité Directivo Wellbeing',
      speakerRole: 'Speaker Principal',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      isVirtual: eventLocation.toLowerCase().includes('virtual') || eventLocation.toLowerCase().includes('enlace'),
      capacity: Number(eventCapacity) || 100,
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    });

    setIsNewEventModalOpen(false);
    setEventTitle('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      emergencyWhatsAppNumber: emergencyPhone.trim(),
      emergencyCoordinatorName: emergencyName.trim(),
      pbpEmail: pbpMail.trim(),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleCreateAuthorizedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    adminCreateUser({
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      phone: newUserPhone.trim(),
      msTeamsUser: newUserTeams.trim() || newUserEmail.trim().toLowerCase(),
      department: newUserDept.trim() || 'General',
      position: newUserRole === 'lider' ? 'Líder de Área' : 'Colaborador',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newUserName.trim()
      )}&background=0D9488&color=ffffff&bold=true`,
      wellnessGoal: 'Bienestar integral',
      active: true,
      role: newUserRole,
      allowedScreens: newUserScreens,
    });

    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTeams('');
  };

  const openEditUserProfile = (usr: UserProfile) => {
    setEditingUserId(usr.id);
    setEditUserName(usr.name);
    setEditUserEmail(usr.email);
    setEditUserPhone(usr.phone);
    setEditUserTeams(usr.msTeamsUser);
    setEditUserDept(usr.department);
    setEditUserPosition(usr.position);
    setEditUserAvatar(usr.avatar);
    setEditUserGoal(usr.wellnessGoal);
    setEditUserRole(usr.role);
    setEditUserScreens(usr.allowedScreens);
  };

  const handleSaveEditedUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId || !editUserName.trim() || !editUserEmail.trim()) return;

    updateUserPermissions(editingUserId, {
      name: editUserName.trim(),
      email: editUserEmail.trim().toLowerCase(),
      phone: editUserPhone.trim(),
      msTeamsUser: editUserTeams.trim() || editUserEmail.trim().toLowerCase(),
      department: editUserDept.trim() || 'General',
      position: editUserPosition.trim() || 'Colaborador',
      avatar: editUserAvatar.trim(),
      wellnessGoal: editUserGoal.trim(),
      role: editUserRole,
      allowedScreens: editUserScreens,
    });

    setEditingUserId(null);
  };

  const handleToggleUserScreen = (userId: string, screenId: AppScreenId, currentScreens: AppScreenId[]) => {
    const exists = currentScreens.includes(screenId);
    const updated = exists
      ? currentScreens.filter((s) => s !== screenId)
      : [...currentScreens, screenId];
    updateUserPermissions(userId, { allowedScreens: updated });
  };

  const totalLikes = posts.reduce((acc, p) => acc + p.likesCount, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-6 text-white animate-fade-in px-1">
      {/* Header Comando Central */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" /> Consola de Administración Central
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Comando Central Wellbeing</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Control multicanal de coaching, moderación de posts/comentarios, accesos por usuario y transmisión Meet en vivo.
          </p>
        </div>

        <button
          type="button"
          onClick={resetAllData}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-700 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Datos Demo</span>
        </button>
      </div>

      {/* Tabs de Administración */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800 text-xs">
        {[
          { id: 'coaching', label: 'Coaching & Despacho', icon: GraduationCap, count: coachingRequests.length },
          { id: 'feed', label: 'Moderación Feed & Top', icon: Image, count: posts.length },
          { id: 'users', label: 'Usuarios & Accesos', icon: ShieldCheck, count: usersDirectory.length },
          { id: 'live', label: 'Meet (En Vivo)', icon: Radio, highlight: liveBroadcast.active },
          { id: 'events', label: 'Eventos & Reviews', icon: Calendar, count: events.length },
          { id: 'surveys', label: 'Métricas Encuestas', icon: ClipboardList, count: surveyResults.length },
          { id: 'settings', label: 'Config SOS & PBP', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.highlight ? 'text-red-400 animate-pulse' : ''}`} />
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* PESTAÑA: USUARIOS & CONTROL DE ACCESOS (RBAC) */}
      {adminTab === 'users' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                Control Estricto de Accesos por Gmail ({usersDirectory.length})
              </h3>
              <p className="text-xs text-slate-400">
                Solo las cuentas Gmail registradas y activas en esta lista pueden ingresar a Wellbeing y ver únicamente sus pantallas asignadas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewUserModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Gmail</span>
            </button>
          </div>

          <div className="space-y-4">
            {usersDirectory.map((usr) => (
              <div
                key={usr.id}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all ${
                  usr.active ? 'border-slate-800' : 'border-rose-500/30 bg-slate-950 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-teal-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{usr.name}</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {usr.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{usr.department} • <strong className="text-teal-300 font-mono">{usr.email}</strong></span>
                      </div>
                      <p className="text-[10px] text-teal-400 font-mono mt-0.5">
                        WhatsApp: {usr.phone} | MS Teams: {usr.msTeamsUser}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => openEditUserProfile(usr)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      title="Editar todos los datos del perfil y accesos del usuario"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar Perfil</span>
                    </button>

                    <select
                      value={usr.role}
                      onChange={(e) =>
                        updateUserPermissions(usr.id, { role: e.target.value as UserRole })
                      }
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="colaborador">Colaborador</option>
                      <option value="lider">Líder</option>
                      <option value="coach">Coach</option>
                      <option value="admin">Administrador</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => updateUserPermissions(usr.id, { active: !usr.active })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                        usr.active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {usr.active ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Suspendido</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchActiveUser(usr.id);
                        setViewMode('user');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700"
                      title="Probar la app navegando con esta cuenta"
                    >
                      Simular Vista
                    </button>

                    {usr.id !== 'usr-1' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar acceso de ${usr.name} (${usr.email})?`)) {
                            adminDeleteUser(usr.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Eliminar perfil de acceso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Matriz de Pantallas Autorizadas */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Pantallas y Módulos Autorizados:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {allScreensConfig.map((scr) => {
                      const isAllowed = usr.allowedScreens.includes(scr.id);
                      return (
                        <button
                          key={scr.id}
                          type="button"
                          onClick={() => handleToggleUserScreen(usr.id, scr.id, usr.allowedScreens)}
                          className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-between gap-1.5 transition-all ${
                            isAllowed
                              ? 'border-teal-500/50 bg-teal-500/15 text-teal-200'
                              : 'border-slate-800 bg-slate-950 text-slate-500'
                          }`}
                        >
                          <span className="truncate">{scr.label}</span>
                          {isAllowed ? (
                            <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: TRANSMISIÓN EN VIVO EN GOOGLE MEET */}
      {adminTab === 'live' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${liveBroadcast.active ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Transmisión en Vivo en Google Meet
                    {liveBroadcast.active && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-600 text-white animate-bounce">
                        EN EL AIRE
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Todos los colaboradores conectados recibirán una alerta instantánea para aceptar o no unirse al Meet.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleLive}
                className={`px-5 py-3 rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                  liveBroadcast.active
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white shadow-red-600/30 active:scale-95'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>
                  {liveBroadcast.active ? 'Finalizar Transmisión en Vivo' : 'Lanzar Transmisión a Usuarios'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título de la Sesión en Vivo *</label>
                <input
                  type="text"
                  disabled={liveBroadcast.active}
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enlace de Google Meet *</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Video className="w-4 h-4 text-teal-400 shrink-0" />
                  <input
                    type="url"
                    disabled={liveBroadcast.active}
                    value={liveMeetUrl}
                    onChange={(e) => setLiveMeetUrl(e.target.value)}
                    className="bg-transparent text-white focus:outline-none w-full font-mono text-[11px] disabled:opacity-50"
                  />
                  <a href={liveMeetUrl} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Anfitrión / Emisor</label>
                <input
                  type="text"
                  disabled={liveBroadcast.active}
                  value={liveHost}
                  onChange={(e) => setLiveHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción / Mensaje</label>
                <input
                  type="text"
                  disabled={liveBroadcast.active}
                  value={liveDesc}
                  onChange={(e) => setLiveDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Colaboradores conectados en la llamada ({liveBroadcast.acceptedUsers.length})
                </span>
                <span className="text-[10px] text-slate-400">
                  {liveBroadcast.active ? '🔴 Transmisión Activa' : '⚪ En Espera'}
                </span>
              </div>
              {liveBroadcast.acceptedUsers.length === 0 ? (
                <p className="text-slate-400 text-xs italic">
                  {liveBroadcast.active
                    ? 'Esperando a que los usuarios acepten la alerta...'
                    : 'Inicia la transmisión para alertar a los colaboradores.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {liveBroadcast.acceptedUsers.map((user, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {user}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: COACHING & DESPACHO MULTICANAL */}
      {adminTab === 'coaching' && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                Solicitudes de Coaching ({coachingRequests.length})
              </h3>
              <p className="text-xs text-slate-400">
                Acepta/Asigna o Rechaza solicitudes. Al aceptar, se dispara notificación a App, Correo, WhatsApp y MS Teams del Coach y Coachee.
              </p>
            </div>

            <div className="space-y-4">
              {coachingRequests.map((req) => {
                const assignedCoach = coaches.find((c) => c.id === req.assignedCoachId);
                const selectedCoaches = req.selectedCoachIds
                  .map((id) => coaches.find((c) => c.id === id)?.name)
                  .filter(Boolean);

                // Mensajes preformateados para conexión directa a WhatsApp, Correo y MS Teams
                const startMsg = assignedCoach
                  ? `Hola, se ha aprobado el proceso de Coaching Folio ${req.id} entre ${req.coacheeName} (Coachee) y ${assignedCoach.name} (Coach). Disponible desde ${req.startDatePreference}. Temas: ${req.goalAreas.join(', ')}. ¡Pueden coordinar su primera sesión!`
                  : '';

                return (
                  <div
                    key={req.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-purple-500/40 transition-all shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-purple-400">{req.id}</span>
                          <span className="text-xs font-bold text-white">{req.coacheeName}</span>
                          <span className="text-[11px] text-slate-400">({req.coacheeDepartment})</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Mail: {req.coacheeEmail} • Tel: {req.coacheePhone || 'N/A'} • Teams: {req.coacheeTeams || req.coacheeEmail}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                            req.status === 'asignado'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : req.status === 'rechazado'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {req.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => openEditRequest(req.id)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-md active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Asignar / Rechazar</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold block">Motivo:</span>
                        <p className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          {req.reason}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold block">Temas ({req.goalAreas.length}/3):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {req.goalAreas.map((g, idx) => (
                            <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              {g}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          📅 Disponible desde: <strong className="text-white">{req.startDatePreference}</strong> • Opciones: {selectedCoaches.join(', ')}
                        </div>
                      </div>
                    </div>

                    {req.status === 'rechazado' && req.rejectionReason && (
                      <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200">
                        <strong>Motivo de Rechazo Notificado:</strong> {req.rejectionReason}
                      </div>
                    )}

                    {/* CONSOLA MULTICANAL SI FUE ACEPTADA Y ASIGNADA */}
                    {req.status === 'asignado' && assignedCoach && (
                      <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                              Proceso Aprobado • Coach Asignado: {assignedCoach.name}
                            </span>
                            <p className="text-[11px] text-slate-300">
                              Despacho multicanal conectado hacia Coach y Coachee (App + Mail + WhatsApp + MS Teams):
                            </p>
                          </div>
                          {req.dispatchLog && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">
                              ✓ Enviado {req.dispatchLog.sentAt}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* WhatsApp Coachee */}
                          <a
                            href={`https://wa.me/${(req.coacheePhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(startMsg)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp Coachee</span>
                          </a>

                          {/* WhatsApp Coach */}
                          <a
                            href={`https://wa.me/${assignedCoach.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(startMsg)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp Coach</span>
                          </a>

                          {/* Correo Electrónico a ambos */}
                          <a
                            href={`mailto:${req.coacheeEmail},${assignedCoach.email}?subject=${encodeURIComponent(`Inicio de Proceso de Coaching ${req.id} - Wellbeing`)}&body=${encodeURIComponent(startMsg)}`}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Correo (Ambos)</span>
                          </a>

                          {/* Microsoft Teams Chat Grupal / Directo con Coach y Coachee */}
                          <a
                            href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(req.coacheeTeams || req.coacheeEmail)},${encodeURIComponent(assignedCoach.msTeamsUser)}&message=${encodeURIComponent(startMsg)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>MS Teams (Coach & Coachee)</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROSTER DE COACHES */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-400" />
                  Roster de Coaches ({coaches.length})
                </h3>
                <p className="text-xs text-slate-400">Alta, baja y contactos de contacto directo</p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewCoachModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Alta Nuevo Coach</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className={`bg-slate-900 border rounded-2xl p-4 text-xs transition-all ${
                    coach.active ? 'border-slate-800' : 'border-slate-800/50 opacity-60 bg-slate-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img src={coach.avatar} alt={coach.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{coach.name}</h4>
                        <p className="text-purple-300 font-medium">{coach.title}</p>
                        <span className="text-[10px] text-slate-400 block">
                          Mail: {coach.email} • Teams: {coach.msTeamsUser}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleCoachActive(coach.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          coach.active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {coach.active ? 'Activo' : 'Inactivo'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCoach(coach.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Eliminar coach"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: MODERACIÓN FEED (ELIMINAR POSTS Y COMENTARIOS CON AVISO AL AUTOR) */}
      {adminTab === 'feed' && (
        <div className="space-y-6 animate-fade-in">
          {/* ESTADÍSTICAS TOP POPULARES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Publicaciones Más Populares</h3>
              </div>
              <span className="text-xs text-slate-400">Interacción Total: ❤️ {totalLikes} | 💬 {totalComments}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {popularPosts.slice(0, 3).map((post, rank) => (
                <div key={post.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                  <span className="text-3xl font-black text-slate-800 absolute top-2 right-3">#{rank + 1}</span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Puesto #{rank + 1}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{post.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{post.author.name}</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">❤️ {post.likesCount}</span>
                    <span className="text-teal-400 font-bold">💬 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LISTA CON CONTROL DE BORRADO DE POSTS Y COMENTARIOS INDIVIDUALES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Moderación de Publicaciones y Comentarios ({posts.length})</h3>
                <p className="text-xs text-slate-400">
                  Al eliminar un post o comentario se envía automáticamente un aviso de moderación al usuario autor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar como Admin</span>
              </button>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1 min-w-0">
                      {post.type === 'video' ? (
                        <video src={post.mediaUrl} muted className="w-16 h-16 rounded-xl object-cover bg-black shrink-0" />
                      ) : (
                        <img src={post.mediaUrl} alt={post.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold uppercase text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                            {post.type} • {post.category}
                          </span>
                          <span className="text-[11px] font-bold text-white">{post.author.name}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{post.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{post.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt(
                          `¿Deseas eliminar la publicación "${post.title}"?\nEscribe el motivo (se notificará al usuario ${post.author.name}):`,
                          'Contenido no alineado a las políticas de bienestar.'
                        );
                        if (reason !== null) {
                          deletePost(post.id, reason);
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-[11px] font-bold flex items-center gap-1 border border-rose-500/30 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar Post</span>
                    </button>
                  </div>

                  {/* Moderación de Comentarios del Post */}
                  {post.comments.length > 0 && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Comentarios en este post ({post.comments.length}):
                      </span>
                      <div className="space-y-1.5">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-lg text-xs">
                            <div className="min-w-0">
                              <strong className="text-teal-300 mr-1.5">{comm.author}:</strong>
                              <span className="text-slate-300">{comm.text}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = window.prompt(
                                  `Eliminar comentario de ${comm.author}.\nMotivo del aviso al usuario:`,
                                  'Comentario moderado por administración.'
                                );
                                if (reason !== null) {
                                  deleteComment(post.id, comm.id, reason);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 p-1 shrink-0"
                              title="Eliminar comentario y avisar al usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: EVENTOS & REVIEWS */}
      {adminTab === 'events' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Gestión de Eventos ({events.length})</h3>
              <p className="text-xs text-slate-400">Programa XEX, All Hands y asistencia</p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewEventModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Evento</span>
            </button>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {evt.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-300">{evt.description}</p>
                  </div>
                  <button type="button" onClick={() => deleteEvent(evt.id)} className="text-slate-500 hover:text-rose-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  Inscritos ({evt.enrolledUsers.length}/{evt.capacity}): <strong className="text-white">{evt.enrolledUsers.join(', ') || 'Sin inscritos'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: MÉTRICAS DE ENCUESTAS */}
      {adminTab === 'surveys' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white">Métricas de Encuestas ({surveyResults.length})</h3>
          {surveyResults.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              Aún no hay encuestas respondidas en esta sesión.
            </div>
          ) : (
            surveyResults.map((res) => (
              <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <strong className="text-white">{res.surveyTitle} - {res.userName}</strong>
                  <span className="text-teal-400 font-bold">{res.totalScore}/{res.maxPossibleScore} ({res.levelInterpretation})</span>
                </div>
                {res.aiReport && <p className="text-slate-300">{res.aiReport.overallDiagnosis}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* PESTAÑA: CONFIGURACIÓN SOS & PBP */}
      {adminTab === 'settings' && (
        <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" /> Canales de Enlace Central
          </h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 space-y-3">
              <div className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> WhatsApp Botón de Emergencia
              </div>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30 space-y-3">
              <div className="text-teal-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Correo People Business Partner
              </div>
              <input
                type="email"
                value={pbpMail}
                onChange={(e) => setPbpMail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Configuración
            </button>
            {settingsSaved && <p className="text-center text-emerald-400 font-bold">✓ Guardado.</p>}
          </form>
        </div>
      )}

      {/* MODAL: ACEPTAR/ASIGNAR O RECHAZAR SOLICITUD DE COACHING */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                Resolución de Coaching ({editingRequest})
              </h3>
              <button type="button" onClick={() => setEditingRequest(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Switcher Aceptar o Rechazar */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setReqActionMode('accept')}
                className={`py-2 rounded-lg transition-all ${
                  reqActionMode === 'accept' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                ✓ Aceptar y Asignar
              </button>
              <button
                type="button"
                onClick={() => setReqActionMode('reject')}
                className={`py-2 rounded-lg transition-all ${
                  reqActionMode === 'reject' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                ✕ Rechazar Solicitud
              </button>
            </div>

            {reqActionMode === 'accept' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1.5">Coach Asignado(a):</label>
                  <select
                    value={reqAssignedCoachId}
                    onChange={(e) => setReqAssignedCoachId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  >
                    {coaches.filter((c) => c.active).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1.5">Notas / Acuerdos:</label>
                  <textarea
                    rows={2}
                    value={reqAdminNotes}
                    onChange={(e) => setReqAdminNotes(e.target.value)}
                    placeholder="Instrucciones iniciales para el arranque..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                  />
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-200">
                  Al confirmar, se habilitará el envío automático de inicio tanto al <strong>Coach</strong> como al <strong>Coachee</strong> en sus 4 canales: <strong>App, Correo, WhatsApp y Microsoft Teams</strong>.
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <label className="block text-rose-300 font-semibold uppercase">Motivo del rechazo:</label>
                <textarea
                  rows={3}
                  value={reqRejectionReason}
                  onChange={(e) => setReqRejectionReason(e.target.value)}
                  placeholder="Explica al colaborador por qué no fue aprobada o qué ajustes se requieren..."
                  className="w-full bg-slate-800 border border-rose-500/40 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => setEditingRequest(null)} className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold text-xs">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCoachingAction}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 ${
                  reqActionMode === 'accept' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{reqActionMode === 'accept' ? 'Aprobar y Notificar' : 'Confirmar Rechazo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALTA NUEVO COACH (CON TEL, MAIL Y MS TEAMS) */}
      {isNewCoachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-teal-500/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Dar de Alta Nuevo Coach</h3>
              <button type="button" onClick={() => setIsNewCoachModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateCoach} className="space-y-3 text-xs">
              <input type="text" required value={newCoachName} onChange={(e) => setNewCoachName(e.target.value)} placeholder="Nombre completo con título *" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              <input type="text" required value={newCoachTitle} onChange={(e) => setNewCoachTitle(e.target.value)} placeholder="Especialidad principal *" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="email" required value={newCoachEmail} onChange={(e) => setNewCoachEmail(e.target.value)} placeholder="Correo *" className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white" />
                <input type="text" required value={newCoachPhone} onChange={(e) => setNewCoachPhone(e.target.value)} placeholder="WhatsApp *" className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono" />
                <input type="text" required value={newCoachTeams} onChange={(e) => setNewCoachTeams(e.target.value)} placeholder="Usuario MS Teams *" className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white" />
              </div>
              <textarea rows={2} required value={newCoachBio} onChange={(e) => setNewCoachBio(e.target.value)} placeholder="Biografía profesional *" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white resize-none" />
              <input type="text" value={newCoachSpecialties} onChange={(e) => setNewCoachSpecialties(e.target.value)} placeholder="Especialidades" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              <input type="text" value={newCoachCredentials} onChange={(e) => setNewCoachCredentials(e.target.value)} placeholder="Certificaciones" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              <input type="text" value={newCoachDays} onChange={(e) => setNewCoachDays(e.target.value)} placeholder="Días disponibles" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
              <input type="url" value={newCoachAvatar} onChange={(e) => setNewCoachAvatar(e.target.value)} placeholder="URL Avatar" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono" />

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsNewCoachModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-500 text-slate-950 rounded-xl font-bold">Registrar Coach</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUBLICAR FEED ADMIN */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-teal-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 text-white">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold">Nueva Publicación Oficial</h3>
              <button onClick={() => setIsNewPostModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <select value={postType} onChange={(e) => setPostType(e.target.value as PostType)} className="w-full bg-slate-800 rounded-lg px-3 py-2">
                <option value="video">Video / Reel</option>
                <option value="infographic">Infografía</option>
                <option value="audio">Audio (≤8s)</option>
                <option value="news">Noticia</option>
                <option value="image">Imagen</option>
              </select>
              <select value={postCategory} onChange={(e) => setPostCategory(e.target.value as any)} className="w-full bg-slate-800 rounded-lg px-3 py-2">
                <option value="salud">Salud</option>
                <option value="emociones">Emociones</option>
                <option value="nutricion">Nutrición</option>
                <option value="anuncio">Anuncio</option>
              </select>
              <input type="text" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Título *" className="w-full bg-slate-800 rounded-lg px-3 py-2" />
              <textarea rows={2} required value={postDescription} onChange={(e) => setPostDescription(e.target.value)} placeholder="Descripción *" className="w-full bg-slate-800 rounded-lg px-3 py-2" />
              <input type="url" required value={postMediaUrl} onChange={(e) => setPostMediaUrl(e.target.value)} placeholder="URL Media *" className="w-full bg-slate-800 rounded-lg px-3 py-2" />
              <button type="submit" className="w-full py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl">Publicar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREAR EVENTO */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 text-white">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold">Crear Evento</h3>
              <button onClick={() => setIsNewEventModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value as any)} className="w-full bg-slate-800 rounded-lg px-3 py-2">
                <option value="Programa XEX">Programa XEX</option>
                <option value="All Hands">All Hands</option>
                <option value="Mindfulness">Mindfulness</option>
              </select>
              <input type="text" required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Título *" className="w-full bg-slate-800 rounded-lg px-3 py-2" />
              <input type="text" required value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Descripción breve *" className="w-full bg-slate-800 rounded-lg px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-slate-800 rounded-lg px-3 py-2" />
                <input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-slate-800 rounded-lg px-3 py-2" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Crear Evento</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVO USUARIO CON GMAIL AUTORIZADO */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-teal-500/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                Registrar Usuario Autorizado (Gmail)
              </h3>
              <button type="button" onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAuthorizedUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ej. Laura Méndez"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Correo Gmail Autorizado *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="usuario@gmail.com"
                    className="w-full bg-slate-800 border border-teal-500/40 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+5255..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Usuario MS Teams</label>
                  <input
                    type="text"
                    value={newUserTeams}
                    onChange={(e) => setNewUserTeams(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Departamento / Área</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Rol</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="colaborador">Colaborador</option>
                    <option value="lider">Líder</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase text-[10px] mb-1.5">
                  Pantallas a las que tiene autorización navegar:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allScreensConfig.map((scr) => {
                    const checked = newUserScreens.includes(scr.id);
                    return (
                      <button
                        key={scr.id}
                        type="button"
                        onClick={() =>
                          setNewUserScreens((prev) =>
                            checked ? prev.filter((s) => s !== scr.id) : [...prev, scr.id]
                          )
                        }
                        className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-between ${
                          checked
                            ? 'border-teal-400 bg-teal-500/20 text-teal-200'
                            : 'border-slate-800 bg-slate-950 text-slate-500'
                        }`}
                      >
                        <span>{scr.label}</span>
                        {checked ? <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsNewUserModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-500 text-slate-950 rounded-xl font-bold shadow-md">
                  Autorizar Acceso Gmail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PERFIL DE USUARIO EXISTENTE DESDE ACCESOS */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" />
                Editar Perfil y Accesos de Usuario
              </h3>
              <button type="button" onClick={() => setEditingUserId(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedUserProfile} className="space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-1">
                <img
                  src={editUserAvatar || 'https://ui-avatars.com/api/?name=U'}
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border border-indigo-400 shrink-0"
                />
                <div className="flex-1">
                  <label className="block text-slate-300 mb-1">URL de Fotografía / Avatar</label>
                  <input
                    type="url"
                    value={editUserAvatar}
                    onChange={(e) => setEditUserAvatar(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Correo Gmail Autorizado *</label>
                  <input
                    type="text"
                    required
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    placeholder="usuario@gmail.com"
                    className="w-full bg-slate-800 border border-teal-500/40 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={editUserPhone}
                    onChange={(e) => setEditUserPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Usuario MS Teams</label>
                  <input
                    type="text"
                    value={editUserTeams}
                    onChange={(e) => setEditUserTeams(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Departamento / Área</label>
                  <input
                    type="text"
                    value={editUserDept}
                    onChange={(e) => setEditUserDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Puesto / Cargo</label>
                  <input
                    type="text"
                    value={editUserPosition}
                    onChange={(e) => setEditUserPosition(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">Objetivo de Bienestar</label>
                  <input
                    type="text"
                    value={editUserGoal}
                    onChange={(e) => setEditUserGoal(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Rol en la App</label>
                  <select
                    value={editUserRole}
                    disabled={editingUserId === 'usr-1'}
                    onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white disabled:opacity-60"
                  >
                    <option value="colaborador">Colaborador</option>
                    <option value="lider">Líder</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase text-[10px] mb-1.5">
                  Pantallas y Módulos Autorizados:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allScreensConfig.map((scr) => {
                    const checked = editUserScreens.includes(scr.id);
                    return (
                      <button
                        key={scr.id}
                        type="button"
                        disabled={editingUserId === 'usr-1'}
                        onClick={() =>
                          setEditUserScreens((prev) =>
                            checked ? prev.filter((s) => s !== scr.id) : [...prev, scr.id]
                          )
                        }
                        className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-between disabled:opacity-60 ${
                          checked
                            ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                            : 'border-slate-800 bg-slate-950 text-slate-500'
                        }`}
                      >
                        <span>{scr.label}</span>
                        {checked ? <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditingUserId(null)} className="flex-1 py-2.5 bg-slate-800 rounded-xl font-bold">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
