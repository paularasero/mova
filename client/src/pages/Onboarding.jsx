import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const slides = [
  {
    variant: 'blur',
    kicker: 'Urban signal',
    title: 'Encontrá planes con pulso propio.',
    subtitle: 'Una forma más visual de leer tu ciudad, descubrir escenas y moverte con gente cerca.',
    button: 'Continuar',
  },
  {
    variant: 'ribbons',
    kicker: 'Shared motion',
    title: 'Guardá momentos. Sumate a la vibra.',
    subtitle: 'Planes que se cruzan, se guardan y empiezan a moverse cuando alguien dice voy.',
    button: 'Continuar',
  },
  {
    variant: 'poster',
    kicker: 'MOVA map',
    title: 'La ciudad cambia cuando sabés dónde caer.',
    subtitle: 'Un mapa social para planes urbanos, encuentros espontáneos y lugares con carácter.',
    button: 'Entrar a MOVA',
  },
];

function Logo({ className = '' }) {
  return (
    <p className={`text-[1.72rem] font-black tracking-[-0.035em] text-white ${className}`}>
      MOVA<span className="text-[#FF74C8]">.</span>
    </p>
  );
}

function BlurComposition() {
  const circles = [
    ['#FF74C8', 24, 100, 138],
    ['#67C8FF', 172, 78, 118],
    ['#FFD84D', 260, 180, 88],
    ['#0A7D44', 70, 242, 126],
    ['#FF7A2F', 206, 305, 92],
    ['#9D7BFF', 314, 338, 112],
  ];

  return (
    <div className="absolute inset-0">
      {circles.map(([color, left, top, size], index) => (
        <motion.div
          key={`${color}-${index}`}
          className="absolute rounded-full blur-[10px]"
          style={{ left, top, width: size, height: size, background: color, opacity: 0.72 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.72, scale: [1, 1.04, 1], x: [0, index % 2 ? 10 : -8, 0], y: [0, index % 2 ? -8 : 10, 0] }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.8, delay: index * 0.04, x: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        />
      ))}
      <motion.div className="absolute left-9 top-[29rem] h-px w-72 bg-white/22" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent,rgba(11,11,15,.24)_42%,#0B0B0F_83%)]" />
    </div>
  );
}

function RibbonComposition() {
  const ribbons = [
    ['#67C8FF', -68, 120, 320, 48, -24],
    ['#FF74C8', 64, 198, 330, 48, 18],
    ['#FFD84D', -42, 286, 310, 42, -18],
    ['#0A7D44', 142, 362, 260, 46, 22],
  ];

  return (
    <div className="absolute inset-0">
      {ribbons.map(([color, left, top, width, height, rotate], index) => (
        <motion.div
          key={`${color}-${index}`}
          className="mova-ribbon absolute"
          style={{ left, top, width, height, background: `linear-gradient(90deg, ${color}, rgba(255,255,255,.22))`, rotate }}
          initial={{ opacity: 0, x: index % 2 ? 70 : -70, filter: 'blur(8px)' }}
          animate={{ opacity: 0.92, x: 0, filter: 'blur(0px)', y: [0, index % 2 ? 8 : -8, 0] }}
          exit={{ opacity: 0, x: index % 2 ? -48 : 48, filter: 'blur(8px)' }}
          transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1], y: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
        />
      ))}
      <motion.div className="absolute left-12 top-28 h-[27rem] w-px bg-white/16" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9 }} />
      <motion.div className="absolute right-11 top-36 h-[22rem] w-px bg-white/16" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: 0.1 }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,15,.08),#0B0B0F_86%)]" />
    </div>
  );
}

