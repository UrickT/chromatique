import { TranslationSchema } from "../types";

/**
 * 全域多國語言字典
 * 嚴格遵循 TranslationSchema 定義，確保類型安全性
 */
export const translations: Record<"en" | "zh", TranslationSchema> = {
  en: {
    dailyTitle: "Color of the Day",
    navDaily: "Daily",
    navCreate: "Create",
    navGallery: "Gallery",
    heroSubtitle: "Color of the Day",
    composeTitle: "Compose your palette.",
    composeDesc:
      "Extract colors from the world around you or build them from scratch. Chromatique uses AI to find the perfect harmony.",
    dropImage: "Drop Image",
    useCamera: "Use Camera",
    savePalette: "Save Palette",
    collectionTitle: "Your Collection",
    collectionSubtitle: "A personal archive of chromatic discoveries.",
    noPalettes: "No palettes saved yet.",
    palettesCount: "Palettes",
    load: "Load",
    adjustColor: "Adjust Color",
    cancel: "Cancel",
    aiExtracting: "AI Extracting...",
    copied: "Copied",
    hex: "HEX",
    addColor: "Add Color",
    removeColor: "Remove",
    reset: "Reset",
    lang: "中文",
    dailyColorRecommendation: "Today's Featured Color", // 補充先前組件引用的 Key
    copySuccess: "Copied to clipboard!",
  },
  zh: {
    dailyTitle: "今日之色",
    navDaily: "每日",
    navCreate: "創作",
    navGallery: "畫廊",
    heroSubtitle: "今日之色",
    composeTitle: "構建你的色板",
    composeDesc:
      "從周遭世界提取色彩，或從零開始構建。Chromatique 使用 AI 尋找完美的和諧。",
    dropImage: "拖放圖片",
    useCamera: "使用相機",
    savePalette: "保存色板",
    collectionTitle: "你的收藏",
    collectionSubtitle: "個人色彩發現的檔案館。",
    noPalettes: "尚未保存任何色板。",
    palettesCount: "色板",
    load: "加載",
    adjustColor: "調整顏色",
    cancel: "取消",
    aiExtracting: "AI 提取中...",
    copied: "已複製",
    hex: "十六進制",
    addColor: "添加顏色",
    removeColor: "移除",
    reset: "重置",
    lang: "English",
    dailyColorRecommendation: "今日推薦色彩",
    copySuccess: "已複製到剪貼簿！",
  },
};
