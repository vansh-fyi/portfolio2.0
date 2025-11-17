import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
function logVital({ name, value, rating }) {
    console.log(`${name} value: ${value}, rating: ${rating}`);
}
export function reportWebVitals() {
    onCLS(logVital);
    onINP(logVital);
    onLCP(logVital);
    onFCP(logVital);
    onTTFB(logVital);
}
