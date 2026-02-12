import { style, keyframes } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const AI_BLUE = "#007AFF";
const AI_SOFT_BLUE = "#F0F7FF";

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const container = style({
  width: "100%", height: "100vh", display: "flex", flexDirection: "column",
  backgroundColor: "#F3F4F6", animation: `${fadeIn} 0.4s ease-out`,
});

export const header = style({
  height: "64px", padding: "0 24px", backgroundColor: "#FFF",
  borderBottom: "1px solid #E5E7EB", display: "flex",
  justifyContent: "space-between", alignItems: "center", zIndex: 10,
});

export const headerLeft = style({ display: "flex", alignItems: "center", gap: "12px" });
export const statusDot = style({
  width: "10px", height: "10px", borderRadius: "50%",
  backgroundColor: "#22C55E", boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.2)"
});
export const title = style({ fontSize: "16px", fontWeight: 700, color: UPLUS_BLACK });
export const timer = style({ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6B7280" });

export const exitButton = style({
  padding: "8px 16px", backgroundColor: UPLUS_MAGENTA, borderRadius: "8px",
  fontSize: "14px", fontWeight: 600, color: "#FFF", border: "none", cursor: "pointer",
  transition: "all 0.2s", ":hover": { opacity: 0.9 }
});

export const logoutButton = style({
  background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "8px", borderRadius: "50%", transition: "all 0.2s",
  ":hover": { color: UPLUS_BLACK, backgroundColor: "#F3F4F6" }
});

export const mainLayout = style({
  flex: 1, display: "grid", gridTemplateColumns: "280px 1fr 280px", gap: "1px",
  backgroundColor: "#E5E7EB", overflow: "hidden",
});

export const sideSection = style({ backgroundColor: "#F9FAFB", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" });

export const card = style({
  backgroundColor: "#FFF", padding: "20px", borderRadius: "16px", border: "1px solid #E5E7EB"
});
export const cardTitle = style({ fontSize: "14px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" });
export const profileInfo = style({ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #F3F4F6" });
export const avatar = style({ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#F3F4F6", display: "flex", justifyContent: "center", alignItems: "center" });
export const infoList = style({ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" });
export const infoItem = style({ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4B5563" });

export const chatSection = style({ backgroundColor: "#FFF", display: "flex", flexDirection: "column", position: "relative" });
export const messageList = style({ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" });

export const customerMsg = style({ alignSelf: "flex-start", display: "flex", flexDirection: "column" });
export const agentMsg = style({ alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end" });
export const aiMsg = style({ alignSelf: "center", width: "95%" });

export const bubble = style({
  maxWidth: "75%", padding: "12px 16px", borderRadius: "16px", fontSize: "14px", lineHeight: "1.5",
  selectors: {
    [`${customerMsg} &`]: { backgroundColor: "#F3F4F6", color: UPLUS_BLACK, borderBottomLeftRadius: "2px" },
    [`${agentMsg} &`]: { backgroundColor: UPLUS_MAGENTA, color: "#FFF", borderBottomRightRadius: "2px" },
    [`${aiMsg} &`]: { backgroundColor: AI_SOFT_BLUE, color: AI_BLUE, border: `1px dashed ${AI_BLUE}`, textAlign: "center" }
  }
});

export const msgTime = style({ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" });

export const aiGuideArea = style({ padding: "16px 24px", backgroundColor: "#F8FAFC", borderTop: "1px solid #E5E7EB" });
export const aiGuideHeader = style({ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: AI_BLUE, marginBottom: "12px" });
export const suggestionList = style({ display: "flex", gap: "8px", overflowX: "auto" });
export const suggestBtn = style({
  whiteSpace: "nowrap", padding: "8px 14px", backgroundColor: "#FFF", border: `1px solid ${AI_BLUE}`,
  borderRadius: "20px", fontSize: "12px", color: AI_BLUE, cursor: "pointer", transition: "all 0.2s",
  ":hover": { backgroundColor: AI_BLUE, color: "#FFF" }
});

export const inputArea = style({ padding: "20px 24px", display: "flex", gap: "12px", alignItems: "center" });
export const input = style({ flex: 1, height: "48px", padding: "0 20px", borderRadius: "24px", border: "1px solid #E5E7EB", fontSize: "14px" });
export const sendBtn = style({ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: UPLUS_MAGENTA, color: "#FFF", border: "none", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" });