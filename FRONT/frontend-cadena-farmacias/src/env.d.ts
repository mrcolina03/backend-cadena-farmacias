/// <reference types="vite/client" />

// Declaraciones mínimas para `import.meta.env` usadas en este proyecto
// Añade aquí otras variables de entorno de Vite según sea necesario.
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_API_INVENTARIO_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};