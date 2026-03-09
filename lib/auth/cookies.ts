export function getClientAccessToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}
