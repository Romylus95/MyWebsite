import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Europe/Athens',
          hour:     '2-digit',
          minute:   '2-digit',
          second:   '2-digit',
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--color-text)' }}>
      {time || '--:--:--'}
    </span>
  );
}
