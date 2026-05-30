type TrackEventPayload = {
  event_name: string;
  event_category?: string;
  event_value?: number | string | null;
  metadata?: Record<string, unknown>;
};

type StoredUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

const LEGACY_TRACK_ENDPOINT = "https://laureasmart.it/api/track-event.php";
const LS_USER_EVENT_ENDPOINT =
  "https://laureasmart.it/api/ls-user-event-save.php";

const getOrCreateSessionId = () => {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem("ls_session_id");

  if (existing) return existing;

  const sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem("ls_session_id", sessionId);

  return sessionId;
};

const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) return null;

    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
};

async function sendTrackEvent(
  endpoint: string,
  payload: Record<string, unknown>,
  label: string
) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`Errore ${label}:`, result);
      return {
        success: false,
        endpoint,
        result,
      };
    }

    console.log(`${label} OK:`, result);

    return {
      success: true,
      endpoint,
      result,
    };
  } catch (error) {
    console.error(`Errore invio ${label}:`, error);

    return {
      success: false,
      endpoint,
      error,
    };
  }
}

export const trackEvent = async ({
  event_name,
  event_category = "generale",
  event_value,
  metadata = {},
}: TrackEventPayload): Promise<void> => {
  if (typeof window === "undefined") return;

  const user = getStoredUser();
  const sessionId = getOrCreateSessionId();

  const userFullName = [user?.nome, user?.cognome].filter(Boolean).join(" ");

  const commonMetadata = {
    ...metadata,
    user_agent: navigator.userAgent,
    app_source: "laurea_smart_pwa",
    created_client_at: new Date().toISOString(),
  };

  /**
   * Payload vecchio: mantiene la struttura già usata da track-event.php.
   * Non lo modifichiamo troppo per evitare di rompere dati già esistenti.
   */
  const legacyPayload = {
    user_email: user?.email || "",
    user_nome: userFullName,
    session_id: sessionId,
    event_name,
    event_category,
    event_value: event_value ?? null,
    page_url: window.location.href,
    metadata: commonMetadata,
  };

  /**
   * Payload nuovo: pensato per ls_user_events.
   * L'endpoint PHP accetta metadata e lo salva in metadata_json.
   */
  const lsUserEventPayload = {
    user_email: user?.email || "",
    user_nome: userFullName,
    session_id: sessionId,
    event_name,
    event_category,
    event_value: event_value ?? null,
    page_url: window.location.href,
    metadata: commonMetadata,
    user_agent: navigator.userAgent,
    app_source: "laurea_smart_pwa",
    created_client_at: new Date().toISOString(),
  };

  await Promise.allSettled([
    sendTrackEvent(LEGACY_TRACK_ENDPOINT, legacyPayload, "trackEvent legacy"),
    sendTrackEvent(
      LS_USER_EVENT_ENDPOINT,
      lsUserEventPayload,
      "trackEvent ls_user_events"
    ),
  ]);
};
