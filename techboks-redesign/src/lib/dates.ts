/** "2026-09-26" → "26. september 2026". Same output on server and client. */
export function formatDanishDate(isoDate: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
