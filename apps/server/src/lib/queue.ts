import Bull from 'bull';
export type SendJob = { campaignId: string; deliveryId: string };
export const sendQueue = new Bull<SendJob>('xmail-send', process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
  defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 1000, removeOnFail: 2000 }
});
