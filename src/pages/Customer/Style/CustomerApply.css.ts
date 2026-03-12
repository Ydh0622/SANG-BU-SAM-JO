import { style, keyframes, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_SOFT_PINK = "#FFF0F6";
const UPLUS_BLACK = "#1A1A1A";
const GRADIENT_START = "#FF008A";
const GRADIENT_END = "#E6007E";

const fadeInUp = keyframes({
    from: { opacity: 0, transform: "translateY(20px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

const float = keyframes({
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-8px)" },
    "100%": { transform: "translateY(0px)" },
});

const shimmer = keyframes({
    "0%": { left: "-100%" },
    "100%": { left: "125%" },
});

export const container = style({
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    backgroundImage: `radial-gradient(at 0% 0%, hsla(331,100%,95%,1) 0, transparent 50%), 
                      radial-gradient(at 100% 100%, hsla(210,100%,92%,1) 0, transparent 50%)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Pretendard, system-ui, sans-serif",
    padding: "16px",
    boxSizing: "border-box",
});

export const card = style({
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "32px",
    padding: "clamp(24px, 8vw, 40px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    animation: `${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    position: "relative",
    boxSizing: "border-box",
});

export const header = style({
    textAlign: "center",
    marginBottom: "min(24px, 5vw)",
});

export const iconCircle = style({
    width: "min(64px, 15vw)",
    height: "min(64px, 15vw)",
    borderRadius: "20px",
    backgroundColor: UPLUS_SOFT_PINK,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 16px",
    animation: `${float} 3s ease-in-out infinite`,
});

export const title = style({
    fontSize: "clamp(20px, 5vw, 24px)",
    fontWeight: 900,
    color: UPLUS_BLACK,
    marginBottom: "8px",
    letterSpacing: "-0.8px",
});

export const subtitle = style({
    fontSize: "clamp(13px, 3.5vw, 15px)",
    color: "#6B7280",
    lineHeight: "1.4",
});

export const form = style({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
});

export const inputGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
});

export const label = style({
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    paddingLeft: "2px",
});

export const inputWrapper = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
});

export const inputIcon = style({
    position: "absolute",
    left: "16px",
    color: "#9CA3AF",
    zIndex: 2,
    width: "18px",
});

export const input = style({
    width: "100%",
    height: "min(52px, 13vw)",
    padding: "0 16px 0 44px",
    borderRadius: "14px",
    border: "2px solid #F1F3F5",
    fontSize: "15px",
    fontWeight: 500,
    color: UPLUS_BLACK,
    backgroundColor: "#F9FAFB",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    ":focus": {
        backgroundColor: "#FFF",
        borderColor: UPLUS_MAGENTA,
        outline: "none",
        boxShadow: `0 0 0 4px ${UPLUS_SOFT_PINK}`,
    },
    selectors: {
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px #F9FAFB inset !important",
            WebkitTextFillColor: `${UPLUS_BLACK} !important`,
        },
        "&:-webkit-autofill:focus": {
            WebkitBoxShadow: "0 0 0px 1000px #FFF inset !important",
            WebkitTextFillColor: `${UPLUS_BLACK} !important`,
        },
        "&:-webkit-autofill:hover": {
            WebkitBoxShadow: "0 0 0px 1000px #F9FAFB inset !important",
            WebkitTextFillColor: `${UPLUS_BLACK} !important`,
        }
    }
});

export const submitBtn = style({
    position: "relative",
    overflow: "hidden",
    height: "56px",
    width: "100%",
    background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
    color: "#FFF",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: 800,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 10px 20px rgba(230, 0, 126, 0.2)",
    transition: "all 0.3s ease",
    ":active": {
        transform: "scale(0.98)",
    }
});

export const btnShimmer = style({
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "50%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "skewX(-25deg)",
    animation: `${shimmer} 3s infinite`,
    pointerEvents: "none",
});

globalStyle(`${inputWrapper}:focus-within svg`, {
    color: UPLUS_MAGENTA,
    transform: "scale(1.1)",
});

globalStyle(`${form} > div[style*="flex"]`, {
    flexWrap: "wrap",
});