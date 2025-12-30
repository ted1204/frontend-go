import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
  ],
  resolve: {
    alias: {
      '@nthucscc/ui': resolve(__dirname, 'packages/ui/src/index.ts'),
      '@nthucscc/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
    },
  },
});
