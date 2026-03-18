import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:8081";
  const adminTarget = env.VITE_API_BASE_URL || "http://localhost:8082";
  const fastApiTarget = env.VITE_API_BASE_URL || "http://localhost:8000";

  console.log(
    "[VITE ENV]",
    "API:", apiTarget,
    "ADMIN:", adminTarget,
    "FASTAPI:", fastApiTarget,
  );

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "unsafe-none",
      },
      // 백엔드 서버들로 요청을 배달해주는 프록시 설정
      proxy: {
        "/admin": {
          target: adminTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/fastapi": {
          target: fastApiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react(), vanillaExtractPlugin()],
  };
});