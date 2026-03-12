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
    minHeight: "100vh", // height 대신 minHeight로 내용이 길어질 경우 대비
    backgroundColor: "#F3F4F6",
    backgroundImage: `radial-gradient(at 0% 0%, hsla(331,100%,95%,1) 0, transparent 50%), 
                      radial-gradient(at 100% 100%, hsla(210,100%,92%,1) 0, transparent 50%)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Pretendard, system-ui, sans-serif",
    padding: "16px", // 모바일 여백 감소
    boxSizing: "border-box",
    overflowY: "auto", // 내용이 많아지면 스크롤 허용
});

export const card = style({
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "32px", // 모바일 조화력을 위해 약간 조정
    padding: "32px 24px", // 기본 모바일 패딩
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 20px rgba(230, 0, 126, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    animation: `${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
    position: "relative",

    "@media": {
        "screen and (min-width: 768px)": {
            padding: "48px 40px",
            borderRadius: "40px",
        }
    }
});

export const header = style({
    textAlign: "center",
    marginBottom: "24px",
    "@media": {
        "screen and (min-width: 768px)": {
            marginBottom: "32px",
        }
    }
});

export const iconCircle = style({
    width: "60px",
    height: "60px",
    borderRadius: "20px",
    backgroundColor: UPLUS_SOFT_PINK,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 16px",
    boxShadow: `0 10px 20px ${UPLUS_SOFT_PINK}`,
    animation: `${float} 3s ease-in-out infinite`,
    
    "@media": {
        "screen and (min-width: 768px)": {
            width: "72px",
            height: "72px",
            borderRadius: "24px",
        }
    }
});

export const title = style({
    fontSize: "20px", // 모바일 폰트 크기
    fontWeight: 900,
    color: UPLUS_BLACK,
    marginBottom: "8px",
    letterSpacing: "-0.5px",
    
    "@media": {
        "screen and (min-width: 768px)": {
            fontSize: "24px",
            letterSpacing: "-0.8px",
        }
    }
});

export const subtitle = style({
    fontSize: "14px",
    color: "#6B7280",
    lineHeight: "1.5",
    wordBreak: "keep-all", // 한글 가독성 향상
});

export const form = style({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    "@media": {
        "screen and (min-width: 768px)": {
            gap: "20px",
        }
    }
});

export const inputGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
});

export const label = style({
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    paddingLeft: "4px",
    "@media": {
        "screen and (min-width: 768px)": {
            fontSize: "14px",
        }
    }
});

export const inputWrapper = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
});

export const inputIcon = style({
    position: "absolute",
    left: "16px",
    color: "#9CA3AF",
    zIndex: 2,
    transition: "all 0.3s ease",
    width: "18px",
    height: "18px",
});

export const input = style({
    width: "100%",
    height: "52px", // 모바일 터치 최적화
    padding: "0 16px 0 46px",
    borderRadius: "14px",
    border: "2px solid #F1F3F5",
    fontSize: "15px",
    fontWeight: 500,
    color: UPLUS_BLACK,
    backgroundColor: "#F9FAFB",
    transition: "all 0.3s ease",
    appearance: "none", // select 태그 브라우저 기본 스타일 제거

    ":focus": {
        backgroundColor: "#FFF",
        borderColor: UPLUS_MAGENTA,
        outline: "none",
        boxShadow: `0 0 0 4px ${UPLUS_SOFT_PINK}`,
    },

    "@media": {
        "screen and (min-width: 768px)": {
            height: "56px",
            padding: "0 20px 0 52px",
            borderRadius: "16px",
        }
    }
});

export const submitBtn = style({
    position: "relative",
    overflow: "hidden",
    height: "56px",
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
    width: "100%",

    ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 15px 25px rgba(230, 0, 126, 0.3)",
    },
    ":active": {
        transform: "translateY(0)",
    },
    ":disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
        background: "#CCC",
    },

    "@media": {
        "screen and (min-width: 768px)": {
            height: "60px",
            fontSize: "17px",
            borderRadius: "18px",
            marginTop: "10px",
        }
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

// 전역 스타일: Focus 시 아이콘 색상 변경
globalStyle(`${inputWrapper}:focus-within svg`, {
    color: UPLUS_MAGENTA,
    transform: "scale(1.1)",
});

// React 컴포넌트 내의 select 박스 화살표 위치 조절을 위해
globalStyle(`${inputWrapper} select`, {
    cursor: "pointer",
});