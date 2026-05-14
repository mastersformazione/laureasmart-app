type TrackEventPayload = {
  event_name: string;
  event_category?: string;
  event_value?: number;
  metadata?: Record<string, unknown>;
};

type StoredUser = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
};

const TRACK_ENDPOINT = "https://laureasmart.it/api/track-event.php";

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

export const trackEvent = async ({
  event_name,
  event_category = "generale",
  event_value,
  metadata = {},
}: TrackEventPayload) => {
  if (typeof window === "undefined") return;

  const user = getStoredUser();
  const sessionId = getOrCreateSessionId();

  const payload = {
    user_email: user?.email || "",
    user_nome: [user?.nome, user?.cognome].filter(Boolean).join(" "),
    session_id: sessionId,
    event_name,
    event_category,
    event_value,
    page_url: window.location.href,
    metadata: {
      ...metadata,
      user_agent: navigator.userAgent,
      app_source: "laurea_smart_pwa",
      created_client_at: new Date().toISOString(),
    },
  };

  try {
    const response = await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Errore trackEvent:", result);
      return;
    }

    console.log("trackEvent OK:", result);
  } catch (error) {
    console.error("Errore invio trackEvent:", error);
  }
};
