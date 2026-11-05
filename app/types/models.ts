export interface Board {
  id: string
  name: string
  isOnline: boolean // JSON:API attr: is_online
}

export interface DfpConfig {
  id: string
  forceWashingDuration: number // force_washing_duration
  forceWashingDurationWhenFrozen: number // force_washing_duration_when_frozen
  temperatureThresholdWhenFrozen: number // temperature_threshold_when_frozen
  waitTimeBetweenWashing: number // wait_time_between_washing
  washingDuration: number // washing_duration
  startWashingPumpBeforeWashing: number // start_washing_pump_before_washing
  waitTimeBeforeUnsetSecurity: number // wait_time_before_unset_security
  temperatureSensorPolling: number // temperature_sensor_polling
  updatedAt: string | null // updated_at (ISO-8601 date string)
  createdAt: string | null // created_at (ISO-8601 date string)
  version: number // version
}

export interface DfpState {
  id: string
  isWashed: boolean // is_washed
  isRunning: boolean // is_running
  isSecurity: boolean // is_security
  isEmergencyStopped: boolean // is_emergency_stopped
  isDisableSecurity: boolean // is_disable_security
  lastWashing: string | null // last_washing (ISO-8601 date string)
}

export type TfpMode = 'UVC' | 'ozone' | 'none'

export interface TfpConfig {
  id: string
  UVC1BlisterMaxTime: number // uvc1_blister_max_time
  UVC2BlisterMaxTime: number // uvc2_blister_max_time
  ozoneBlisterMaxTime: number // ozone_blister_max_time
  isWaterfallAuto: boolean // is_waterfall_auto
  startTimeWaterfall: string // start_time_waterfall
  stopTimeWaterfall: string // stop_time_waterfall
  mode: TfpMode // mode
  UVC1BlisterTime: string | null // uvc1_blister_time (ISO-8601 date string)
  UVC2BlisterTime: string | null // uvc2_blister_time (ISO-8601 date string)
  ozoneBlisterTime: string | null // ozone_blister_time (ISO-8601 date string)
  updatedAt: string | null // updated_at
  createdAt: string | null // created_at
  version: number // version
}

export interface TfpState {
  id: string
  pondPumpRunning: boolean // pond_pump_running
  UVC1Running: boolean // uvc1_running
  UVC2Running: boolean // uvc2_running
  waterfallPumpRunning: boolean // waterfall_pump_running
  pondBubbleRunning: boolean // pond_bubble_running
  filterBubbleRunning: boolean // filter_bubble_running
  UVC1BlisterNbHour: number // uvc1_blister_nb_hour
  UVC2BlisterNbHour: number // uvc2_blister_nb_hour
  ozoneBlisterNbHour: number // ozone_blister_nb_hour
  acknoledgeWaterfallAuto: boolean // acknoledge_waterfall_auto (preserve spelling!)
  BacteriumTime: string | null // bacterium_time
  updatedAt: string | null // updated_at
  createdAt: string | null // created_at
  version: number // version
}

export interface TankState {
  id: string
  level: number // level
  volume: number // volume
  percent: number // percent
  distance: number // distance
}

export interface TankConfig {
  id: string
  updatedAt: string | null // updated_at
  createdAt: string | null // created_at
  version: number // version
  enable: boolean // enable
  name: string // name
  depth: number // depth
  sensorHeight: number // sensor_height
  literPerCm: number // liter_per_cm
}

export type TfpActionName =
  | 'startPondPump'
  | 'stopPondPump'
  | 'startUVC1'
  | 'stopUVC1'
  | 'startUVC2'
  | 'stopUVC2'
  | 'startPondBubble'
  | 'stopPondBubble'
  | 'startFilterBubble'
  | 'stopFilterBubble'
  | 'startWaterfallPump'
  | 'stopWaterfallPump'
  | 'changeUVC1Blister'
  | 'changeUVC2Blister'
  | 'changeOzoneBlister'
