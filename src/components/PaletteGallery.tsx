import { motion, AnimatePresence } from 'motion/react';
import { Palette, Trash2, ChevronRight, Copy } from 'lucide-react';
import { ColorPaletteSchema, TranslationSchema } from '../types';
import { cn } from '../lib/utils';

interface Props {
    palettes: ColorPaletteSchema[];
    deletePalette: (id: string) => void;
    copyToClipboard: (hex: string) => void;
    setCurrentPalette: (colors: string[]) => void;
    translations: TranslationSchema;
}

export const PaletteGallery: React.FC<Props> = ({
    translations: t,
    palettes,
    deletePalette,
    copyToClipboard,
    setCurrentPalette
}) => {
    return (
        <section id="palette-gallery" className="py-24 md:py-32 px-6 md:px-24 bg-background border-t border-foreground/5">
            {/* 標題區域 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6 tracking-tighter leading-tight">
                        {t.collectionTitle}
                    </h2>
                    <p className="text-lg opacity-40 font-serif italic max-w-md">
                        {t.collectionSubtitle}
                    </p>
                </div>
                <div className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-medium pb-2">
                    {palettes.length} {t.palettesCount}
                </div>
            </div>

            {/* 空狀態 */}
            {palettes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("py-32 border border-dashed border-foreground/5 rounded-2xl flex flex-col items-center justify-center text-center bg-foreground/[0.01]",
                        "border-zinc-700",
                    )}
                >
                    <div className="relative mb-8">
                        <Palette size={64} className="opacity-5" />
                        <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
                    </div>
                    <p className="text-xl opacity-20 font-serif italic tracking-wide">{t.noPalettes}</p>
                </motion.div>
            ) : (
                /* 色板網格 */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {palettes.map((palette) => (
                            <motion.div
                                key={palette.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                className={cn(
                                    "relative p-8 transition-all duration-700 group",
                                    "bg-white/10 backdrop-blur-md",
                                    "border border-zinc-700 rounded-2xl",
                                )}
                            >
                                {/* 卡片頭部：名稱與刪除 */}
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-serif tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">
                                        {palette.name}
                                    </h3>
                                    <button
                                        onClick={() => deletePalette(palette.id)}
                                        className="p-3 rounded-full text-foreground/20 hover:text-red-500/80 hover:bg-red-500/5 transition-all active:scale-90"
                                        title={t.removeColor}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* 色彩預覽條：Accordion 效果 */}
                                <div className="flex h-36 rounded-2xl overflow-hidden mb-8 shadow-inner border border-black/10">
                                    {palette.colors.map((color, i) => (
                                        <motion.div
                                            key={`${palette.id}-${color}-${i}`}
                                            className="group/color relative flex-1 hover:flex-[2.5] transition-all duration-700 ease-in-out cursor-copy"
                                            style={{ backgroundColor: color }}
                                            onClick={() => copyToClipboard(color)}
                                        >
                                            {/* 懸停顯示 HEX */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity mix-blend-difference text-white">
                                                <Copy size={14} className="scale-75" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* 卡片底部：日期與載入按鈕 */}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => {
                                            setCurrentPalette(palette.colors);
                                            // 滾動到色板構建區
                                            const composerElement = document.getElementById('palette-composer');
                                            if (composerElement) {
                                                composerElement.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start'
                                                });
                                            }
                                        }}
                                        className={cn(
                                            "group/btn px-4 py-2 rounded-full flex items-center gap-2",
                                            "text-[10px] uppercase tracking-[0.2em] opacity-40 transition-all",
                                            "hover:opacity-100 hover:text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        {t.load}
                                        <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
};