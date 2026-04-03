import { motion } from 'framer-motion';

export default function Hero({ heroTitle, heroSubtitle, ctaText, onAction }) {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-black via-yellow-900 to-black">
      <div className="max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-yellow-300"
        >
          {heroTitle || 'ProjectReady4U'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-lg md:text-xl text-yellow-100"
        >
          {heroSubtitle || 'Sign up and we will help kickstart your journey.'}
        </motion.p>

        <motion.button
          onClick={onAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500 hover:bg-yellow-400 font-semibold text-black shadow-lg"
        >
          {ctaText || 'Register Your Interest'}
          <span aria-hidden="true">↓</span>
        </motion.button>
      </div>
    </section>
  );
}
