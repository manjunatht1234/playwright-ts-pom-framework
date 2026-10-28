// utils/envHelper.ts
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] ?? defaultValue;
}