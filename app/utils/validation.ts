import { z } from 'zod'
import { isValidDdMmYyyy } from '~/utils/dates'

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export const dfpConfigSchema = z.object({
  forceWashingDuration: z.coerce.number().int().min(0, 'Must be >= 0 seconds').max(604800),
  forceWashingDurationWhenFrozen: z.coerce
    .number()
    .int()
    .min(0, 'Must be >= 0 seconds')
    .max(604800),
  temperatureThresholdWhenFrozen: z.coerce.number().min(-50, 'Min -50°C').max(50, 'Max 50°C'),
  waitTimeBetweenWashing: z.coerce.number().int().min(0, 'Must be >= 0 seconds').max(86400),
  washingDuration: z.coerce.number().int().min(1, 'Must be >= 1 second').max(3600),
  startWashingPumpBeforeWashing: z.coerce.number().int().min(0, 'Must be >= 0 seconds').max(600),
  waitTimeBeforeUnsetSecurity: z.coerce.number().int().min(0, 'Must be >= 0 seconds').max(86400),
  temperatureSensorPolling: z.coerce.number().int().min(1, 'Must be >= 1 second').max(86400)
})

export const tfpConfigSchema = z.object({
  UVC1BlisterMaxTime: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000),
  UVC2BlisterMaxTime: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000),
  ozoneBlisterMaxTime: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000),
  mode: z.enum(['UVC', 'ozone', 'none']),
  UVC1BlisterTimeFormatted: z.string().refine(isValidDdMmYyyy, 'Format must be DD/MM/YYYY'),
  UVC2BlisterTimeFormatted: z.string().refine(isValidDdMmYyyy, 'Format must be DD/MM/YYYY'),
  ozoneBlisterTimeFormatted: z.string().refine(isValidDdMmYyyy, 'Format must be DD/MM/YYYY'),
  isWaterfallAuto: z.boolean(),
  startTimeWaterfall: z.string().trim().min(1, 'Start time is required'),
  stopTimeWaterfall: z.string().trim().min(1, 'Stop time is required')
})

export const tfpStateSchema = z.object({
  UVC1BlisterNbHour: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000),
  UVC2BlisterNbHour: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000),
  ozoneBlisterNbHour: z.coerce.number().int().min(0, 'Must be >= 0 hours').max(100000)
})

export const tankConfigSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  depth: z.coerce.number().positive('Depth must be > 0 cm').max(10000),
  sensorHeight: z.coerce.number().min(0, 'Sensor height must be >= 0 cm').max(10000),
  literPerCm: z.coerce.number().positive('Liter per cm must be > 0').max(100000)
})

export type LoginInput = z.infer<typeof loginSchema>
export type DfpConfigInput = z.infer<typeof dfpConfigSchema>
export type TfpConfigInput = z.infer<typeof tfpConfigSchema>
export type TfpStateInput = z.infer<typeof tfpStateSchema>
export type TankConfigInput = z.infer<typeof tankConfigSchema>
