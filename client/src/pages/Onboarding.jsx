import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const colors = {
  orange: '#FD7407',
  yellow: '#F9A809',
  pink: '#FB97B3',
  blue: '#0869D0',
  green: '#04533E',
  cream: '#F2EDEA',
  black: '#111215',
};

const slides = [
  {
    variant: 'arches',
    kicker: 'Sistema 01',
    title: 'Encontrá planes con pulso propio',
    subtitle: 'Una forma más visual de leer tu ciudad, descubrir escenas y moverte con gente cerca.',
    button: 'Continuar',
  },
  {
    variant: 'split',
    kicker: 'Sistema 02',
    title: 'Guardá momentos. Sumate al movimiento',
    subtitle: 'Planes que se cruzan, se guardan y empiezan a moverse cuando alguien dice voy.',
    button: 'Continuar',
  },
  {
    variant: 'stripes',
    kicker: 'Sistema 03',
    title: 'La ciudad cambia cuando sabés dónde caer',
    subtitle: 'Un mapa social para planes urbanos, encuentros espontáneos y lugares con carácter.',
    button: 'Entrar a MOVA',
  },
];

function Logo({ className = '' }) {
  return (
    <p className={`text-[1.7rem] font-black tracking-[-0.035em] text-[#F2EDEA] ${className}`}>
      MOVA<span className="text-[#FD7407]">.</span>
    </p>
  );
}

function PrintTexture() {
  return <div className="pointer-events-none absolute inset-0 z-20 mova-print-texture" />;
}

function TextVeil() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(17,18,21,.04),rgba(17,18,21,.2)_32%,rgba(17,18,21,.72)_66%,#111215_92%)]" />
  );
}

function StackedCirclesPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div
        className="absolute left-0 right-0 top-16 h-[32rem] overflow-visible blur-[0.6px]"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute -left-4 -right-4 -top-10 h-72 rounded-full"
          style={{ background: `radial-gradient(circle at 50% 24%, ${colors.yellow}, ${colors.orange} 48%, ${colors.pink} 82%)` }}
          animate={{ y: [0, 8, 0], scale: [1, 1.025, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-12 -right-12 top-[15.5rem] h-[22rem] rounded-t-full"
          style={{ background: `linear-gradient(180deg, ${colors.green}, ${colors.blue})` }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-8 -right-8 top-[23.5rem] h-[17rem] rounded-t-full bg-[#0869D0]"
          animate={{ y: [0, -5, 0], opacity: [0.82, 0.95, 0.82] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <PrintTexture />
      </motion.div>
      <TextVeil />
    </div>
  );
}

function SplitColumnsPoster() {
  const bars = Array.from({ length: 14 }, (_, index) => index);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div
        className="absolute inset-y-0 left-0 right-0 overflow-visible blur-[0.6px]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute bottom-0 -left-8 top-0 w-[56%] rounded-b-full"
          style={{ background: `linear-gradient(180deg, ${colors.orange}, ${colors.pink} 45%, ${colors.blue})` }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute bottom-0 -right-8 top-0 w-[55%] overflow-hidden bg-[#04533E]">
          <motion.div
            className="absolute left-6 right-6 top-10 aspect-square rounded-full"
            style={{ background: `linear-gradient(180deg, ${colors.orange}, ${colors.yellow})` }}
            animate={{ scale: [1, 1.04, 1], y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute bottom-0 left-3 right-3 top-[11rem] flex items-end justify-between overflow-hidden">
            {bars.map((bar) => (
              <motion.span
                key={bar}
                className="h-full w-[6px]"
                style={{ background: `linear-gradient(180deg, ${colors.pink}, ${colors.orange} 50%, ${colors.blue})` }}
                animate={{ scaleY: [0.92, 1, 0.92], opacity: [0.64, 0.92, 0.64] }}
                transition={{ duration: 6 + bar * 0.07, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
        <PrintTexture />
      </motion.div>
      <TextVeil />
    </div>
  );
}

function ArchesPoster() {
  const arcs = [
    { color: colors.blue, top: 54, size: 470, opacity: 0.9 },
    { color: colors.green, top: 112, size: 430, opacity: 0.78 },
    { color: colors.pink, top: 178, size: 390, opacity: 0.82 },
    { color: colors.orange, top: 252, size: 350, opacity: 0.94 },
    { color: colors.yellow, top: 330, size: 310, opacity: 0.72 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div
        className="absolute left-0 right-0 top-20 h-[30rem] overflow-visible blur-[0.6px]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        {arcs.map((arc, index) => (
          <motion.div
            key={arc.color}
            className="absolute left-1/2 rounded-t-full"
            style={{
              top: arc.top,
              width: arc.size,
              height: arc.size,
              marginLeft: -arc.size / 2,
              background: index === 3 ? `linear-gradient(180deg, ${colors.orange}, ${colors.yellow})` : arc.color,
              opacity: arc.opacity,
            }}
            animate={{ y: [0, index % 2 ? 8 : -8, 0], scale: [1, 1.015, 1] }}
            transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <PrintTexture />
      </motion.div>
      <TextVeil />
    </div>
  );
}

function StripesPoster() {
  const stripes = Array.from({ length: 18 }, (_, index) => index);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div
        className="absolute inset-y-0 left-0 right-0 overflow-visible blur-[0.6px]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,#FD7407,#FB97B3_32%,#0869D0_68%,transparent)] opacity-56 blur-[2px]" />
        <div className="absolute inset-y-0 right-0 flex w-[82%] justify-between px-2">
          {stripes.map((stripe) => (
            <motion.span
              key={stripe}
              className="h-full w-[5px] bg-[#FD7407]"
              animate={{ opacity: [0.36, 0.82, 0.36], scaleY: [1, 0.96, 1] }}
              transition={{ duration: 5.5 + stripe * 0.04, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <motion.div className="absolute -left-5 top-0 h-full w-28 bg-[#FD7407]/70 blur-[1px]" animate={{ x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <PrintTexture />
      </motion.div>
      <TextVeil />
    </div>
  );
}

function AbstractScene({ variant }) {
  return (
    <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
      {variant === 'arches' && <ArchesPoster />}
      {variant === 'split' && <SplitColumnsPoster />}
      {variant === 'stripes' && <StripesPoster />}
    </motion.div>
  );
}

function SplashPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <StackedCirclesPoster />
    </div>
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
    <main className="min-h-screen bg-[#111215] text-[#F2EDEA]">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.section
            key="splash"
            className="relative z-20 mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center overflow-hidden bg-[#111215]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <SplashPoster />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative z-30">
              <Logo className="text-[3.45rem]" />
            </motion.div>
            <div className="absolute bottom-12 z-30 h-[3px] w-44 overflow-hidden bg-[#F2EDEA]/14">
              <motion.div className="h-full bg-[#FD7407]" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
            </div>
          </motion.section>
        ) : (
          <motion.section key="onboarding" className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#111215]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative min-h-screen overflow-hidden">
              <AnimatePresence mode="wait">
                <AbstractScene key={activeSlide.variant} variant={activeSlide.variant} />
              </AnimatePresence>

              <header className="relative z-30 flex items-center justify-between px-6 pt-8">
                <Logo />
                <Link to="/login" className="border border-[#F2EDEA]/24 bg-[#111215]/28 px-4 py-2 text-sm font-semibold text-[#F2EDEA]/78 backdrop-blur-sm transition hover:bg-[#F2EDEA] hover:text-[#111215]">
                  Omitir
                </Link>
              </header>

              <div className="relative z-30 flex min-h-[calc(100vh-6rem)] flex-col justify-end px-6 pb-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.title}
                    initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                    transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="mb-4 inline-flex border border-[#F2EDEA]/18 bg-[#111215]/62 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2EDEA]/70 backdrop-blur-md">
                      {activeSlide.kicker}
                    </p>
                    <h1 className="max-w-[22rem] text-[2.72rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#F2EDEA] drop-shadow-[0_18px_34px_rgba(17,18,21,.86)]">
                      {activeSlide.title}
                    </h1>
                    <p className="mt-5 max-w-[20rem] text-base font-medium leading-[1.5] text-[#F2EDEA]/72 drop-shadow-[0_12px_24px_rgba(17,18,21,.8)]">{activeSlide.subtitle}</p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileTap={{ scale: 0.985 }}
                  className="mt-10 flex h-[3.65rem] w-full items-center justify-between border border-[#F2EDEA]/12 bg-[#F2EDEA] px-5 pl-6 text-left text-base font-bold text-[#111215] shadow-[0_18px_46px_rgba(0,0,0,.28)]"
                >
                  <span>{activeSlide.button}</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="grid h-10 w-10 place-items-center bg-[#FD7407] text-xl font-black text-[#111215]">
                    →
                  </motion.span>
                </motion.button>

                <div className="mt-6 flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button key={slide.title} type="button" onClick={() => setActiveIndex(index)} className="h-1.5 flex-1 overflow-hidden bg-[#F2EDEA]/14" aria-label={`Ir al paso ${index + 1}`}>
                      <motion.span className="block h-full bg-[#FD7407]" initial={false} animate={{ scaleX: index <= activeIndex ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.42, ease: 'easeOut' }} />
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
