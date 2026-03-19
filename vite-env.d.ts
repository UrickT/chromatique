/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gemini AI 的 API 金鑰 */
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
