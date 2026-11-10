import { AuthUser } from '../../types/auth';
import { UserProfile } from '../../types';
import { initialUsersDirectory } from '../../data/initialData';
import { fetchCloudState } from '../cloudSyncService';

const STORAGE_KEY_SESSION = 'wb_auth_session';
const STORAGE_KEY_LAST_ERROR = 'wb_last_auth_error';

export const getDefaultRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return 'http://localhost:5173/auth/callback';
};

export const getOAuthConfig = () => {
  return {
    google: {
      clientId:
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        '1011892109967-nra10fe82lqpq0lu2kjpslqmclteklsk.apps.googleusercontent.com',
      redirectUri: getDefaultRedirectUri(),
      scope: 'openid email profile',
    },
  };
};

const generateRandomString = (length = 32): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => charset[dec % charset.length]).join('');
};

/**
 * Canonicación para cuentas de Gmail (@gmail.com / @googlemail.com):
 * Google ignora los puntos (.) en el nombre de usuario y cualquier etiqueta después de (+).
 */
export const canonicalizeGmail = (email: string): string | null => {
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') return null;
  const cleanLocal = local.split('+')[0].replace(/\./g, '');
  return `${cleanLocal}@gmail.com`;
};

/**
 * Compara direcciones de correo electrónico considerando coincidencia exacta,
 * canonicación de Gmail y alias con '+'.
 */
export const isEmailMatch = (configuredEmail: string, inputEmail: string): boolean => {
  if (!configuredEmail || !inputEmail) return false;

  const cleanInput = inputEmail.toLowerCase().trim();
  if (!cleanInput) return false;

  const configuredList = configuredEmail
    .toLowerCase()
    .split(/[,;\s/|]+/)
    .map((e) => e.trim())
    .filter(Boolean);

  const inputGmailCanonical = canonicalizeGmail(cleanInput);

  for (const conf of configuredList) {
    if (conf === cleanInput) return true;

    if (inputGmailCanonical) {
      const confGmailCanonical = canonicalizeGmail(conf);
      if (confGmailCanonical && confGmailCanonical === inputGmailCanonical) {
        return true;
      }
    }

    if (cleanInput.includes('+')) {
      const [localPart, domainPart] = cleanInput.split('@');
      const baseClean = `${localPart.split('+')[0]}@${domainPart}`;
      if (conf === baseClean) return true;
    }

    if (conf.includes('+')) {
      const [confLocal, confDomain] = conf.split('@');
      const baseConf = `${confLocal.split('+')[0]}@${confDomain}`;
      if (baseConf === cleanInput) return true;
    }
  }

  return false;
};

export const getRegisteredUsersDirectory = (): UserProfile[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('wb_users_dir');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
  }
  return [...initialUsersDirectory];
};

export const isMasterAccount = (email: string): boolean => {
  const clean = (email || '').toLowerCase().trim();
  if (!clean) return false;
  return (
    isEmailMatch('gabopp1972@gmail.com', clean) ||
    isEmailMatch('gabopp1972@hotmail.com', clean) ||
    clean.startsWith('gabopp1972@')
  );
};

/**
 * Pre-descarga el directorio de usuarios más reciente desde Azure antes de validar el login.
 */
export const prefetchCloudUsersDirectory = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    const { state } = await fetchCloudState(true);
    if (state?.usersDirectory && Array.isArray(state.usersDirectory) && state.usersDirectory.length > 0) {
      localStorage.setItem('wb_users_dir', JSON.stringify(state.usersDirectory));
    }
  } catch (err) {
    console.warn('[CloudSync] No se pudo pre-descargar directorio antes de auth:', err);
  }
};

/**
 * Valida la autorización del correo autenticado por Google/Gmail contra el directorio de usuarios.
 */
