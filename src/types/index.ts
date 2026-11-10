export type PostType = 'image' | 'video' | 'infographic' | 'audio' | 'news';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    department?: string;
  };
  type: PostType;
  title: string;
  description: string;
  mediaUrl: string;
  audioDuration?: string; // Ej: "8 seg" para audios cortos
  category: 'salud' | 'emociones' | 'nutricion' | 'comunidad' | 'anuncio';
  likesCount: number;
  isLiked?: boolean;
  comments: Comment[];
  createdAt: string;
  tags?: string[];
  isUserUpload?: boolean;
}

export interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'fortaleza' | 'mejorar' | 'critico';
}

export interface SurveyQuestion {
  id: number;
  text: string;
  type: 'likert' | 'boolean' | 'nps' | 'text';
  dimension?: string;
  positiveAnswer?: 'V' | 'F';
}

export interface SurveyInterpretationReport {
  generatedBy: 'Gemini AI';
  disclaimer: string;
  overallDiagnosis: string;
  strengths: string[];
  areasOfOpportunity: string[];
  recommendedActionPlan: string[];
  alertNotice?: string;
  calculatedNps?: {
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    category: 'Excelente' | 'Bueno' | 'Aceptable' | 'Bajo';
  };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: 'servicio_bp' | 'duelo_perdida' | 'emociones' | 'salud';
  estimatedMinutes: number;
  questions: SurveyQuestion[];
  instructions: string;
  dimensions?: {
    name: string;
    questionIds: number[];
    maxScore: number;
  }[];
}

export interface SurveyResult {
  id: string;
  surveyId: string;
  surveyTitle: string;
  userName: string;
  completedAt: string;
  answers: Record<number, number | string>;
  totalScore: number;
  maxPossibleScore: number;
  levelInterpretation: string;
  dimensionScores?: DimensionScore[];
  npsScore?: number;
  aiReport?: SurveyInterpretationReport;
}

export interface EventReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Programa XEX' | 'All Hands' | 'Mindfulness' | 'Salud & Deporte' | 'Conferencia';
  description: string;
  fullDetails: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  capacity: number;
  enrolledUsers: string[];
  coverImage: string;
  reviews: EventReview[];
}

export type CoachingGoalArea =
  | 'team_building'
  | 'communication'
  | 'leadership'
  | 'customer_relation'
  | 'decision_making'
  | 'conflict_resolution'
  | 'personal_vision'
  | 'others';

export interface Coach {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  credentials: string[];
  avatar: string;
  availableDays: string;
  active: boolean;
  rating: number;
  totalSessions: number;
  email: string;
  phone: string;
  msTeamsUser: string;
}

export type CoachingStatus =
  | 'pendiente'
  | 'en_revision'
  | 'asignado'
  | 'en_proceso'
  | 'concluido'
  | 'rechazado';

export interface CoachingDispatchLog {
  sentAt: string;
  channels: ('app' | 'email' | 'whatsapp' | 'ms_teams')[];
  coacheeNotified: boolean;
  coachNotified: boolean;
}

export interface CoachingRequest {
  id: string;
  coacheeName: string;
  coacheeEmail: string;
  coacheePhone?: string;
  coacheeTeams?: string;
  coacheeDepartment: string;
  selectedCoachIds: string[];
  assignedCoachId?: string;
  reason: string;
  startDatePreference: string;
  goalAreas: CoachingGoalArea[];
  otherDetails?: string;
  status: CoachingStatus;
  adminNotes?: string;
  rejectionReason?: string;
  dispatchLog?: CoachingDispatchLog;
  createdAt: string;
  updatedAt: string;
}

export type EmergencyType =
  | 'fallecimiento'
  | 'accidente_grave'
  | 'robo_extravio_equipo'
  | 'amenaza_seguridad';

export interface SystemConfig {
  emergencyWhatsAppNumber: string;
  emergencyCoordinatorName: string;
  pbpEmail: string;
  pbpCoordinatorName: string;
}

// INFRAESTRUCTURA MULTIUSUARIO & RBAC (Control de Accesos por Pantalla)
export type AppScreenId =
  | 'feed'
  | 'surveys'
  | 'events'
  | 'coaching'
  | 'upload_content'
  | 'admin_console';

export type UserRole = 'admin' | 'lider' | 'colaborador' | 'coach';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  msTeamsUser: string;
  department: string;
  position: string;
  avatar: string;
  wellnessGoal: string;
  registered: boolean;
  active: boolean;
  role: UserRole;
  allowedScreens: AppScreenId[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event_enrollment' | 'event_reminder' | 'live_stream' | 'survey' | 'coaching' | 'moderation';
  eventId?: string;
  targetUser?: string; // Nombre o 'ALL'
}

export interface LiveBroadcast {
  active: boolean;
  title: string;
  meetUrl: string;
  hostName: string;
  startedAt: string;
  description: string;
  acceptedUsers: string[];
}
