import { useState, useEffect, useRef } from 'react';

const ROLES = [
  '.NET Software Engineer',
  'Backend Developer',
  'Problem Solver',
];

export default function TypedText() {
  const [text, setText]       = useState(ROLES[0]);
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible]   = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Only start animating once the element is in the viewport
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.5 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const current = ROLES[roleIdx];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
      return;
    }

    const speed = deleting ? 35 : 75;
    const t = setTimeout(() => {
      setText(
        deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1),
      );
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx, visible]);

  return (
    <span ref={ref}>
      {text}
      <span
        className="inline-block w-[2px] h-[0.85em] bg-[var(--color-accent)] ml-[2px] align-middle animate-blink"
        aria-hidden="true"
      />
    </span>
  );
}
