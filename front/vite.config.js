import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      svgSpritemap({
        pattern: 'src/assets/svg/*.svg',
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/_variables.scss";`
        }
      }
    }
  };
});
