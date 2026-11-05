export interface SessionCredential { token: string; expiresAt: number }
type SessionStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const valid = (value: unknown): value is SessionCredential => {
  const record = value as SessionCredential | null;
  return !!record && typeof record.token === 'string' && /^[a-f0-9]{64}$/.test(record.token) &&
    Number.isSafeInteger(record.expiresAt) && record.expiresAt > 0;
};

export function readCredential(storage: SessionStorage, key: string, now = Date.now()): SessionCredential | null {
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (valid(value) && value.expiresAt > now) return { token: value.token, expiresAt: value.expiresAt };
  } catch { /* Invalid or legacy data is discarded, never used as authentication. */ }
  storage.removeItem(key);
  return null;
}

export function writeCredential(storage: SessionStorage, key: string, value: SessionCredential | null) {
  if (!value) { storage.removeItem(key); return; }
  if (!valid(value) || value.expiresAt <= Date.now()) throw new Error('Invalid session credential');
  // Persist only authentication, never profiles, notes or a password.
  storage.setItem(key, JSON.stringify({ token: value.token, expiresAt: value.expiresAt }));
}
