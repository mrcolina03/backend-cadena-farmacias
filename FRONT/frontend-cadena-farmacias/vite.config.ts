import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // 💡 NECESARIO: Importar 'resolve'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 🎯 Mapeamos los aliases para que Vite sepa dónde buscarlos
      '@api': resolve(__dirname, './src/api'),
      '@app': resolve(__dirname, './src/app'),
      '@components': resolve(__dirname, './src/components'), // <--- ESTO ARREGLA EL ERROR
      '@domains': resolve(__dirname, './src/domains'),
      '@styles': resolve(__dirname, './src/styles'),
      '@types': resolve(__dirname, './src/types'),
    }
  }
});