function PosterComposition() {
  return (
    <div className="absolute inset-0">
      <motion.div className="absolute left-6 top-28 h-64 w-40 rounded-[2.25rem] bg-[#FF74C8]" initial={{ opacity: 0, y: 34, rotate: -8 }} animate={{ opacity: 0.9, y: 0, rotate: -8 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }} />
      <motion.div className="absolute right-5 top-20 h-72 w-44 rounded-[5rem] bg-[#0A7D44]" initial={{ opacity: 0, y: -30, rotate: 14 }} animate={{ opacity: 0.92, y: [0, -8, 0], rotate: 14 }} exit={{ opacity: 0 }} transition={{ duration: 0.75, y: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }} />
      <motion.div className="absolute left-16 top-72 h-44 w-72 rounded-[2.5rem] bg-[#FFD84D]" initial={{ opacity: 0, x: -40, rotate: -15 }} animate={{ opacity: 0.94, x: 0, rotate: -15 }} transition={{ duration: 0.75, delay: 0.1 }} />
      <motion.div className="absolute right-10 top-[24rem] h-40 w-40 rounded-full bg-[#67C8FF] blur-[1px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.75, scale: [1, 1.03, 1] }} transition={{ duration: 0.75, scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }} />
      <motion.div className="absolute left-8 top-36 h-[26rem] w-[22rem] rounded-[3rem] border border-white/14" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,transparent,rgba(11,11,15,.18)_45%,#0B0B0F_86%)]" />
    </div>
  );
}

function AbstractScene({ variant }) {
  return (
    <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(14px)' }} transition={{ duration: 0.5 }}>
      {variant === 'blur' && <BlurComposition />}
      {variant === 'ribbons' && <RibbonComposition />}
      {variant === 'poster' && <PosterComposition />}
    </motion.div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2200);
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
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.section
            key="splash"
            className="relative z-20 mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center overflow-hidden bg-[#0B0B0F]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <motion.div className="absolute h-80 w-80 rounded-full bg-[#FF74C8]/60 blur-2xl" animate={{ scale: [1, 1.08, 1], x: [-18, 18, -18] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute h-72 w-28 rounded-full bg-[#67C8FF]/70 blur-xl" animate={{ rotate: [20, 52, 20], y: [-20, 18, -20] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">
              <Logo className="text-[3.45rem]" />
            </motion.div>
            <div className="absolute bottom-12 h-[3px] w-44 overflow-hidden rounded-full bg-white/12">
              <motion.div className="h-full rounded-full bg-[#FF74C8]" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
            </div>
          </motion.section>
        ) : (
          <motion.section key="onboarding" className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#0B0B0F]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative min-h-screen overflow-hidden">
              <AnimatePresence mode="wait">
                <AbstractScene key={activeSlide.variant} variant={activeSlide.variant} />
              </AnimatePresence>

              <header className="relative z-10 flex items-center justify-between px-6 pt-8">
                <Logo />
                <Link to="/login" className="rounded-[0.9rem] border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/78 backdrop-blur-xl">
                  Omitir
                </Link>
              </header>

              <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-end px-6 pb-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.title}
                    initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
                    transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="mb-4 inline-flex rounded-[0.75rem] border border-white/12 bg-white/[0.09] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-xl">
                      {activeSlide.kicker}
                    </p>
                    <h1 className="max-w-[22rem] text-[2.78rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-white">
                      {activeSlide.title}
                    </h1>
                    <p className="mt-5 max-w-[20rem] text-base font-medium leading-[1.5] text-white/68">{activeSlide.subtitle}</p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileTap={{ scale: 0.985 }}
                  className="mt-10 flex h-[3.75rem] w-full items-center justify-between rounded-[1rem] border border-white/12 bg-white px-5 pl-6 text-left text-base font-bold text-[#0B0B0F] shadow-[0_18px_46px_rgba(0,0,0,.34)]"
                >
                  <span>{activeSlide.button}</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[#FF74C8] text-xl font-black text-[#0B0B0F]">
                    →
                  </motion.span>
                </motion.button>

                <div className="mt-6 flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button key={slide.title} type="button" onClick={() => setActiveIndex(index)} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/16" aria-label={`Ir al paso ${index + 1}`}>
                      <motion.span className="block h-full rounded-full bg-[#FF74C8]" initial={false} animate={{ scaleX: index <= activeIndex ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.42, ease: 'easeOut' }} />
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
