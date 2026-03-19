import { ColorPalette, Language } from "@/types";

export const usePalette = (lang: Language) => {
  // ✅ 使用 Lazy Initializer：只會在組件首次掛載時執行一次
  const [palettes, setPalettes] = useState<ColorPalette[]>(() => {
    try {
      const saved = localStorage.getItem("chromatique_palettes");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse palettes from localStorage", error);
      return [];
    }
  });

  const [currentPalette, setCurrentPalette] = useState<string[]>([
    "#0A0A0A",
    "#FFFFFF",
    "#F27D26",
    "#E94E77",
    "#2563EB",
  ]);

  // 移除原本在 useEffect 裡的 setPalettes
  // useEffect(() => { ... }, []); // 這裡不再需要讀取

  const savePalette = () => {
    const newPalette: ColorPalette = {
      id: Math.random().toString(36).substring(2, 11),
      name:
        lang === "zh"
          ? `色板 ${palettes.length + 1}`
          : `Palette ${palettes.length + 1}`,
      colors: [...currentPalette],
      createdAt: Date.now(),
    };
    const updated = [newPalette, ...palettes];
    setPalettes(updated);
    localStorage.setItem("chromatique_palettes", JSON.stringify(updated));
    return newPalette;
  };

  const deletePalette = (id: string) => {
    const updated = palettes.filter((p) => p.id !== id);
    setPalettes(updated);
    localStorage.setItem("chromatique_palettes", JSON.stringify(updated));
  };

  return {
    palettes,
    currentPalette,
    setCurrentPalette,
    savePalette,
    deletePalette,
  };
};
