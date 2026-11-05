// Exact browser origins. No paths, wildcards or implicit preview-domain trust.
export function validateOrigins(origins: string[], production = false): string[] {
  if (!origins.length) throw new Error('Configura ALLOWED_ORIGINS con al menos un origen');
  return [...new Set(origins.map(origin => {
    let url: URL;
    try { url = new URL(origin); } catch { throw new Error('Origen no válido en ALLOWED_ORIGINS'); }
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (origin.includes('*') || url.origin !== origin || !['http:', 'https:'].includes(url.protocol) ||
        (production && url.protocol !== 'https:' && !loopback)) {
      throw new Error('ALLOWED_ORIGINS requiere orígenes exactos sin / final; HTTPS salvo localhost');
    }
    return origin;
  }))];
}

export function readOrigins(env: NodeJS.ProcessEnv): string[] {
  // Keep existing local .env files working; ALLOWED_ORIGINS takes precedence.
  const configured = env.ALLOWED_ORIGINS ?? env.APP_ORIGIN;
  const production = env.NODE_ENV === 'production';
  if (configured === undefined && production) throw new Error('Falta ALLOWED_ORIGINS');
  return validateOrigins((configured ?? 'http://localhost:3000').split(',').map(value => value.trim()), production);
}
