import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Encontrá lugares que cambian cómo vivís la ciudad.',
    subtitle: 'Planes, rincones y salidas elegidas por gente que se mueve como vos.',
    button: 'Continuar',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85',
  },
  {
    title: 'Guardá momentos. Compartí experiencias.',
    subtitle: 'De una cena íntima a una noche con música, todo puede convertirse en plan.',
    button: 'Continuar',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85',
  },
  {
    title: 'Tu ciudad se siente distinta cuando sabés dónde caer.',
    subtitle: 'Entrá a MOVA y descubrí qué está pasando cerca tuyo.',
    button: 'Entrar a MOVA',
    image:
      'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=85',
  },
];

function Logo({ className = '' }) {
  return (
    <p className={`text-[1.72rem] font-bold tracking-[-0.01em] text-white ${className}`}>
      MOVA<span className="text-[#C8FF3D]">.</span>
    </p>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2300);
    return () => window.clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      navigate('/login');
      return;
    }

    setActiveIndex((index) => index + 1);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.section
            key="splash"
            className="relative z-20 mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center overflow-hidden bg-[#050505]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo className="text-[3.1rem]" />
            </motion.div>
            <div className="absolute bottom-12 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#C8FF3D]"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.85, ease: 'easeInOut' }}
              />
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="onboarding"
            className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#050505] shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative min-h-screen overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.08, x: 28 }}
                  animate={{ opacity: 1, scale: 1.02, x: 0 }}
                  exit={{ opacity: 0, scale: 1.04, x: -28 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/82 via-black/36 to-black/96" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_68%,rgba(200,255,61,0.10),transparent_42%)]" />

              <header className="relative z-10 flex items-center justify-between px-6 pt-8">
                <Logo />
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/82 backdrop-blur-xl transition hover:bg-white/16"
                >
                  Omitir
                </Link>
              </header>

              <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-end px-6 pb-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.title}
                    initial={{ opacity: 0, x: 26, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                    transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF3D]">
                      Experiencias urbanas
                    </p>
                    <h1 className="max-w-[21rem] text-[2.38rem] font-bold leading-[1.04] tracking-[-0.018em] text-white">
                      {activeSlide.title}
                    </h1>
                    <p className="mt-4 max-w-[19rem] text-base font-medium leading-[1.45] text-white/76">
                      {activeSlide.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileTap={{ scale: 0.97 }}
                  className="mt-10 flex h-16 w-full items-center justify-between rounded-full border border-white/12 bg-white/12 px-5 pl-6 text-left text-base font-semibold text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition hover:bg-white/16"
                >
                  <span>{activeSlide.button}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#C8FF3D] text-2xl font-bold text-black shadow-[0_0_28px_rgba(200,255,61,0.42)]">
                    →
                  </span>
                </motion.button>

                <div className="mt-6 flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/18"
                      aria-label={`Ir al paso ${index + 1}`}
                    >
                      <motion.span
                        className="block h-full rounded-full bg-[#C8FF3D]"
                        initial={false}
                        animate={{ scaleX: index <= activeIndex ? 1 : 0 }}
                        style={{ originX: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
