export function extractYouTubeID(url: string): string | null {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}