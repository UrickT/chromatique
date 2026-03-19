import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { TranslationSchema } from '@/types';


interface Props {
    translations: TranslationSchema;
    isPickerOpen: boolean;
    activeColorIndex: number | null;
    currentPalette: string[];
    setCurrentPalette: (colors: string[]) => void;
    setIsPickerOpen: (open: boolean) => void;
}

export const ColorPickerModal: React.FC<Props> = ({
    translations: t,
    isPickerOpen,
    activeColorIndex,
    currentPalette,
    setCurrentPalette,
    setIsPickerOpen,
}) => {
    // 基礎防禦邏輯：若狀態不齊全則不進行渲染
    if (!isPickerOpen || activeColorIndex === null) return null;

    const currentColor = currentPalette[activeColorIndex] || "#FFFFFF";

    /**
     * 統一處理顏色更新邏輯
     * @param newColor 十六進位顏色字串
     */
    const handleColorUpdate = (newColor: string): void => {
        if (activeColorIndex === null) return;
        const updated = [...currentPalette];
        updated[activeColorIndex] = newColor.toUpperCase();
        setCurrentPalette(updated);
    };

    /**
     * 處理輸入框文字改變事件
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        handleColorUpdate(e.target.value);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 flex items-center justify-center p-8">
                {/* 背景遮罩 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPickerOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* 彈窗主體 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-serif font-light tracking-tight">{t.adjustColor}</h3>
                        <button
                            onClick={() => setIsPickerOpen(false)}
                            className="p-2 -mr-2 opacity-40 hover:opacity-100 hover:bg-white/5 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 核心選擇器區域 */}
                    <div className="custom-picker mb-8 flex justify-center">
                        <HexColorPicker
                            color={currentColor}
                            onChange={handleColorUpdate}
                        />
                    </div>

                    {/* 下方預覽與輸入欄位 */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div
                            className="w-12 h-12 rounded-xl shadow-inner transition-colors duration-200"
                            style={{ backgroundColor: currentColor }}
                        />
                        <div className="flex flex-col flex-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-1">HEX CODE</span>
                            <input
                                type="text"
                                value={currentColor}
                                spellCheck={false}
                                onChange={handleInputChange}
                                className="bg-transparent border-none p-0 focus:ring-0 font-mono text-xl w-full uppercase tracking-tight"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};