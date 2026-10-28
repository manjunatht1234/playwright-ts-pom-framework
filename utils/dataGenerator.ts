/**
 * Generates a unique email address with a timestamp to prevent duplicate registration collisions.
 */
export function generateRandomEmail(prefix: string = 'test', domain: string = 'example.com'): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${randomSuffix}@${domain}`;
}