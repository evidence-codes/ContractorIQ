'use client';
import { useState } from 'react';

export function usePreferences<T>(initial: T) {
  const [preferences, setPreferences] = useState(initial);
  return { preferences, setPreferences };
}
