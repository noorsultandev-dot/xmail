import crypto from 'node:crypto';
const ALGORITHM = 'aes-256-gcm';
function key(): Buffer {
  const raw = process.env.SMTP_ENCRYPTION_KEY ?? '';
  if (!/^[a-f0-9]{64}$/i.test(raw)) throw new Error('SMTP_ENCRYPTION_KEY must be 64 hexadecimal characters.');
  return Buffer.from(raw, 'hex');
}
export function encryptJson(value: unknown): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((x) => x.toString('base64')).join('.');
}
export function decryptJson<T>(payload: string): T {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) throw new Error('Invalid encrypted payload.');
  const decipher = crypto.createDecipheriv(ALGORITHM, key(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf8')) as T;
}
