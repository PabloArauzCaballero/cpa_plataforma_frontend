export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '',
};

export function assertEnv() {
  if (!env.apiBaseUrl) {
    throw new Error('Missing environment variable: VITE_API_BASE_URL');
  }
}
