import { style, keyframes, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_SOFT_PINK = "#FFF0F6";
const UPLUS_BLACK = "#1A1A1A";
const GRADIENT_START = "#FF008A";
const GRADIENT_END = "#E6007E";

/** ✨ 역동적인 등장을 위한 애니메이션 */
const fadeInUp = keyframes({
    from: { opacity: 0, transform: "translateY(30px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

const float = keyframes({
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" },
});

const shimmer = keyframes({
    "100%": { left: "125%" },
});

export const container = style({
    width: "100%",
    height: "100vh",
    // ✨ 배경에 부드러운 그라데이션과 패턴 추가
    backgroundColor: "#F3F4F6",
    backgroundImage: `radial-gradient(at 0% 0%, hsla(331,100%,95%,1) 0, transparent 50%), 
                      radial-gradient(at 100% 100%, hsla(210,100%,92%,1) 0, transparent 50%)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Pretendard, system-ui, sans-serif",
    padding: "20px",
    overflow: "hidden",
});

export const card = style({
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)", // ✨ 글래스모피즘 효과
    borderRadius: "40px",
    padding: "56px 48px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 20px rgba(230, 0, 126, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
    position: "relative",
});

export const header = style({
    textAlign: "center",
    marginBottom: "44px",
});

export const iconCircle = style({
    width: "80px",
    height: "80px",
    borderRadius: "28px",
    backgroundColor: UPLUS_SOFT_PINK,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 24px",
    boxShadow: `0 10px 20px ${UPLUS_SOFT_PINK}`,
    animation: `${float} 3s ease-in-out infinite`, // ✨ 아이콘 둥둥 뜨는 효과
});

export const title = style({
    fontSize: "26px",
    fontWeight: 900,
    color: UPLUS_BLACK,
    marginBottom: "12px",
    letterSpacing: "-0.8px",
    lineHeight: 1.3,
});

export const subtitle = style({
    fontSize: "15.5px",
    color: "#6B7280",
    lineHeight: "1.6",
    wordBreak: "keep-all",
});

export const form = style({
    display: "flex",
    flexDirection: "column",
    gap: "28px",
});

export const inputGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
});

export const label = style({
    fontSize: "14px",
    fontWeight: 700,
    color: "#374151",
    paddingLeft: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
});

export const inputWrapper = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.2s ease",
    ":focus-within": {
        transform: "translateX(4px)", // ✨ 포커스 시 살짝 오른쪽으로 이동
    }
});

export const inputIcon = style({
    position: "absolute",
    left: "20px",
    color: "#9CA3AF",
    transition: "all 0.3s ease",
    zIndex: 1,
});

export const input = style({
    width: "100%",
    height: "60px",
    padding: "0 20px 0 56px",
    borderRadius: "20px",
    border: "2px solid #F1F3F5", // ✨ 보더를 조금 더 두껍고 연하게
    fontSize: "16px",
    fontWeight: 500,
    color: UPLUS_BLACK,
    backgroundColor: "#F9FAFB",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ":focus": {
        backgroundColor: "#FFF",
        borderColor: UPLUS_MAGENTA,
        outline: "none",
        boxShadow: `0 0 0 5px ${UPLUS_SOFT_PINK}`,
    },
    "::placeholder": {
        color: "#ADB5BD",
    },
});

/** ✨ 인풋 포커스 시 아이콘 색상 변경 */
globalStyle(`${inputWrapper}:focus-within svg`, {
    color: UPLUS_MAGENTA,
    transform: "scale(1.1)",
});

export const submitBtn = style({
    position: "relative",
    overflow: "hidden", // ✨ 쉬머 효과를 위해 추가
    height: "64px",
    background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`, // ✨ 그라데이션 버튼
    color: "#FFF",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: 800,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 12px 24px rgba(230, 0, 126, 0.25)",
    ":hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 15px 30px rgba(230, 0, 126, 0.4)",
        filter: "brightness(1.1)",
    },
    ":active": {
        transform: "scale(0.96)",
    },
});

/** ✨ 버튼 위를 지나가는 반짝임 효과 (Shimmer) */
export const btnShimmer = style({
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "50%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "skewX(-25deg)",
    animation: `${shimmer} 3s infinite`,
});

export const footer = style({
    marginTop: "36px",
    textAlign: "center",
    fontSize: "13.5px",
    color: "#9CA3AF",
    fontWeight: 500,
    letterSpacing: "-0.2px",
});

// ✅ 체크표시 등 장식 요소 (선택사항)
export const requiredDot = style({
    color: UPLUS_MAGENTA,
    marginLeft: "2px",
});