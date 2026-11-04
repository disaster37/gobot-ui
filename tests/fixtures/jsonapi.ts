export const boardsPayload = {
  data: [
    { id: 'dfp', type: 'boards', attributes: { name: 'DFP board', is_online: true } },
    { id: 'tfp', type: 'boards', attributes: { name: 'TFP board', is_online: false } }
  ]
}

export const dfpConfigPayload = {
  data: {
    id: '1',
    type: 'dfp-configs',
    attributes: {
      force_washing_duration: 3600,
      force_washing_duration_when_frozen: 7200,
      temperature_threshold_when_frozen: 2.5,
      wait_time_between_washing: 1800,
      washing_duration: 120,
      start_washing_pump_before_washing: 10,
      wait_time_before_unset_security: 300,
      temperature_sensor_polling: 60,
      updated_at: '2026-01-01T10:00:00Z',
      created_at: '2025-01-01T10:00:00Z',
      version: 3
    }
  }
}

export const dfpStatePayload = {
  data: {
    id: '1',
    type: 'dfp-states',
    attributes: {
      is_washed: false,
      is_running: true,
      is_security: false,
      is_emergency_stopped: false,
      is_disable_security: false,
      last_washing: '2026-01-01T08:00:00Z'
    }
  }
}

export const tfpConfigPayload = {
  data: {
    id: '1',
    type: 'tfp-configs',
    attributes: {
      uvc1_blister_max_time: 8000,
      uvc2_blister_max_time: 8000,
      ozone_blister_max_time: 5000,
      is_waterfall_auto: true,
      start_time_waterfall: '08:00',
      stop_time_waterfall: '20:00',
      mode: 'UVC',
      uvc1_blister_time: '2025-06-01T00:00:00Z',
      uvc2_blister_time: '2025-07-01T00:00:00Z',
      ozone_blister_time: '2025-08-01T00:00:00Z',
      updated_at: '2026-01-01T10:00:00Z',
      created_at: '2025-01-01T10:00:00Z',
      version: 4
    }
  }
}

export const tfpStatePayload = {
  data: {
    id: '1',
    type: 'tfp-states',
    attributes: {
      pond_pump_running: true,
      uvc1_running: true,
      uvc2_running: false,
      waterfall_pump_running: false,
      pond_bubble_running: true,
      filter_bubble_running: false,
      uvc1_blister_nb_hour: 1200,
      uvc2_blister_nb_hour: 900,
      ozone_blister_nb_hour: 500,
      acknoledge_waterfall_auto: true,
      bacterium_time: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T10:00:00Z',
      created_at: '2025-01-01T10:00:00Z',
      version: 2
    }
  }
}

export const tanksPayload = {
  data: [
    {
      id: '1',
      type: 'tanks',
      attributes: { level: 120, volume: 480, percent: 80, distance: 30 }
    },
    {
      id: '2',
      type: 'tanks',
      attributes: { level: 60, volume: 240, percent: 40, distance: 90 }
    }
  ]
}

export const tankConfigsPayload = {
  data: [
    {
      id: '1',
      type: 'tank-configs',
      attributes: {
        updated_at: '2026-01-01T10:00:00Z',
        created_at: '2025-01-01T10:00:00Z',
        version: 1,
        enable: true,
        name: 'Main pond',
        depth: 150,
        sensor_height: 120,
        liter_per_cm: 40
      }
    },
    {
      id: '2',
      type: 'tank-configs',
      attributes: {
        updated_at: '2026-01-01T10:00:00Z',
        created_at: '2025-01-01T10:00:00Z',
        version: 1,
        enable: false,
        name: 'Quarantine',
        depth: 80,
        sensor_height: 60,
        liter_per_cm: 15
      }
    }
  ]
}

export const emptyCollection = { data: [] }
