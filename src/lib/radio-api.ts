
/**
 * Radio Browser API Integration
 * Fetches stations from the open Radio-Browser.info project.
 * Features a high-resilience multi-mirror fallback protocol.
 */

const MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://fr1.api.radio-browser.info",
  "https://us1.api.radio-browser.info"
];

/**
 * Attempts to fetch from all mirrors sequentially until success.
 */
async function fetchWithRetry(path: string): Promise<any> {
  let lastError: any = null;

  for (const baseUrl of MIRRORS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const url = `${baseUrl}/json${path}`;
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: { 
          'Accept': 'application/json',
          'Origin': typeof window !== 'undefined' ? window.location.origin : '' 
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data)) return data;
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;
      console.warn(`AuraTune: Mirror node ${baseUrl} unresponsive. Shifting frequency...`);
      continue;
    }
  }

  // Graceful failure for offline/CORS issues instead of hard crash
  if (lastError) {
    console.error("Global Radio network node failure:", lastError?.message || "Connection Interrupted");
  }
  return []; 
}

function normalizeStreamUrl(url: string): string {
  if (!url) return "";
  // Force HTTPS for native APK and browser compatibility
  return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
}

export async function fetchRadioStations(query: string = 'jazz') {
  try {
    const data = await fetchWithRetry(`/stations/byname/${encodeURIComponent(query)}?limit=40&hidebroken=true`);
    if (!data) return [];
    return data.map((s: any) => ({
      id: s.stationuuid,
      name: s.name,
      streamUrl: normalizeStreamUrl(s.url_resolved || s.url),
      logoUrl: s.favicon || `https://picsum.photos/seed/${s.stationuuid}/400/400`,
      genre: s.tags?.split(',')[0] || 'Radio',
      country: s.country,
      stationuuid: s.stationuuid
    })).filter((s: any) => s.streamUrl !== "");
  } catch (error) {
    return [];
  }
}

export async function fetchTrendingStations() {
  try {
    const data = await fetchWithRetry(`/stations/topvote/40?hidebroken=true`);
    if (!data) return [];
    return data.map((s: any) => ({
      id: s.stationuuid,
      name: s.name,
      streamUrl: normalizeStreamUrl(s.url_resolved || s.url),
      logoUrl: s.favicon || `https://picsum.photos/seed/${s.stationuuid}/400/400`,
      genre: s.tags?.split(',')[0] || 'Trending',
      country: s.country,
      stationuuid: s.stationuuid
    })).filter((s: any) => s.streamUrl !== "");
  } catch (error) {
    return [];
  }
}
