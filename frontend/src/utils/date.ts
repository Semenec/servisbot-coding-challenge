export function parseDate(
  value: string | number | Date | null | undefined,
): Date | null {
  if (value === null || value === undefined) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value: string | number | Date | null | undefined,
): string {
  const date = parseDate(value);
  return date ? date.toLocaleString() : 'Invalid date';
}
