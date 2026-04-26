import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));

    // Stay in sync when the command palette (or anything else) changes the theme
    function onThemeChange(e: Event) {
      setDark((e as CustomEvent<{ dark: boolean }>).detail.dark);
    }
    window.addEventListener('theme-change', onThemeChange);
    return () => window.removeEventListener('theme-change', onThemeChange);
  }, []);

  function toggle() {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { dark: isDark } }));
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-border)] transition-colors duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <motion.svg
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1"  x2="12" y2="3"  />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1"  y1="12" x2="3"  y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,  opacity: 1, scale: 1   }}
            exit={{    rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
