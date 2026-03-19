import { motion, AnimatePresence } from 'framer-motion';
import { TranslationSchema } from '@/types';

interface Props {
    translations: TranslationSchema;
    showCamera: boolean;
    setShowCamera: (show: boolean) => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    captureImage: () => void;
}

export const CameraModal: React.FC<Props> = ({
    translations: t,
    showCamera,
    setShowCamera,
    videoRef,
    canvasRef,
    captureImage,
}) => {
    /**
     * 停止相機串流並關閉彈窗
     */
    const handleClose = (): void => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setShowCamera(false);
    };

    if (!showCamera) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 flex items-center justify-center p-8">
                {/* 背景遮罩 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />

                {/* 彈窗主體 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden max-w-2xl w-full shadow-2xl"
                >
                    {/* 視訊預覽 */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {/* 隱藏的擷取用元件 */}
                        <canvas
                            ref={canvasRef}
                            width="1280"
                            height="720"
                            className="hidden"
                        />
                    </div>

                    {/* 控制面板 */}
                    <div className="p-8 flex justify-between items-center bg-zinc-900">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {t.cancel}
                        </button>

                        {/* 快門按鈕 */}
                        <button
                            type="button"
                            onClick={captureImage}
                            aria-label="Capture"
                            className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center group transition-all hover:border-white/40"
                        >
                            <div className="w-14 h-14 rounded-full bg-white group-active:scale-90 transition-transform shadow-lg" />
                        </button>

                        {/* 保持排版平衡的佔位空間 */}
                        <div className="w-12" />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};