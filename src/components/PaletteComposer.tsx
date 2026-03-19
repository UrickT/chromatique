import { motion, AnimatePresence } from 'motion/react';
import {
    Upload,
    Camera,
    RefreshCw,
    Heart,
    Plus,
    Copy,
    Check,
    Trash2
} from 'lucide-react';
import {
    DropzoneRootProps,
    DropzoneInputProps
} from 'react-dropzone';
import { cn } from '@/lib/utils';
import { TranslationSchema } from '@/types';

interface Props {
    translations: TranslationSchema;
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    isDragActive: boolean;
    startCamera: () => void;
    setCurrentPalette: (colors: string[]) => void;
    savePalette: () => void;
    isExtracting: boolean;
    currentPalette: string[];
    addColor: () => void;
    removeColor: (idx: number) => void;
    setActiveColorIndex: (idx: number) => void;
    setIsPickerOpen: (open: boolean) => void;
    copyToClipboard: (hex: string) => void;
    copiedHex: string | null;
}

export const PaletteComposer: React.FC<Props> = ({
    translations: t,
    getRootProps,
    getInputProps,
    isDragActive,
    startCamera,
    setCurrentPalette,
    savePalette,
    isExtracting,
    currentPalette,
    addColor,
    removeColor,
    setActiveColorIndex,
    setIsPickerOpen,
    copyToClipboard,
    copiedHex
}) => {
    const defaultColors = ['#0A0A0A', '#FFFFFF', '#F27D26', '#E94E77', '#2563EB'];

    return (
        <section id="palette-composer" className="py-24 md:py-32 px-6 md:px-24 border-t border-foreground/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

                {/* 控制面板 */}
                <div className="flex flex-col justify-center">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8 tracking-tighter leading-tight">
                        {t.composeTitle}
                    </h2>
                    <p className="text-lg opacity-50 mb-12 max-w-md leading-relaxed">
                        {t.composeDesc}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-10">
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex-1 h-36 border border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-foreground/[0.02] transition-all group",
                                /* 基礎狀態：極淺的深灰色，幾乎與背景融合 */
                                "border-zinc-700",
                                /* 懸停：輕微點亮 */
                                "hover:border-zinc-300",
                                isDragActive && "border-primary bg-primary/5"
                            )}
                        >
                            <input {...getInputProps()} />
                            <Upload className="mb-3 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
                            <span className="text-xs uppercase tracking-[0.3em] opacity-40">{t.dropImage}</span>
                        </div>

                        <button
                            onClick={startCamera}
                            className={cn("flex-1 h-36 border border-foreground/5 rounded-2xl flex flex-col items-center justify-center hover:bg-foreground/[0.02] transition-all group",
                                /* 基礎狀態：極淺的深灰色，幾乎與背景融合 */
                                "border-zinc-700",
                                /* 懸停：輕微點亮 */
                                "hover:border-zinc-300"
                            )}
                        >
                            <Camera className="mb-3 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
                            <span className="text-xs uppercase tracking-[0.3em] opacity-40">{t.useCamera}</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        {/* 1. Reset 按鈕：優雅的細邊框次要按鈕 */}
                        <button
                            onClick={() => setCurrentPalette(defaultColors)}
                            className={cn(
                                "group relative p-6 bg-transparent rounded-xl flex items-center justify-center gap-3",
                                "border transition-all duration-500 active:scale-[0.98]",
                                /* 基礎狀態：極淺的深灰色，幾乎與背景融合 */
                                "border-zinc-700",
                                /* 懸停狀態：輕微點亮 */
                                "hover:border-zinc-300"
                            )}
                        >
                            <RefreshCw
                                size={16}
                                className="opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700"
                            />
                            <span className="text-xs uppercase tracking-[0.25em] opacity-20 group-hover:opacity-60 font-medium">
                                {t.reset}
                            </span>
                        </button>

                        {/* 2. Save Palette 按鈕：高強度的實色邊框主要按鈕 */}
                        <button
                            onClick={savePalette}
                            className={cn(
                                "group relative w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg overflow-hidden",
                                "transition-all duration-500 active:scale-[0.97] border-2",
                                /* 1. 基礎狀態：純白背景、黑色文字、白色邊框 */
                                "bg-white text-black border-white",
                                /* 2. 懸停狀態：背景變透明、文字變白、邊框保持白色 */
                                "hover:bg-transparent hover:text-white",
                                /* 3. 發光效果：淡淡的白色光暈 */
                                "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            )}
                        >
                            {/* 懸停時的背景遮罩動畫 */}
                            <div className="absolute inset-0 bg-white opacity-100 group-hover:opacity-0 transition-opacity duration-500 -z-10" />

                            <Heart
                                size={20}
                                /* 初始填充，懸停時變為空心線條 */
                                className="fill-none group-hover:fill-current transition-all duration-300 group-hover:scale-110"
                            />

                            <span className="font-bold uppercase text-sm">
                                {t.savePalette}
                            </span>

                        </button>
                    </div>
                </div>

                {/* 編輯區 */}
                <div className="relative">
                    <AnimatePresence>
                        {isExtracting && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-md rounded-3xl"
                            >
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs uppercase tracking-[0.4em] opacity-60">{t.aiExtracting}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence initial={false} mode="popLayout">
                            {currentPalette.map((color, idx) => (
                                <motion.div
                                    key={`${idx}-${color}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative h-20 rounded-xl overflow-hidden flex items-center p-12 cursor-crosshair border border-black/5"
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        setActiveColorIndex(idx);
                                        setIsPickerOpen(true);
                                    }}
                                >
                                    <div className="flex justify-between items-center w-full mix-blend-difference text-white/90">
                                        <span className="font-mono text-xl tracking-tighter uppercase">{color}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyToClipboard(color); }}
                                                className="p-3 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                {copiedHex === color ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeColor(idx); }}
                                                className="p-3 hover:bg-red-500/40 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {currentPalette.length < 10 && (
                            <motion.button
                                layout
                                onClick={addColor}
                                className={cn("h-20 border border-dashed border-foreground/10 rounded-xl flex items-center justify-center gap-3 hover:border-primary/40 hover:bg-foreground/[0.02] transition-all group",
                                    /* 基礎狀態：極淺的深灰色，幾乎與背景融合 */
                                    "border-zinc-700",
                                    /* 懸停：輕微點亮 */
                                    "hover:border-zinc-300"
                                )}
                            >
                                <Plus size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                <span className="text-xs uppercase tracking-[0.3em] opacity-20 group-hover:opacity-100">{t.addColor}</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </section >
    );
};