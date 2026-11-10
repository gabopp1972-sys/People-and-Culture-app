/**
 * Servicio de Sincronización en Tiempo Real en la Nube (Fast Cloud State Sync) para Wellbeing.
 * - Sincronización continua y fiable cada 1.5 segundos entre diferentes computadoras y móviles.
 * - Sincronización instantánea (0ms) entre pestañas del mismo dispositivo con BroadcastChannel.
 * - Subida directa de videos, reels, fotos y audios a Azure Blob Storage compartido.
 * - Prevención de bucles y bypass estricto de caché HTTP (cache: 'no-store').
 */

import {
  AppNotification,
  Coach,
  CoachingRequest,
  EventItem,
  LiveBroadcast,
  Post,
  SurveyResult,
  SystemConfig,
  UserProfile,
} from '../types';

export interface WellbeingCloudState {
  version: string;
  updatedAt: string;
  updatedBy?: string;
  usersDirectory?: UserProfile[];
  posts?: Post[];
  events?: EventItem[];
  coaches?: Coach[];
  coachingRequests?: CoachingRequest[];
  surveyResults?: SurveyResult[];
  notifications?: AppNotification[];
  liveBroadcast?: LiveBroadcast;
  systemConfig?: SystemConfig;
}

export interface FetchCloudResult {
  hasChanges: boolean;
  state: WellbeingCloudState | null;
}

const PROD_API_ORIGIN = 'https://yellow-smoke-023a86e0f.8.azurestaticapps.net';
const STORAGE_SYNC_KEY = 'wb_last_cloud_sync';
const BROADCAST_CHANNEL_NAME = 'wellbeing_realtime_bus';

let lastSyncedTimestamp: string | null =
  typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SYNC_KEY) : null;
let lastSyncError: string | null = null;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let isSaving = false;

let localBus: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    localBus = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    // Ignore unsupported environments
  }
}

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
      return `${PROD_API_ORIGIN}/api`;
    }
    return '/api';
  }
  return `${PROD_API_ORIGIN}/api`;
};

export const getBroadcastChannel = (): BroadcastChannel | null => localBus;

export const getLastSyncError = (): string | null => lastSyncError;

export const getLastSyncedTimestamp = (): string | null => {
  if (lastSyncedTimestamp) return lastSyncedTimestamp;
  try {
    return localStorage.getItem(STORAGE_SYNC_KEY);
  } catch {
    return null;
  }
};

export const setLastSyncedTimestamp = (ts: string): void => {
  lastSyncedTimestamp = ts;
  try {
    localStorage.setItem(STORAGE_SYNC_KEY, ts);
  } catch {
    // Ignore
  }
};

/**
 * Consulta el estado central en Azure (/api/state) evitando cualquier caché HTTP.
 */
export const fetchCloudState = async (force = false): Promise<FetchCloudResult> => {
  lastSyncError = null;
  try {
    const url = `${getApiBaseUrl()}/state?t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      lastSyncError = `Error HTTP ${res.status}`;
      return { hasChanges: false, state: null };
    }

    const data = await res.json();
    if (!data?.exists || !data?.state) {
      return { hasChanges: false, state: null };
    }

    const state: WellbeingCloudState = data.state;

    if (!force && lastSyncedTimestamp && state.updatedAt === lastSyncedTimestamp) {
      return { hasChanges: false, state: null };
    }

    lastSyncedTimestamp = state.updatedAt;
    try {
      localStorage.setItem(STORAGE_SYNC_KEY, state.updatedAt);
    } catch {
      // Ignore
    }

    return { hasChanges: true, state };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de red';
    lastSyncError = `Fallo al consultar nube: ${msg}`;
    return { hasChanges: false, state: null };
  }
};

/**
 * Envía inmediatamente el estado unificado a Azure y difunde por BroadcastChannel local.
 */
export const pushCloudStateImmediately = async (
  partialState: Partial<WellbeingCloudState>,
  userEmail?: string
): Promise<boolean> => {
  if (isSaving) return false;
  isSaving = true;
  lastSyncError = null;

  try {
    const updatedAt = new Date().toISOString();
    const payload: WellbeingCloudState = {
      version: 'wb-v1',
      updatedAt,
      updatedBy: userEmail || 'wellbeing-client',
      ...partialState,
    };

    // 1. Difusión instantánea (0ms) entre pestañas del mismo dispositivo
    if (localBus) {
      try {
        localBus.postMessage({ type: 'LOCAL_SYNC_BROADCAST', state: payload });
      } catch {
        // Ignore
      }
    }

    // 2. Guardar en Azure Storage vía Managed API
    const res = await fetch(`${getApiBaseUrl()}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      lastSyncedTimestamp = updatedAt;
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, updatedAt);
      } catch {
        // Ignore
      }
      return true;
    }

    const errText = await res.text().catch(() => '');
    lastSyncError = `Error HTTP ${res.status}: ${errText.substring(0, 100)}`;
    return false;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de red';
    lastSyncError = `Fallo al guardar en nube: ${msg}`;
    return false;
  } finally {
    isSaving = false;
  }
};

/**
 * Agenda un envío rápido (250ms debounce) para sincronización casi instantánea.
 */
export const scheduleCloudPush = (
  getState: () => Partial<WellbeingCloudState>,
  userEmail?: string,
  delayMs = 250,
  onSuccess?: () => void
): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    const currentState = getState();
    const ok = await pushCloudStateImmediately(currentState, userEmail);
    if (ok && onSuccess) {
      onSuccess();
    }
  }, delayMs);
};

/**
 * Sube un archivo multimedia (Video, Reel, Foto, Audio) a Azure Blob Storage
 * y retorna su URL pública HTTPS compartida por todos los dispositivos.
 */
export const uploadMediaFileToCloud = async (file: File): Promise<string> => {
  const sasRes = await fetch(`${getApiBaseUrl()}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
    }),
  });

  if (!sasRes.ok) {
    throw new Error(`No se pudo obtener URL de subida (${sasRes.status})`);
  }

  const { uploadUrl, publicUrl } = await sasRes.json();

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`Error al subir archivo a Azure Storage (${putRes.status})`);
  }

  return publicUrl;
};
