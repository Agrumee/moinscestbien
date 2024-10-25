import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svgSpritemap } from "vite-plugin-svg-spritemap";

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

    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://127.0.0.1:8000/api',
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  };
});
