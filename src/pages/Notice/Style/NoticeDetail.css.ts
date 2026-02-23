import { style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

export const container = style({
    padding: "40px 24px",
    backgroundColor: "#F8F9FC",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
});

export const card = style({
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "#FFF",
    padding: "48px",
    borderRadius: "32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
});

export const backButton = style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "32px",
    padding: "8px 0",
    transition: "all 0.2s ease",
    ":hover": {
        color: UPLUS_MAGENTA,
        transform: "translateX(-4px)",
    },
});

export const header = style({
    borderBottom: "1px solid #EEE",
    paddingBottom: "24px",
    marginBottom: "32px",
});

export const categoryTag = style({
    fontSize: "14px",
    fontWeight: 800,
    padding: "4px 12px",
    borderRadius: "100px",
    display: "inline-block",
    marginBottom: "12px",
});

export const title = style({
    fontSize: "32px",
    fontWeight: 800,
    margin: "0 0 16px 0",
    color: "#1A1A1A",
});

export const meta = style({
    display: "flex",
    gap: "16px",
    color: "#999",
    fontSize: "14px",
});

export const content = style({
    fontSize: "17px",
    lineHeight: "1.8",
    color: "#333",
    whiteSpace: "pre-wrap", 
    minHeight: "300px",
});