import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svgSpritemap } from "vite-plugin-svg-spritemap";
import ViteEslint from 'vite-plugin-eslint';


export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [
      react(),
      svgSpritemap({
        pattern: "src/assets/svg/*.svg",
      }),
      ViteEslint()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/_variables.scss";`,
        },
      },
    },
    server: {
      host: "0.0.0.0",
    },
  };
});
