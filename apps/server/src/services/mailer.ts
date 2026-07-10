import nodemailer from 'nodemailer';
import { decryptJson } from '../lib/crypto.js';
export type SmtpConfig = { host: string; port: number; secure: boolean; user: string; password: string };
export function transporterFromEncrypted(encrypted: string) {
  const cfg = decryptJson<SmtpConfig>(encrypted);
  return nodemailer.createTransport({ host: cfg.host, port: cfg.port, secure: cfg.secure, auth: { user: cfg.user, pass: cfg.password }, pool: true, maxConnections: 3 });
}
export function merge(template: string, values: Record<string, unknown>) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => String(values[key] ?? ''));
}
export function addTracking(html: string, baseUrl: string, deliveryId: string) {
  const rewritten = html.replace(/href=["'](https?:\/\/[^"']+)["']/gi, (_m, url) => `href="${baseUrl}/track/click/${deliveryId}?url=${encodeURIComponent(url)}"`);
  return `${rewritten}<img src="${baseUrl}/track/open/${deliveryId}.gif" width="1" height="1" alt="" style="display:none" />`;
}
