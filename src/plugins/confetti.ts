import confetti from "canvas-confetti";

export const firePaletteConfetti = (colors: string[]): void => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    gravity: 1.2,
  });
};

export const fireDailySuccess = (): void => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti({
      particleCount: 40,
      startVelocity: 30,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });
  }, 250);
};
