'use client';

import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { scheduleWarmup } from '@/src/utils/warmup';

const CLARITY_PROJECT_ID = 'uc47h0l6ty';

export default function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    let cancelled = false;
    const cancelWarmup = scheduleWarmup(() => {
      void import('@microsoft/clarity').then(({ default: clarity }) => {
        if (!cancelled) clarity.init(CLARITY_PROJECT_ID);
      });
    });
    return () => { cancelled = true; cancelWarmup(); };
  }, []);
  return <SpeedInsights beforeSend={(event) => {
    const url = new URL(event.url);
    if (url.pathname.startsWith('/admin')) return null;
    url.search = '';
    url.hash = '';
    return { ...event, url: url.toString() };
  }} />;
}
