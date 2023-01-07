import { type Metric, getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  // @ts-ignore
  return navigator?.connection?.effectiveType ?? '';
}

function sendToAnalytics(metric: Metric, options: Record<string, any>) {
  const body = {
    dsn: options.analyticsId,
    id: metric.id,
    page: location.pathname,
    href: location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: blob,
      credentials: 'omit',
      keepalive: true,
      method: 'POST',
    }).catch(console.error);
  }
}

export function webVitals(options: Record<string, any>) {
  try {
    getFID((metric) => sendToAnalytics(metric, options));
    getTTFB((metric) => sendToAnalytics(metric, options));
    getLCP((metric) => sendToAnalytics(metric, options));
    getCLS((metric) => sendToAnalytics(metric, options));
    getFCP((metric) => sendToAnalytics(metric, options));
  } catch (e) {
    console.error(e);
  }
}
