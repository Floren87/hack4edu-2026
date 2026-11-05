const baseUrl = import.meta.env?.BASE_URL ?? './';
export const logoUrl = `${baseUrl}icon-192.png`;
const originalLogoUrl = `${baseUrl}koramap-logo.jpeg`;

/** Embed the approved image in downloaded reports so they have no remote image dependency. */
export async function loadReportLogo(): Promise<string | undefined> {
  try {
    const response = await fetch(originalLogoUrl, { credentials: 'omit' });
    if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== 'image/jpeg') return;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length) return;
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch { return; } // An unavailable logo must not prevent exporting educational results.
}
