import { Language } from "@/types";

interface Props {
    language: Language;
}

export const Footer: React.FC<Props> = ({ language }) => {
    return (
        <footer className="py-24 px-8 md:px-24 border-t border-white/10 text-center">
            <div className="max-w-2xl mx-auto">
                {/* 橘色圓點 Logo */}
                <div className="w-12 h-12 rounded-full bg-accent mx-auto mb-8 animate-pulse" />

                {/* 品牌標題 */}
                <h2 className="text-4xl mb-6 font-light tracking-tighter">Chromatique</h2>

                {/* 康定斯基名言 */}
                <p className="text-lg opacity-40 font-serif italic mb-12 leading-relaxed">
                    {language === 'zh'
                        ? "「色彩是直接影響靈魂的力量。」 —— 瓦西里·康定斯基"
                        : "\"Color is a power which directly influences the soul.\" — Wassily Kandinsky"}
                </p>

                {/* 次要資訊連結 */}
                <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.3em] opacity-20">
                    <span>© 2026</span>
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
            </div>
        </footer>
    );
};
