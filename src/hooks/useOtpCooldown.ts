'use client';

import { useCallback, useEffect, useState } from 'react';

/** Prevents rapid repeated OTP requests (reduces 429s during dev and accidental double-clicks). */
export function useOtpCooldown(defaultSeconds = 60) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [remaining]);

  const start = useCallback((seconds = defaultSeconds) => {
    setRemaining(seconds);
  }, [defaultSeconds]);

  return { remaining, start, isCooling: remaining > 0 };
}
