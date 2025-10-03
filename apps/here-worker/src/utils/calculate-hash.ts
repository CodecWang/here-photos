import crypto from 'crypto';

export async function calculateHash(buffer: Buffer, algorithm = 'md5') {
  return crypto.createHash(algorithm).update(buffer).digest('hex');
}
