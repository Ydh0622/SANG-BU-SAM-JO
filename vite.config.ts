import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiTarget = env.VITE_API_BASE_URL || "https://ureca.site";

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
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/fastapi": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react(), vanillaExtractPlugin()],
  };
});