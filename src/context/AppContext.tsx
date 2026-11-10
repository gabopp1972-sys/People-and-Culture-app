import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Coach,
  CoachingRequest,
  EventItem,
  EventReview,
  Post,
  Survey,
  SurveyResult,
  SystemConfig,
  UserProfile,
  AppNotification,
  LiveBroadcast,
  AppScreenId,
  UserRole,
} from '../types';
import {
  initialCoaches,
  initialCoachingRequests,
  initialConfig,
  initialEvents,
  initialPosts,
  initialSurveys,
  initialUsersDirectory,
  initialNotifications,
  initialLiveBroadcast,
} from '../data/initialData';
import { AuthUser } from '../types/auth';
import { isEmailMatch } from '../services/auth/oauthService';

interface AppContextType {
  // Navigation & View
  viewMode: 'user' | 'admin';
  setViewMode: (mode: 'user' | 'admin') => void;
  userTab: 'feed' | 'surveys' | 'events' | 'coaching';
  setUserTab: (tab: 'feed' | 'surveys' | 'events' | 'coaching') => void;
  adminTab: 'coaching' | 'feed' | 'events' | 'surveys' | 'live' | 'users' | 'settings';
  setAdminTab: (tab: 'coaching' | 'feed' | 'events' | 'surveys' | 'live' | 'users' | 'settings') => void;

  // Mobile Frame preview toggle on desktop
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (enabled: boolean) => void;

  // Modals
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  surveyToShare: Survey | null;
  setSurveyToShare: (s: Survey | null) => void;

  // Multiusuario & Control de Accesos (RBAC)
  usersDirectory: UserProfile[];
  userProfile: UserProfile;
  currentUser: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  registerNewUser: (data: Omit<UserProfile, 'id' | 'registered' | 'active' | 'role' | 'allowedScreens'>) => void;
  switchActiveUser: (userId: string) => void;
  updateUserPermissions: (
    userId: string,
    updates: Partial<Pick<UserProfile, 'allowedScreens' | 'active' | 'role' | 'email' | 'name' | 'department' | 'phone' | 'msTeamsUser' | 'position'>>
  ) => void;
  adminCreateUser: (
    data: Omit<UserProfile, 'id' | 'registered'>
  ) => void;
  adminDeleteUser: (userId: string) => void;
  hasScreenAccess: (screen: AppScreenId) => boolean;
  syncAuthenticatedGoogleUser: (authUser: AuthUser) => boolean;
  findAuthorizedProfileByEmail: (email: string) => UserProfile | undefined;

  // Notifications
  notifications: AppNotification[];
  userNotifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Live Meet Broadcast
  liveBroadcast: LiveBroadcast;
  startLiveBroadcast: (title: string, meetUrl: string, hostName?: string, description?: string) => void;
  stopLiveBroadcast: () => void;
  acceptLiveBroadcast: () => void;
  hasDismissedCurrentLive: boolean;
  setHasDismissedCurrentLive: (dismissed: boolean) => void;

  // Posts / Feed & Moderación
  posts: Post[];
  popularPosts: Post[];
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  createPost: (post: Omit<Post, 'id' | 'likesCount' | 'comments' | 'createdAt'>) => void;
  deletePost: (postId: string, moderationReason?: string) => void;
  deleteComment: (postId: string, commentId: string, moderationReason?: string) => void;

  // Surveys
  surveys: Survey[];
  surveyResults: SurveyResult[];
  saveSurveyResult: (result: SurveyResult) => void;

  // Events
  events: EventItem[];
  toggleEventEnrollment: (eventId: string) => void;
  addEventReview: (eventId: string, rating: number, comment: string) => void;
  createEvent: (event: Omit<EventItem, 'id' | 'enrolledUsers' | 'reviews'>) => void;
  updateEvent: (eventId: string, data: Partial<EventItem>) => void;
  deleteEvent: (eventId: string) => void;

  // Coaches
  coaches: Coach[];
  toggleCoachActive: (coachId: string) => void;
  createCoach: (coach: Omit<Coach, 'id' | 'rating' | 'totalSessions'>) => void;
  updateCoach: (coachId: string, data: Partial<Coach>) => void;
  deleteCoach: (coachId: string) => void;

