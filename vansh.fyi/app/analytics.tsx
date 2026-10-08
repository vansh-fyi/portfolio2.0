'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'uc47h0l6ty';

export default function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') clarity.init(CLARITY_PROJECT_ID);
  }, []);

  useReportWebVitals(({ name, value, rating }) => {
    console.log(`${name} value: ${value}, rating: ${rating}`);
  });

  return null;
}
