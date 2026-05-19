export type SmartTone = "blue" | "green" | "purple" | "amber" | "red" | "cyan" | "slate";

export type SmartTheme = {
  accent: string;
  accentSoft: string;
  accentStrong: string;
  text: string;
  muted: string;
  border: string;
  borderStrong: string;
  bg: string;
  bgStrong: string;
  iconBg: string;
  shadow: string;
  glow: string;
};

export const smartThemes: Record<SmartTone, SmartTheme> = {
  blue: {
    accent: "#3AA0FF",
    accentSoft: "rgba(58,160,255,0.18)",
    accentStrong: "#78C2FF",
    text: "#FFFFFF",
    muted: "rgba(219,234,254,0.82)",
    border: "rgba(120,194,255,0.32)",
    borderStrong: "rgba(120,194,255,0.58)",
    bg: "linear-gradient(135deg, rgba(31,111,178,0.34) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 55%, #155487 100%)",
    iconBg: "linear-gradient(135deg, rgba(58,160,255,0.34), rgba(31,111,178,0.16))",
    shadow: "0 20px 50px rgba(31,111,178,0.22)",
    glow: "rgba(58,160,255,0.24)",
  },
  green: {
    accent: "#14B8A6",
    accentSoft: "rgba(20,184,166,0.18)",
    accentStrong: "#5EEAD4",
    text: "#FFFFFF",
    muted: "rgba(204,251,241,0.82)",
    border: "rgba(94,234,212,0.32)",
    borderStrong: "rgba(94,234,212,0.58)",
    bg: "linear-gradient(135deg, rgba(20,184,166,0.28) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #0F766E 0%, #14B8A6 52%, #0E7490 100%)",
    iconBg: "linear-gradient(135deg, rgba(20,184,166,0.34), rgba(15,118,110,0.16))",
    shadow: "0 20px 50px rgba(20,184,166,0.20)",
    glow: "rgba(20,184,166,0.22)",
  },
  purple: {
    accent: "#8B5CF6",
    accentSoft: "rgba(139,92,246,0.20)",
    accentStrong: "#C4B5FD",
    text: "#FFFFFF",
    muted: "rgba(237,233,254,0.82)",
    border: "rgba(196,181,253,0.34)",
    borderStrong: "rgba(196,181,253,0.60)",
    bg: "linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 54%, #3AA0FF 100%)",
    iconBg: "linear-gradient(135deg, rgba(139,92,246,0.38), rgba(76,29,149,0.16))",
    shadow: "0 20px 50px rgba(139,92,246,0.24)",
    glow: "rgba(139,92,246,0.24)",
  },
  amber: {
    accent: "#FBBF24",
    accentSoft: "rgba(251,191,36,0.18)",
    accentStrong: "#FDE68A",
    text: "#FFFFFF",
    muted: "rgba(254,243,199,0.82)",
    border: "rgba(253,230,138,0.34)",
    borderStrong: "rgba(253,230,138,0.62)",
    bg: "linear-gradient(135deg, rgba(251,191,36,0.22) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #92400E 0%, #F59E0B 55%, #FBBF24 100%)",
    iconBg: "linear-gradient(135deg, rgba(251,191,36,0.34), rgba(146,64,14,0.18))",
    shadow: "0 20px 50px rgba(251,191,36,0.18)",
    glow: "rgba(251,191,36,0.22)",
  },
  red: {
    accent: "#FB7185",
    accentSoft: "rgba(251,113,133,0.18)",
    accentStrong: "#FDA4AF",
    text: "#FFFFFF",
    muted: "rgba(255,228,230,0.82)",
    border: "rgba(253,164,175,0.34)",
    borderStrong: "rgba(253,164,175,0.62)",
    bg: "linear-gradient(135deg, rgba(251,113,133,0.22) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #881337 0%, #E11D48 55%, #FB7185 100%)",
    iconBg: "linear-gradient(135deg, rgba(251,113,133,0.34), rgba(136,19,55,0.18))",
    shadow: "0 20px 50px rgba(251,113,133,0.18)",
    glow: "rgba(251,113,133,0.22)",
  },
  cyan: {
    accent: "#22D3EE",
    accentSoft: "rgba(34,211,238,0.18)",
    accentStrong: "#A5F3FC",
    text: "#FFFFFF",
    muted: "rgba(207,250,254,0.82)",
    border: "rgba(165,243,252,0.34)",
    borderStrong: "rgba(165,243,252,0.62)",
    bg: "linear-gradient(135deg, rgba(34,211,238,0.22) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #0E7490 0%, #22D3EE 55%, #1F6FB2 100%)",
    iconBg: "linear-gradient(135deg, rgba(34,211,238,0.34), rgba(14,116,144,0.18))",
    shadow: "0 20px 50px rgba(34,211,238,0.18)",
    glow: "rgba(34,211,238,0.22)",
  },
  slate: {
    accent: "#94A3B8",
    accentSoft: "rgba(148,163,184,0.16)",
    accentStrong: "#CBD5E1",
    text: "#FFFFFF",
    muted: "rgba(226,232,240,0.76)",
    border: "rgba(203,213,225,0.24)",
    borderStrong: "rgba(203,213,225,0.42)",
    bg: "linear-gradient(135deg, rgba(148,163,184,0.14) 0%, rgba(17,32,51,0.94) 72%)",
    bgStrong: "linear-gradient(135deg, #0F172A 0%, #334155 60%, #1F6FB2 100%)",
    iconBg: "linear-gradient(135deg, rgba(148,163,184,0.26), rgba(15,23,42,0.18))",
    shadow: "0 20px 50px rgba(0,0,0,0.26)",
    glow: "rgba(148,163,184,0.14)",
  },
};

export function getSmartTheme(tone: SmartTone = "blue") {
  return smartThemes[tone] || smartThemes.blue;
}
