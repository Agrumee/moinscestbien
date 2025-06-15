import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svgSpritemap } from "vite-plugin-svg-spritemap";
import ViteEslint from 'vite-plugin-eslint';
import path from "path";


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
          additionalData: `@use "variables" as *;`,
          includePaths: [path.resolve(__dirname, "src/styles")],
        },
      },
    },
    server: {
      host: "0.0.0.0",
      hmr: process.env.DJANGO_DEBUG !== "True", // Désactive HMR en prod
    },
  };
});
