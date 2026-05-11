type MetaPixelParams = Record<string, string | number | boolean | undefined>;

type MetaPixelFunction = (
  command: "track" | "trackCustom",
  eventName: string,
  params?: MetaPixelParams
) => void;

export function trackMetaEvent(
  eventName: string,
  params?: MetaPixelParams,
  standard: boolean = false
) {
  if (typeof window === "undefined") return;

  const metaWindow = window as Window & {
    fbq?: MetaPixelFunction;
  };

  if (typeof metaWindow.fbq !== "function") return;

  metaWindow.fbq(standard ? "track" : "trackCustom", eventName, params);
}
