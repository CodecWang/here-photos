export function makeParams(obj?: Record<string, any>) {
  if (!obj) return '';
  return new URLSearchParams(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  ).toString();
}