export const validateEmailAuthorization = (
  email: string,
  _nameHint?: string
): {
  authorized: boolean;
  error?: string;
  isInactive?: boolean;
  matchedUser?: UserProfile;
} => {
  const clean = (email || '').toLowerCase().trim();
  if (!clean) {
    return {
      authorized: false,
      error: 'No se pudo obtener una dirección de correo válida desde la cuenta de Google.',
    };
  }

  const list = getRegisteredUsersDirectory();

  // 1. Administrador / Desarrollador Master siempre autorizado (soporta Gmail y Hotmail)
  if (isMasterAccount(clean)) {
    const master =
      list.find(
        (u) =>
          isEmailMatch(u.email, clean) ||
          u.id === 'usr-1' ||
          u.role === 'admin'
      ) || initialUsersDirectory[0];

    return {
      authorized: true,
      matchedUser: {
        ...master,
        active: true,
        role: 'admin',
        allowedScreens: [
          'feed',
          'surveys',
          'events',
          'coaching',
          'upload_content',
          'admin_console',
        ],
      },
    };
  }

  // 2. Verificar si existe en el directorio y está explícitamente SUSPENDIDO / INACTIVO
  const existing = list.find((u) => isEmailMatch(u.email, clean));
  if (existing) {
    if (!existing.active) {
      return {
        authorized: false,
        isInactive: true,
        matchedUser: existing,
        error: `Acceso restringido: El usuario "${existing.name}" (${clean}) se encuentra registrado pero su perfil está actualmente SUSPENDIDO / INACTIVO en el Comando Central.`,
      };
    }
    return { authorized: true, matchedUser: existing };
  }

  // 3. Si no existe un Gmail registrado en ninguno de los perfiles creados: DENEGAR ACCESO COMPLETAMENTE
  return {
    authorized: false,
    isInactive: false,
    error: `Acceso denegado: El correo electrónico "${clean}" no se encuentra registrado en la configuración de accesos del Comando Central de Wellbeing.`,
  };
};

export const saveUserSession = (user: AuthUser): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  } catch {
    // Ignore storage quota issues
  }
};

export const getStoredUserSession = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const parsed: AuthUser = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearUserSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_LAST_ERROR);
  } catch {
    // Ignore
  }
};

export const ensureGoogleGsiLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    const win = window as unknown as { google?: { accounts?: { oauth2?: unknown } } };
    if (win.google?.accounts?.oauth2) return resolve();

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (win.google?.accounts?.oauth2 || attempts > 35) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

/**
 * Autenticación real con Google Identity Services (GIS Token Client).
 */
export const loginWithGoogleGIS = (): Promise<AuthUser> => {
  const { clientId } = getOAuthConfig().google;

  return new Promise(async (resolve, reject) => {
    await ensureGoogleGsiLoaded();

    const win = window as unknown as {
      google?: {
        accounts?: {
          oauth2?: {
            initTokenClient: (config: {
              client_id: string;
              scope: string;
              callback: (res: {
                access_token?: string;
                expires_in?: number | string;
                error?: string;
                error_description?: string;
              }) => void;
            }) => {
              requestAccessToken: (options?: { prompt?: string }) => void;
            };
          };
        };
      };
    };

    if (!win.google?.accounts?.oauth2?.initTokenClient) {
      reject(
        new Error(
          'Google Identity Services SDK no pudo cargarse. Verifica tu conexión a internet o bloqueadores de scripts.'
        )
      );
      return;
    }

    try {
      const client = win.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            if (tokenResponse.error === 'popup_closed_by_user') {
              reject(new Error('Inicio de sesión cancelado al cerrar la ventana de Google.'));
            } else {
              reject(
                new Error(
                  `Error de Google (${tokenResponse.error}): ${
                    tokenResponse.error_description || 'Acceso no concedido.'
                  }`
                )
              );
            }
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('No se recibió Access Token válido de Google.'));
            return;
          }

          try {
            const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            if (!userinfoRes.ok) {
              throw new Error(`Error al consultar perfil de Google (${userinfoRes.status})`);
            }

            const info = await userinfoRes.json();
            const email = (info.email || '').toLowerCase().trim();
            const name =
              info.name || info.given_name || email.split('@')[0] || 'Usuario Google';
            const id = info.sub || generateRandomString(16);
            const avatarUrl =
              info.picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=ffffff&bold=true`;

            await prefetchCloudUsersDirectory();

            const authCheck = validateEmailAuthorization(email, name);
            if (!authCheck.authorized) {
              const errMsg = authCheck.error || 'Acceso restringido en Wellbeing.';
              sessionStorage.setItem(STORAGE_KEY_LAST_ERROR, errMsg);
              const err = new Error(errMsg) as Error & {
                isInactive?: boolean;
                deniedEmail?: string;
                deniedName?: string;
              };
              err.isInactive = authCheck.isInactive;
              err.deniedEmail = email;
              err.deniedName = name;
              reject(err);
              return;
            }

            const expiresIn = tokenResponse.expires_in
              ? Number(tokenResponse.expires_in)
              : 3600;

            const user: AuthUser = {
              id,
              email,
              name: authCheck.matchedUser ? authCheck.matchedUser.name : name,
              avatarUrl,
              provider: 'google',
              accessToken: tokenResponse.access_token,
              expiresAt: Date.now() + expiresIn * 1000,
            };

            saveUserSession(user);
            resolve(user);
          } catch (err: unknown) {
            const msg =
              err instanceof Error ? err.message : 'Error al procesar perfil de Google';
            reject(new Error(msg));
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al inicializar cliente de Google GIS';
      reject(new Error(msg));
    }
  });
};

