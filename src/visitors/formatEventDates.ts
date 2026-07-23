export function formatEventDates(
  startDate?: string | null,
  endDate?: string | null,
): string {
  const start = startDate?.trim()
  const end = endDate?.trim()
  if (!start && !end) return ''
  if (start && end && start !== end) return `${start} – ${end}`
  return start || end || ''
}
