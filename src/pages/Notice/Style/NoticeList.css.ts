import { style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

export const container = style({
    padding: "40px 24px",
    backgroundColor: "#F8F9FC",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
});

export const contentWrapper = style({
    maxWidth: "1000px",
    width: "100%",
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
    marginBottom: "24px",
    padding: "8px 0",
    transition: "all 0.2s ease",
    ":hover": {
        color: UPLUS_MAGENTA,
        transform: "translateX(-4px)",
    },
});

export const titleSection = style({
    marginBottom: "32px",
});

export const mainTitle = style({
    fontSize: "28px",
    fontWeight: 800,
    margin: "0 0 8px 0",
    color: "#1A1A1A",
});

export const subTitle = style({
    fontSize: "15px",
    color: "#888",
    margin: 0,
});

export const listCard = style({
    backgroundColor: "#FFF",
    borderRadius: "32px",
    padding: "16px 32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
});

export const listItem = style({
    display: "grid",
    gridTemplateColumns: "100px 1fr 120px",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #F3F4F6",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":last-child": {
        borderBottom: "none",
    },
    ":hover": {
        transform: "translateX(8px)",
    },
});

export const categoryTag = style({
    fontSize: "12px",
    fontWeight: 800,
    color: UPLUS_MAGENTA,
    backgroundColor: "#FFF0F6",
    padding: "4px 12px",
    borderRadius: "100px",
    width: "fit-content",
});

export const itemTitle = style({
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "0 20px",
});

export const itemDate = style({
    fontSize: "14px",
    color: "#999",
    textAlign: "right",
});