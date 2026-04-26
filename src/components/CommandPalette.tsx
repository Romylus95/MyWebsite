import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  id: string;
  label: string;
  category: string;
  icon: string;
  action: () => void;
};

function buildItems(onCopied: () => void): Item[] {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return [
    // ── Navigate ──────────────────────────────────────
    { id: 'about',      category: 'Navigate', icon: '→', label: 'Go to About',      action: () => scrollTo('about')      },
    { id: 'experience', category: 'Navigate', icon: '→', label: 'Go to Experience', action: () => scrollTo('experience') },
    { id: 'skills',     category: 'Navigate', icon: '→', label: 'Go to Skills',     action: () => scrollTo('skills')     },
    { id: 'projects',   category: 'Navigate', icon: '→', label: 'Go to Projects',   action: () => scrollTo('projects')   },
    { id: 'contact',    category: 'Navigate', icon: '→', label: 'Go to Contact',    action: () => scrollTo('contact')    },
    // ── Actions ───────────────────────────────────────
    {
      id: 'github', category: 'External', icon: '↗', label: 'Open GitHub',
      action: () => window.open('https://github.com/Romylus95', '_blank'),
    },
    {
      id: 'linkedin', category: 'External', icon: '↗', label: 'Open LinkedIn',
      action: () => window.open('https://www.linkedin.com/in/dimitris-meliopoulos-00107a168/', '_blank'),
    },
    {
      id: 'cv', category: 'Download', icon: '↓', label: 'Download CV',
      action: () => {
        const a = document.createElement('a');
        a.href = '/cv.pdf';
        a.download = 'Dimitris_Meliopoulos_CV.pdf';
        a.click();
      },
    },
    {
      id: 'email', category: 'Clipboard', icon: '⎘', label: 'Copy Email Address',
      action: () => {
        navigator.clipboard.writeText('dmeliopoulos95@gmail.com');
        onCopied();
      },
    },
    {
      id: 'print', category: 'External', icon: '⎙', label: 'View CV',
      action: () => window.open('/cv.pdf', '_blank'),
    },
    {
      id: 'theme', category: 'Appearance', icon: '◐', label: 'Toggle Dark / Light Mode',
      action: () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { dark: isDark } }));
      },
    },
  ];
}

export default function CommandPalette() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const [copied, setCopied]     = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const listRef                 = useRef<HTMLUListElement>(null);

  const handleCopied = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  const items    = buildItems(handleCopied);
  const filtered = query.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Open / close on Ctrl+K or Cmd+K
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      execute(filtered[selected]);
    }
  }

  function execute(item: Item) {
    item.action();
    if (item.id !== 'email') setOpen(false);
  }

  return (
    <>
      {/* ── Kbd hint shown in nav area (rendered into a portal-like slot) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[16vh] px-4"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Palette panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background:  'var(--color-surface)',
                border:      '1px solid var(--color-border)',
                boxShadow:   '0 25px 60px rgba(0,0,0,0.4)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search row */}
              <div
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     stroke="var(--color-muted)" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                  style={{ color: 'var(--color-text)', caretColor: 'var(--color-accent)' }}
                />
                {copied && (
                  <span className="text-xs font-mono shrink-0" style={{ color: 'var(--color-accent)' }}>
                    Copied!
                  </span>
                )}
                <kbd
                  className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'var(--color-border)', color: 'var(--color-muted)' }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <ul ref={listRef} className="py-1.5 max-h-[300px] overflow-y-auto">
                {filtered.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm font-mono"
                      style={{ color: 'var(--color-muted)' }}>
                    No results for &ldquo;{query}&rdquo;
                  </li>
                )}
                {filtered.map((item, i) => (
                  <li key={item.id}>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                      style={{
                        background: i === selected
                          ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
                          : 'transparent',
                        color: i === selected ? 'var(--color-text)' : 'var(--color-muted)',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => execute(item)}
                    >
                      <span
                        className="font-mono text-sm w-5 shrink-0 text-center"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm flex-1">{item.label}</span>
                      <span
                        className="text-[11px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                        style={{
                          background: 'var(--color-border)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {item.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div
                className="flex items-center gap-5 px-4 py-2.5 text-[11px] font-mono"
                style={{
                  borderTop: '1px solid var(--color-border)',
                  color: 'var(--color-muted)',
                }}
              >
                <span><kbd className="opacity-60">↑↓</kbd> navigate</span>
                <span><kbd className="opacity-60">↵</kbd> select</span>
                <span><kbd className="opacity-60">esc</kbd> close</span>
                <span className="ml-auto opacity-50">ctrl + k</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
