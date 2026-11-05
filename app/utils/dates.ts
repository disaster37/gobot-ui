import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const DD_MM_YYYY = 'DD/MM/YYYY'

export function formatDateDdMmYyyy(isoDate: string | Date | null | undefined): string {
  if (isoDate === null || isoDate === undefined || isoDate === '') return ''
  const date = dayjs(isoDate)
  return date.isValid() ? date.format(DD_MM_YYYY) : ''
}

export function parseDateDdMmYyyy(ddMmYyyy: string): string | null {
  if (!ddMmYyyy) return null
  const date = dayjs(ddMmYyyy, DD_MM_YYYY, true)
  if (!date.isValid()) return null
  if (date.format(DD_MM_YYYY) !== ddMmYyyy) return null
  return date.toISOString()
}

export function isValidDdMmYyyy(ddMmYyyy: string): boolean {
  return parseDateDdMmYyyy(ddMmYyyy) !== null
}

export function getHoursSince(
  isoDate: string | Date | null | undefined,
  now: Date = new Date()
): number {
  if (isoDate === null || isoDate === undefined || isoDate === '') return Number.NaN
  const date = dayjs(isoDate)
  if (!date.isValid()) return Number.NaN
  return dayjs(now).diff(date, 'hours')
}

export function isBlisterOk(
  blisterTimeIso: string | null | undefined,
  maxHours: number,
  now: Date = new Date()
): boolean {
  const nbHours = getHoursSince(blisterTimeIso, now)
  return maxHours > nbHours
}
