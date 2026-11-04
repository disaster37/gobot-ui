import { describe, expect, it } from 'vitest'
import {
  dfpConfigSchema,
  loginSchema,
  tankConfigSchema,
  tfpConfigSchema,
  tfpStateSchema
} from '~/utils/validation'

describe('loginSchema', () => {
  it('accepts non-empty credentials and trims the username', () => {
    const result = loginSchema.parse({ username: '  admin ', password: 'secret' })
    expect(result.username).toBe('admin')
    expect(result.password).toBe('secret')
  })

  it('rejects empty credentials', () => {
    expect(loginSchema.safeParse({ username: '', password: '' }).success).toBe(false)
  })
})

describe('dfpConfigSchema', () => {
  const valid = {
    forceWashingDuration: '3600',
    forceWashingDurationWhenFrozen: '7200',
    temperatureThresholdWhenFrozen: '2.5',
    waitTimeBetweenWashing: '1800',
    washingDuration: '120',
    startWashingPumpBeforeWashing: '10',
    waitTimeBeforeUnsetSecurity: '300',
    temperatureSensorPolling: '60'
  }

  it('coerces numeric strings', () => {
    const result = dfpConfigSchema.parse(valid)
    expect(result.forceWashingDuration).toBe(3600)
    expect(result.temperatureThresholdWhenFrozen).toBe(2.5)
  })

  it('rejects negative durations and out-of-range temperatures', () => {
    expect(dfpConfigSchema.safeParse({ ...valid, forceWashingDuration: -1 }).success).toBe(false)
    expect(dfpConfigSchema.safeParse({ ...valid, washingDuration: 0 }).success).toBe(false)
    expect(
      dfpConfigSchema.safeParse({ ...valid, temperatureThresholdWhenFrozen: 100 }).success
    ).toBe(false)
    expect(dfpConfigSchema.safeParse({ ...valid, washingDuration: 'abc' }).success).toBe(false)
  })
})

describe('tfpConfigSchema', () => {
  const valid = {
    UVC1BlisterMaxTime: '8000',
    UVC2BlisterMaxTime: '8000',
    ozoneBlisterMaxTime: '5000',
    mode: 'UVC',
    UVC1BlisterTimeFormatted: '01/02/2026',
    UVC2BlisterTimeFormatted: '01/03/2026',
    ozoneBlisterTimeFormatted: '01/04/2026',
    isWaterfallAuto: true,
    startTimeWaterfall: '08:00',
    stopTimeWaterfall: '20:00'
  }

  it('accepts a valid payload', () => {
    expect(tfpConfigSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects invalid dates, modes and empty times', () => {
    expect(
      tfpConfigSchema.safeParse({ ...valid, UVC1BlisterTimeFormatted: '31/31/2026' }).success
    ).toBe(false)
    expect(tfpConfigSchema.safeParse({ ...valid, mode: 'plasma' }).success).toBe(false)
    expect(tfpConfigSchema.safeParse({ ...valid, startTimeWaterfall: '  ' }).success).toBe(false)
    expect(tfpConfigSchema.safeParse({ ...valid, UVC1BlisterMaxTime: -5 }).success).toBe(false)
  })
})

describe('tfpStateSchema', () => {
  it('coerces and validates hours', () => {
    const result = tfpStateSchema.parse({
      UVC1BlisterNbHour: '1200',
      UVC2BlisterNbHour: '900',
      ozoneBlisterNbHour: '500'
    })
    expect(result.UVC1BlisterNbHour).toBe(1200)
  })

  it('rejects negative hours', () => {
    expect(
      tfpStateSchema.safeParse({
        UVC1BlisterNbHour: -1,
        UVC2BlisterNbHour: 0,
        ozoneBlisterNbHour: 0
      }).success
    ).toBe(false)
  })
})

describe('tankConfigSchema', () => {
  const valid = { name: 'Main pond', depth: '150', sensorHeight: '120', literPerCm: '40' }

  it('accepts a valid payload', () => {
    const result = tankConfigSchema.parse(valid)
    expect(result.depth).toBe(150)
  })

  it('rejects empty names and non-positive dimensions', () => {
    expect(tankConfigSchema.safeParse({ ...valid, name: '  ' }).success).toBe(false)
    expect(tankConfigSchema.safeParse({ ...valid, depth: 0 }).success).toBe(false)
    expect(tankConfigSchema.safeParse({ ...valid, literPerCm: -1 }).success).toBe(false)
    expect(tankConfigSchema.safeParse({ ...valid, sensorHeight: -1 }).success).toBe(false)
  })
})
