import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { DailyColorSchema, TranslationSchema } from '@/types';

interface Props {
    translations: TranslationSchema;
    dailyColor: DailyColorSchema | null;
    copiedHex: string | null;
    copyToClipboard: (hex: string) => void;
}

/**
 * DailyColor - 每日色彩展示區塊
 * 呈現由 Gemini AI 產出的今日靈魂色彩
 */
export const DailyColor: React.FC<Props> = ({
    translations: t,
    dailyColor,
    copyToClipboard,
    copiedHex
}) => {
    return (
        <section
            id="daily-color"
            className="relative min-h-[95vh] flex flex-col justify-center px-6 md:px-24 overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {dailyColor ? (
                    <motion.div
                        key={dailyColor.hex}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                        className="max-w-6xl z-10"
                    >
                        {/* 上方小標 */}
                        <span className="text-xs opacity-40 md:text-xs uppercase tracking-[0.5em] text-foreground/40 mb-8 block font-normal">
                            {t.heroSubtitle}
                        </span>

                        {/* 主標題：色彩名稱 */}
                        <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] leading-[0.8] font-serif mb-12 tracking-tighter text-foreground">
                            {dailyColor.name}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                            {/* 圓形彩色球 */}
                            <motion.div
                                layoutId="main-color-sphere"
                                className="w-40 h-40 md:w-64 md:h-64 rounded-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-white/5"
                                style={{ backgroundColor: dailyColor.hex }}
                                initial={{ scale: 0.9, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            />

                            <div className="flex-1 space-y-12">
                                {/* AI 色彩描述 */}
                                <p className="text-3xl md:text-3xl font-serif italic text-foreground/90 leading-[1.1] text-balance">
                                    "{dailyColor.description}"
                                </p>

                                {/* HEX 複製按鈕 */}
                                <button
                                    onClick={() => copyToClipboard(dailyColor.hex)}
                                    className="group flex items-center gap-6 py-3 px-1 transition-all active:scale-95"
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="text-md uppercase opacity-40 tracking-[0.2em] text-foreground/30 mb-1">
                                            {t.hex}
                                        </span>
                                        <span className="text-4xl md:text-5xl font-mono tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                            {dailyColor.hex.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="mt-8 p-4 rounded-full bg-foreground/5 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                        {copiedHex === dailyColor.hex ? (
                                            <Check size={28} className="text-green-500 group-hover:text-white" />
                                        ) : (
                                            <Copy size={28} className="opacity-30 group-hover:opacity-100" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* 加載 Skeleton */
                    <div className="max-w-5xl z-10 animate-pulse space-y-12">
                        <div className="h-4 w-48 bg-foreground/5 rounded-full" />
                        <div className="h-48 md:h-64 w-full bg-foreground/5 rounded-3xl" />
                        <div className="flex gap-12">
                            <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-foreground/5" />
                            <div className="flex-1 space-y-8">
                                <div className="h-12 w-full bg-foreground/5 rounded-xl" />
                                <div className="h-12 w-4/5 bg-foreground/5 rounded-xl" />
                                <div className="h-16 w-64 bg-foreground/5 rounded-xl" />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* 背景氛圍光渲染 */}
            <div
                className="absolute top-1/2 right-[-15%] -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[180px] opacity-20 pointer-events-none transition-colors duration-1000 ease-out"
                style={{ backgroundColor: dailyColor?.hex || 'var(--color-primary)' }}
            />

            {/* 頁面引導裝飾線 */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: 120 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute bottom-10 left-8 md:left-24 w-px from-foreground/30 to-transparent"
            />
        </section>
    );
};