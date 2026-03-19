import { Language, TranslationSchema } from '@/types';

interface Props {
    translations: TranslationSchema;
    language: Language;
    onToggleLanguage: () => void;
}

export const Navbar: React.FC<Props> = ({ translations: t, language, onToggleLanguage }) => {
    return (
        <nav className={cn(
            "fixed top-0 inset-x-0 z-50",
            "flex flex-row justify-between items-center",
            "px-10 py-6 glass"
        )}>
            {/* 左側：Logo 群組 */}
            <div className="flex items-center gap-4 shrink-0">
                {/* 橘色圓點 Logo */}
                <div className="w-10 h-10 rounded-full bg-accent" />
                {/* 標題字體為 Serif */}
                <span className="font-serif text-3xl font-light tracking-tight text-white leading-none">
                    Chromatique
                </span>
            </div>

            {/* 右側：選單與按鈕 */}
            <div className="flex items-center gap-12">
                <div className="hidden md:flex gap-10">
                    <a href="#daily" className="nav-link">{t.navDaily}</a>
                    <a href="#create" className="nav-link">{t.navCreate}</a>
                    <a href="#gallery" className="nav-link">{t.navGallery}</a>
                </div>

                <button
                    onClick={onToggleLanguage}
                    className="px-6 py-2 border border-white/20 rounded-full text-xs tracking-widest hover:bg-white/10 transition-colors cursor-pointer text-white"
                >
                    {language === 'en' ? '繁體' : 'English'}
                </button>
            </div>
        </nav>
    );
};