  // Coaching Requests (Aceptar / Asignar o Rechazar con envío multicanal)
  coachingRequests: CoachingRequest[];
  createCoachingRequest: (req: Omit<CoachingRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateCoachingRequest: (reqId: string, data: Partial<CoachingRequest>) => void;
  acceptAndAssignCoaching: (reqId: string, coachId: string, notes?: string) => void;
  rejectCoachingRequest: (reqId: string, rejectionReason: string) => void;

  // Config
  systemConfig: SystemConfig;
  updateSystemConfig: (data: Partial<SystemConfig>) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');
  const [userTab, setUserTab] = useState<'feed' | 'surveys' | 'events' | 'coaching'>('feed');
  const [adminTab, setAdminTab] = useState<'coaching' | 'feed' | 'events' | 'surveys' | 'live' | 'users' | 'settings'>('coaching');

  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState(false);

  // Modales
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [surveyToShare, setSurveyToShare] = useState<Survey | null>(null);

  // Directorio Multiusuario
  const [usersDirectory, setUsersDirectory] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('wb_users_dir');
    return saved ? JSON.parse(saved) : initialUsersDirectory;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('wb_active_user_id') || initialUsersDirectory[0].id;
  });

  const userProfile =
    usersDirectory.find((u) => u.id === activeUserId) || usersDirectory[0];

  // Notificaciones
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('wb_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Transmisión en Vivo Meet
  const [liveBroadcast, setLiveBroadcast] = useState<LiveBroadcast>(() => {
    const saved = localStorage.getItem('wb_live_broadcast');
    return saved ? JSON.parse(saved) : initialLiveBroadcast;
  });
  const [hasDismissedCurrentLive, setHasDismissedCurrentLive] = useState(false);

  // Posts
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('wb_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [surveys] = useState<Survey[]>(initialSurveys);

  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>(() => {
    const saved = localStorage.getItem('wb_survey_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('wb_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem('wb_coaches');
    return saved ? JSON.parse(saved) : initialCoaches;
  });

  const [coachingRequests, setCoachingRequests] = useState<CoachingRequest[]>(() => {
    const saved = localStorage.getItem('wb_coaching_requests');
    return saved ? JSON.parse(saved) : initialCoachingRequests;
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('wb_config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const safeSave = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Límite de almacenamiento en "${key}":`, err);
    }
  };

  useEffect(() => {
    safeSave('wb_users_dir', usersDirectory);
  }, [usersDirectory]);

  useEffect(() => {
    localStorage.setItem('wb_active_user_id', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    safeSave('wb_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeSave('wb_live_broadcast', liveBroadcast);
  }, [liveBroadcast]);

  useEffect(() => {
    safeSave('wb_posts', posts);
  }, [posts]);

  useEffect(() => {
    safeSave('wb_survey_results', surveyResults);
  }, [surveyResults]);

  useEffect(() => {
    safeSave('wb_events', events);
  }, [events]);

  useEffect(() => {
    safeSave('wb_coaches', coaches);
  }, [coaches]);

  useEffect(() => {
    safeSave('wb_coaching_requests', coachingRequests);
  }, [coachingRequests]);

  useEffect(() => {
    safeSave('wb_config', systemConfig);
  }, [systemConfig]);

  // Asegurar que la pestaña activa esté autorizada para el usuario actual
  useEffect(() => {
    if (!userProfile.allowedScreens.includes(userTab)) {
      const firstAllowed = (['feed', 'surveys', 'events', 'coaching'] as const).find((s) =>
        userProfile.allowedScreens.includes(s)
      );
      if (firstAllowed) setUserTab(firstAllowed);
    }
  }, [userProfile, userTab]);

  // Multiusuario & Permisos
  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUsersDirectory((prev) =>
      prev.map((u) => (u.id === userProfile.id ? { ...u, ...data, registered: true } : u))
    );
  };

  const registerNewUser = (
    data: Omit<UserProfile, 'id' | 'registered' | 'active' | 'role' | 'allowedScreens'>
  ) => {
    const newId = `usr-${Date.now()}`;
    const newUser: UserProfile = {
      ...data,
      id: newId,
      registered: true,
      active: true,
      role: 'colaborador',
      allowedScreens: ['feed', 'surveys', 'events', 'coaching', 'upload_content'],
    };
    setUsersDirectory((prev) => [...prev, newUser]);
    setActiveUserId(newId);
    addNotification({
      title: `¡Bienvenido a Wellbeing, ${newUser.name}!`,
      message: 'Tu cuenta ha sido activada. Ya puedes participar en encuestas, eventos, coaching y compartir contenido.',
      type: 'survey',
      targetUser: newUser.name,
    });
  };

  const switchActiveUser = (userId: string) => {
    const target = usersDirectory.find((u) => u.id === userId);
    if (!target) return;
    setActiveUserId(userId);
    if (!target.allowedScreens.includes('admin_console') && viewMode === 'admin') {
      setViewMode('user');
    }
  };

  const updateUserPermissions = (
    userId: string,
    updates: Partial<Pick<UserProfile, 'allowedScreens' | 'active' | 'role' | 'email' | 'name' | 'department' | 'phone' | 'msTeamsUser' | 'position'>>
  ) => {
    setUsersDirectory((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  const adminCreateUser = (data: Omit<UserProfile, 'id' | 'registered'>) => {
    const newId = `usr-${Date.now()}`;
    const newUser: UserProfile = {
      ...data,
      id: newId,
      email: data.email.toLowerCase().trim(),
      registered: true,
    };
    setUsersDirectory((prev) => [...prev, newUser]);
  };

  const adminDeleteUser = (userId: string) => {
    setUsersDirectory((prev) => prev.filter((u) => u.id !== userId));
  };

  const hasScreenAccess = (screen: AppScreenId) => {
    return userProfile.active && userProfile.allowedScreens.includes(screen);
  };

  const findAuthorizedProfileByEmail = (email: string): UserProfile | undefined => {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) return undefined;

    const isMasterEmail =
      isEmailMatch('gabopp1972@gmail.com', cleanEmail) ||
      isEmailMatch('gabopp1972@hotmail.com', cleanEmail) ||
      cleanEmail.startsWith('gabopp1972@');

    return usersDirectory.find(
      (u) => isEmailMatch(u.email, cleanEmail) || (isMasterEmail && u.role === 'admin')
    );
  };

  const syncAuthenticatedGoogleUser = (authUser: AuthUser): boolean => {
    const existing = findAuthorizedProfileByEmail(authUser.email);

    if (existing) {
      setActiveUserId(existing.id);
      if (authUser.avatarUrl && existing.avatar !== authUser.avatarUrl) {
        setUsersDirectory((prev) =>
          prev.map((u) =>
            u.id === existing.id ? { ...u, avatar: authUser.avatarUrl || u.avatar } : u
          )
        );
      }
      return true;
    }

    // Acceso estricto: si no existe un Gmail en los perfiles creados, NO crear cuenta nueva
    return false;
  };

  // Notificaciones filtradas para el usuario actual (globales o dirigidas a él)
  const addNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: 'Justo ahora',
      read: false,
      targetUser: notif.targetUser || 'ALL',
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const userNotifications = notifications.filter(
    (n) => !n.targetUser || n.targetUser === 'ALL' || n.targetUser === userProfile.name
  );

  const unreadNotificationsCount = userNotifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Live Meet Broadcast
  const startLiveBroadcast = (
    title: string,
    meetUrl: string,
    hostName: string = 'Centro de Comando Wellbeing',
    description: string = 'Transmisión corporativa en vivo con anuncios especiales y dinámicas de salud.'
  ) => {
    const updated: LiveBroadcast = {
      active: true,
      title,
      meetUrl,
      hostName,
      description,
      startedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      acceptedUsers: [],
    };
    setLiveBroadcast(updated);
    setHasDismissedCurrentLive(false);

    addNotification({
      title: '🔴 ¡Transmisión en Vivo en Google Meet!',
      message: `El Comando Central ha iniciado la transmisión "${title}". Únete ahora mismo.`,
      type: 'live_stream',
      targetUser: 'ALL',
    });
  };

  const stopLiveBroadcast = () => {
    setLiveBroadcast((prev) => ({ ...prev, active: false }));
    setHasDismissedCurrentLive(false);
  };

  const acceptLiveBroadcast = () => {
    if (!liveBroadcast.acceptedUsers.includes(userProfile.name)) {
      setLiveBroadcast((prev) => ({
        ...prev,
        acceptedUsers: [...prev.acceptedUsers, userProfile.name],
      }));
    }
    window.open(liveBroadcast.meetUrl, '_blank');
  };

  // Feed Actions & Moderación desde Comando Central
  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      author: userProfile.name,
      avatar: userProfile.avatar,
      text,
      createdAt: 'Justo ahora',
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  const createPost = (post: Omit<Post, 'id' | 'likesCount' | 'comments' | 'createdAt'>) => {
    const newP: Post = {
      ...post,
      id: `post-${Date.now()}`,
      likesCount: 0,
      isLiked: false,
      comments: [],
      createdAt: 'Justo ahora',
    };
    setPosts((prev) => [newP, ...prev]);
  };

  const deletePost = (postId: string, moderationReason?: string) => {
    const target = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    if (target) {
      addNotification({
        title: '⚠️ Aviso de Moderación: Publicación Eliminada',
        message: `Tu publicación "${target.title}" ha sido eliminada por el Comando Central.${
          moderationReason ? ` Motivo: ${moderationReason}` : ''
        }`,
        type: 'moderation',
        targetUser: target.author.name,
      });
    }
  };

  const deleteComment = (postId: string, commentId: string, moderationReason?: string) => {
    const post = posts.find((p) => p.id === postId);
    const comment = post?.comments.find((c) => c.id === commentId);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );

    if (comment && post) {
      addNotification({
        title: '⚠️ Aviso de Moderación: Comentario Eliminado',
        message: `Tu comentario "${comment.text}" en la publicación "${post.title}" fue eliminado por el Comando Central.${
          moderationReason ? ` Motivo: ${moderationReason}` : ''
        }`,
        type: 'moderation',
        targetUser: comment.author,
      });
    }
  };

  const popularPosts = [...posts].sort((a, b) => {
    const scoreA = a.likesCount + a.comments.length * 2;
    const scoreB = b.likesCount + b.comments.length * 2;
    return scoreB - scoreA;
  });

  // Survey Actions
  const saveSurveyResult = (result: SurveyResult) => {
    setSurveyResults((prev) => [result, ...prev]);
  };

  // Event Actions
  const toggleEventEnrollment = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;

    const isEnrolled = evt.enrolledUsers.includes(userProfile.name);
    const updatedUsers = isEnrolled
      ? evt.enrolledUsers.filter((u) => u !== userProfile.name)
      : [...evt.enrolledUsers, userProfile.name];

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, enrolledUsers: updatedUsers } : e))
    );

    if (!isEnrolled) {
      addNotification({
        title: `Inscripción Confirmada: ${evt.title}`,
        message: `Te has registrado exitosamente. Te esperamos el ${evt.date} a las ${evt.time} en ${evt.location}.`,
        type: 'event_enrollment',
        eventId: evt.id,
        targetUser: userProfile.name,
      });
    }
  };

  const addEventReview = (eventId: string, rating: number, comment: string) => {
    const newRev: EventReview = {
      id: `rev-${Date.now()}`,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      rating,
      comment,
      createdAt: 'Justo ahora',
    };
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, reviews: [newRev, ...evt.reviews] } : evt))
    );
  };

  const createEvent = (event: Omit<EventItem, 'id' | 'enrolledUsers' | 'reviews'>) => {
    const newE: EventItem = {
      ...event,
      id: `evt-${Date.now()}`,
      enrolledUsers: [],
      reviews: [],
    };
    setEvents((prev) => [newE, ...prev]);
  };

  const updateEvent = (eventId: string, data: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...data } : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Coach Actions
  const toggleCoachActive = (coachId: string) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === coachId ? { ...c, active: !c.active } : c))
    );
  };

  const createCoach = (coach: Omit<Coach, 'id' | 'rating' | 'totalSessions'>) => {
    const newC: Coach = {
      ...coach,
      id: `coach-${Date.now()}`,
      rating: 5.0,
      totalSessions: 0,
    };
    setCoaches((prev) => [newC, ...prev]);
  };

  const updateCoach = (coachId: string, data: Partial<Coach>) => {
    setCoaches((prev) => prev.map((c) => (c.id === coachId ? { ...c, ...data } : c)));
  };

  const deleteCoach = (coachId: string) => {
    setCoaches((prev) => prev.filter((c) => c.id !== coachId));
  };

  // Coaching Requests
  const createCoachingRequest = (
    req: Omit<CoachingRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const newR: CoachingRequest = {
      ...req,
      coacheePhone: req.coacheePhone || userProfile.phone,
      coacheeTeams: req.coacheeTeams || userProfile.msTeamsUser,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'pendiente',
      createdAt: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCoachingRequests((prev) => [newR, ...prev]);

    addNotification({
      title: 'Solicitud de Coaching Enviada',
      message: `Tu solicitud folio ${newR.id} ha llegado al Comando Central para revisión y asignación.`,
      type: 'coaching',
      targetUser: req.coacheeName,
    });
  };

  const updateCoachingRequest = (reqId: string, data: Partial<CoachingRequest>) => {
    setCoachingRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              ...data,
              updatedAt: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
            }
          : r
      )
    );
  };

  const acceptAndAssignCoaching = (reqId: string, coachId: string, notes?: string) => {
    const req = coachingRequests.find((r) => r.id === reqId);
    const coach = coaches.find((c) => c.id === coachId);
    if (!req || !coach) return;

    const now = new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });

    setCoachingRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              assignedCoachId: coachId,
              status: 'asignado',
              adminNotes: notes || r.adminNotes,
              rejectionReason: undefined,
              dispatchLog: {
                sentAt: now,
                channels: ['app', 'email', 'whatsapp', 'ms_teams'],
                coacheeNotified: true,
                coachNotified: true,
              },
              updatedAt: now,
            }
          : r
      )
    );

    addNotification({
      title: '🎉 ¡Solicitud de Coaching Aprobada y Asignada!',
      message: `Tu proceso con ${coach.name} ha sido aprobado (${req.id}). Hemos notificado a ambos por App, Correo, WhatsApp y Microsoft Teams para iniciar.`,
      type: 'coaching',
      targetUser: req.coacheeName,
    });
  };

  const rejectCoachingRequest = (reqId: string, rejectionReason: string) => {
    const req = coachingRequests.find((r) => r.id === reqId);
    if (!req) return;

    const now = new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });

    setCoachingRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'rechazado',
              assignedCoachId: undefined,
              rejectionReason,
              updatedAt: now,
            }
          : r
      )
    );

    addNotification({
      title: 'Actualización sobre tu Solicitud de Coaching',
      message: `La solicitud ${req.id} fue marcada como no aprobada por el Comando Central. Motivo: ${rejectionReason}`,
      type: 'coaching',
      targetUser: req.coacheeName,
    });
  };

  const updateSystemConfig = (data: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...data }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsersDirectory(initialUsersDirectory);
    setActiveUserId(initialUsersDirectory[0].id);
    setPosts(initialPosts);
    setEvents(initialEvents);
    setCoaches(initialCoaches);
    setCoachingRequests(initialCoachingRequests);
    setSystemConfig(initialConfig);
    setNotifications(initialNotifications);
    setLiveBroadcast(initialLiveBroadcast);
    setSurveyResults([]);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        userTab,
        setUserTab,
        adminTab,
        setAdminTab,
        isMobileDeviceFrame,
        setIsMobileDeviceFrame,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        surveyToShare,
        setSurveyToShare,
        usersDirectory,
        userProfile,
        currentUser: userProfile,
        updateUserProfile,
        registerNewUser,
        switchActiveUser,
        updateUserPermissions,
        adminCreateUser,
        adminDeleteUser,
        hasScreenAccess,
        syncAuthenticatedGoogleUser,
        findAuthorizedProfileByEmail,
        notifications,
        userNotifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        liveBroadcast,
        startLiveBroadcast,
        stopLiveBroadcast,
        acceptLiveBroadcast,
        hasDismissedCurrentLive,
        setHasDismissedCurrentLive,
        posts,
        popularPosts,
        toggleLikePost,
        addCommentToPost,
        createPost,
        deletePost,
        deleteComment,
        surveys,
        surveyResults,
        saveSurveyResult,
        events,
        toggleEventEnrollment,
        addEventReview,
        createEvent,
        updateEvent,
        deleteEvent,
        coaches,
        toggleCoachActive,
        createCoach,
        updateCoach,
        deleteCoach,
        coachingRequests,
        createCoachingRequest,
        updateCoachingRequest,
        acceptAndAssignCoaching,
        rejectCoachingRequest,
        systemConfig,
        updateSystemConfig,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
