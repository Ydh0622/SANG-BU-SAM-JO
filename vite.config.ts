import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
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

      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
      "/admin": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
      "/fast": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
});