import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function logVital({ name, value, rating }: Metric) {
  console.log(`${name} value: ${value}, rating: ${rating}`);
}

export function reportWebVitals() {
  onCLS(logVital);
  onINP(logVital);
  onLCP(logVital);
  onFCP(logVital);
  onTTFB(logVital);
}
