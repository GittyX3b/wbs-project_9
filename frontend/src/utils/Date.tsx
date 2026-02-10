/* Get dayname by given datestring; optional offset to get days in past or future (1 = tommorow) */
export function getDayName(dateString: string, offset = 0): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('de-DE', { weekday: 'short' });
}
