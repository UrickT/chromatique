import { useDropzone } from 'react-dropzone';
import confetti from 'canvas-confetti';
import { AnimatePresence } from 'framer-motion';
import { translations } from '@/constants/translations';
import { extractColorsFromImage, getDailyColor } from '@/services/geminiService';
import { Language, DailyColorSchema, ColorPaletteSchema } from '@/types';

import { Navbar } from '@/components/Navbar';
import { DailyColor } from "@/components/DailyColor";
import { PaletteComposer } from "@/components/PaletteComposer";
import { PaletteGallery } from "@/components/PaletteGallery";
import { Footer } from "@/components/Footer";
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { CameraModal } from '@/components/CameraModal';

export default function App() {
  /* 語言系統 */
  const [language, setLanguage] = useState<Language>('en');
  const t = useMemo(() => translations[language], [language]);
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'zh' : 'en'));
  };

  /* 每日顏色推薦 */
  const [dailyColor, setDailyColor] = useState<DailyColorSchema | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  /* 顏色盤 */
  const [palettes, setPalettes] = useState<ColorPaletteSchema[]>(() => {
    const saved = localStorage.getItem('chromatique_palettes');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse local palettes", e);
      return [];
    }
  });

  const savePalette = () => {
    const newPalette: ColorPaletteSchema = {
      id: crypto.randomUUID(),
      name: language === 'zh' ? `色板 ${palettes.length + 1}` : `Palette ${palettes.length + 1}`,
      colors: [...currentPalette],
    };
    const updated = [newPalette, ...palettes];
    setPalettes(updated);
    localStorage.setItem('chromatique_palettes', JSON.stringify(updated));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: currentPalette
    });
  };

  const deletePalette = (id: string) => {
    const updated = palettes.filter(p => p.id !== id);
    setPalettes(updated);
    localStorage.setItem('chromatique_palettes', JSON.stringify(updated));
  };

  useEffect(() => {
    // 每當 palettes 改變時，自動同步到 localStorage
    localStorage.setItem('chromatique_palettes', JSON.stringify(palettes));
  }, [palettes]);

  // 3. 原本報錯的那個 useEffect 可以刪除讀取 localStorage 的部分了
  useEffect(() => {
    let isMounted = true;

    const fetchDaily = async () => {
      const color = await getDailyColor(language);
      if (isMounted) setDailyColor(color);
    };

    fetchDaily();
    return () => { isMounted = false; };
  }, [language]);

  useEffect(() => {
    // 每當 palettes 陣列改變（新增、刪除、修改），就自動同步到本地
    localStorage.setItem('chromatique_palettes', JSON.stringify(palettes));
  }, [palettes]);



  const [currentPalette, setCurrentPalette] = useState<string[]>(['#0A0A0A', '#FFFFFF', '#F27D26', '#E94E77', '#2563EB']);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsExtracting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const colors = await extractColorsFromImage(base64, currentPalette.length);
      setCurrentPalette(colors);
      setIsExtracting(false);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        setIsExtracting(true);
        const colors = await extractColorsFromImage(base64, currentPalette.length);
        setCurrentPalette(colors);
        setIsExtracting(false);

        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  const addColor = () => {
    if (currentPalette.length < 10) {
      setCurrentPalette([...currentPalette, '#CCCCCC']);
    }
  };

  const removeColor = (idx: number) => {
    if (currentPalette.length > 2) {
      const updated = currentPalette.filter((_, i) => i !== idx);
      setCurrentPalette(updated);
    }
  };


  return (
    /* 1. 最外層容器 */
    <div className="min-h-screen text-white selection:bg-accent selection:text-white overflow-x-hidden">

      {/* 2. Navbar */}
      <Navbar
        translations={t}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* 3. 每日顏色推薦 */}
      <DailyColor
        translations={t}
        dailyColor={dailyColor}
        copyToClipboard={copyToClipboard}
        copiedHex={copiedHex}
      />

      {/* 4. 提取色板 */}
      <PaletteComposer
        translations={t}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        startCamera={startCamera}
        setCurrentPalette={setCurrentPalette}
        savePalette={savePalette}
        isExtracting={isExtracting}
        currentPalette={currentPalette}
        addColor={addColor}
        removeColor={removeColor}
        setActiveColorIndex={setActiveColorIndex}
        setIsPickerOpen={setIsPickerOpen}
        copyToClipboard={copyToClipboard}
        copiedHex={copiedHex}
      />

      {/* 5. 色板倉庫 */}
      <PaletteGallery
        palettes={palettes}
        deletePalette={deletePalette}
        copyToClipboard={copyToClipboard}
        setCurrentPalette={setCurrentPalette}
        translations={t}
      />

      {/* 6. 頁尾 */}
      <Footer language={language} />

      {/* 7. 色彩選擇器 */}
      <AnimatePresence>
        <ColorPickerModal
          translations={t}
          isPickerOpen={isPickerOpen}
          activeColorIndex={activeColorIndex}
          currentPalette={currentPalette}
          setCurrentPalette={setCurrentPalette}
          setIsPickerOpen={setIsPickerOpen}
        />

        <CameraModal 
          translations={t}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          videoRef={videoRef}
          canvasRef={canvasRef}
          captureImage={captureImage}
        />
      </AnimatePresence>

    </div>
  );
}