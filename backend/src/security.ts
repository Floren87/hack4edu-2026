import { randomBytes, scrypt, createHash, timingSafeEqual } from 'node:crypto';
export const token = () => randomBytes(32).toString('hex');
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
// Cookies and query-string tokens are intentionally ignored.
export function bearerToken(header: string | undefined): string | undefined {
  return header?.match(/^Bearer ([a-f0-9]{64})$/i)?.[1];
}
const keyFor = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => {
  scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key));
});
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${(await keyFor(password, salt)).toString('hex')}`;
}
export async function verifyPassword(password: string, encoded: string) {
  const [salt, stored] = encoded.split(':');
  const key = await keyFor(password, salt!);
  const expected = Buffer.from(stored!, 'hex');
  return expected.length === key.length && timingSafeEqual(key, expected);
}
