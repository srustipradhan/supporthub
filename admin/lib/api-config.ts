const PRODUCTION_API_URL = 'https://supporthub-th9v.onrender.com';
const LOCAL_API_URL = 'http://localhost:3000';

function resolveBaseUrl(envVar: string | undefined): string {
  if (envVar) return envVar;
  return process.env.NODE_ENV === 'development'
    ? LOCAL_API_URL
    : PRODUCTION_API_URL;
}

export const API_URL = resolveBaseUrl(process.env.NEXT_PUBLIC_API_URL);
export const WS_URL = resolveBaseUrl(process.env.NEXT_PUBLIC_WS_URL);
