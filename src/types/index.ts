/**
 * 每日色彩數據結構
 * 由 Gemini AI 插件返回的結構化數據
 */
export interface DailyColorSchema {
  hex: string;
  name: string;
  description: string;
  year?: number;
  inspiration?: string;
}

/**
 * 用戶保存的色板
 * 包含多個顏色以及元數據
 */
export interface ColorPaletteSchema {
  id: string;
  name: string;
  colors: string[]; // HEX 字符串數組，例如 ["#000000", "#FFFFFF"]
  tags?: string[];
  isFavorite?: boolean;
}

/**
 * 基礎色彩單位
 * 用於描述單個顏色的詳細信息
 */
export interface ColorDetailSchema {
  hex: string;
  name?: string;
  rgb?: { r: number; g: number; b: number };
}

/**
 * 翻譯字典類型定義
 * 用於實作多國語言切換 (en / zh)
 */
export interface TranslationSchema {
  dailyTitle: string;
  navDaily: string;
  navCreate: string;
  navGallery: string;
  heroSubtitle: string;
  composeTitle: string;
  composeDesc: string;
  dropImage: string;
  useCamera: string;
  savePalette: string;
  collectionTitle: string;
  collectionSubtitle: string;
  noPalettes: string;
  palettesCount: string;
  load: string;
  adjustColor: string;
  cancel: string;
  aiExtracting: string;
  copied: string;
  hex: string;
  addColor: string;
  removeColor: string;
  reset: string;
  lang: string;
  dailyColorRecommendation: string;
  copySuccess: string;
}

/**
 * 通用的組件狀態類型
 */
export type ThemeMode = "light" | "dark";
export type Language = "en" | "zh";
