
/**
 * Audius API Integration
 * Fetches trending and searchable tracks from the Audius decentralized network.
 */

const AUDIUS_API_ENDPOINT = "https://api.audius.co";

export async function fetchTrendingAudiusTracks() {
  try {
    const response = await fetch(`${AUDIUS_API_ENDPOINT}/v1/tracks/trending?app_name=AURATUNE`);
    if (!response.ok) throw new Error("Audius API failed");
    const data = await response.json();
    return data.data.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.user.name,
      genre: track.genre || "Audius",
      duration: formatDuration(track.duration),
      coverUrl: track.artwork?.["480x480"] || `https://picsum.photos/seed/${track.id}/400/400`,
      audioUrl: `${AUDIUS_API_ENDPOINT}/v1/tracks/${track.id}/stream?app_name=AURATUNE`,
      source: 'audius'
    }));
  } catch (error) {
    console.error("Error fetching Audius tracks:", error);
    return [];
  }
}

export async function searchAudiusTracks(query: string) {
  try {
    const response = await fetch(`${AUDIUS_API_ENDPOINT}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=AURATUNE`);
    if (!response.ok) throw new Error("Audius Search failed");
    const data = await response.json();
    return data.data.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.user.name,
      genre: track.genre || "Audius",
      duration: formatDuration(track.duration),
      coverUrl: track.artwork?.["480x480"] || `https://picsum.photos/seed/${track.id}/400/400`,
      audioUrl: `${AUDIUS_API_ENDPOINT}/v1/tracks/${track.id}/stream?app_name=AURATUNE`,
      source: 'audius'
    }));
  } catch (error) {
    console.error("Error searching Audius:", error);
    return [];
  }
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
