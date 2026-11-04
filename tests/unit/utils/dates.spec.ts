import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import {
  formatDateDdMmYyyy,
  getHoursSince,
  isBlisterOk,
  isValidDdMmYyyy,
  parseDateDdMmYyyy
} from '~/utils/dates'

describe('formatDateDdMmYyyy', () => {
  it('formats ISO dates as DD/MM/YYYY', () => {
    expect(formatDateDdMmYyyy('2026-02-01T12:00:00Z')).toBe('01/02/2026')
  })

  it('handles null, undefined and empty values', () => {
    expect(formatDateDdMmYyyy(null)).toBe('')
    expect(formatDateDdMmYyyy(undefined)).toBe('')
    expect(formatDateDdMmYyyy('')).toBe('')
    expect(formatDateDdMmYyyy('not-a-date')).toBe('')
  })
})

describe('parseDateDdMmYyyy', () => {
  it('parses valid DD/MM/YYYY strings to ISO dates', () => {
    const result = parseDateDdMmYyyy('01/02/2026')
    expect(result).not.toBeNull()
    expect(dayjs(result as string).format('DD/MM/YYYY')).toBe('01/02/2026')
  })

  it('rejects malformed dates', () => {
    expect(parseDateDdMmYyyy('32/01/2026')).toBeNull()
    expect(parseDateDdMmYyyy('2026-01-01')).toBeNull()
    expect(parseDateDdMmYyyy('abc')).toBeNull()
    expect(parseDateDdMmYyyy('')).toBeNull()
  })

  it('validates using isValidDdMmYyyy', () => {
    expect(isValidDdMmYyyy('01/02/2026')).toBe(true)
    expect(isValidDdMmYyyy('99/99/2026')).toBe(false)
  })
})

describe('getHoursSince', () => {
  it('returns the elapsed hours', () => {
    expect(getHoursSince('2026-01-01T00:00:00Z', new Date('2026-01-01T05:00:00Z'))).toBe(5)
  })

  it('returns NaN for invalid input', () => {
    expect(Number.isNaN(getHoursSince(null))).toBe(true)
    expect(Number.isNaN(getHoursSince('nope'))).toBe(true)
  })
})

describe('isBlisterOk', () => {
  const now = new Date('2026-01-01T05:00:00Z')

  it('returns true when elapsed hours are below the maximum', () => {
    expect(isBlisterOk('2026-01-01T00:00:00Z', 10, now)).toBe(true)
  })

  it('returns false when elapsed hours reach the maximum', () => {
    expect(isBlisterOk('2026-01-01T00:00:00Z', 3, now)).toBe(false)
  })

  it('returns false for invalid or missing dates', () => {
    expect(isBlisterOk(null, 10, now)).toBe(false)
    expect(isBlisterOk('not-a-date', 10, now)).toBe(false)
  })
})
