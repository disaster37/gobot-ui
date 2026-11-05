import { expect, test } from '@playwright/test'

function makeJwt(): string {
  const payload = { sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

const boards = {
  data: [
    { id: 'dfp', type: 'boards', attributes: { name: 'DFP board', is_online: true } },
    { id: 'tfp', type: 'boards', attributes: { name: 'TFP board', is_online: true } }
  ]
}

const tfpConfig = {
  data: [
    {
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
        version: 1
      }
    }
  ]
}

const tfpState = {
  data: [
    {
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
        version: 1
      }
    }
  ]
}

const dfpConfig = {
  data: [
    {
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
        version: 1
      }
    }
  ]
}

const dfpState = {
  data: [
    {
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
  ]
}

const tanks = {
  data: [
    { id: '1', type: 'tanks', attributes: { level: 120, volume: 480, percent: 80, distance: 30 } }
  ]
}

const tankConfigs = {
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
    }
  ]
}

const json = (body: unknown) => ({
  status: 200,
  contentType: 'application/vnd.api+json',
  body: JSON.stringify(body)
})

test.describe('dashboard smoke test', () => {
  test('login flow, tfp action and dfp config save', async ({ page }) => {
    const token = makeJwt()
    const actionRequests: string[] = []
    let patchedDfpBody = ''

    await page.route('**/backend/**', async (route) => {
      const request = route.request()
      const path = new URL(request.url()).pathname

      if (path === '/backend/token-auth') {
        const payload = request.postDataJSON() as { password?: string }
        if (payload.password === 'wrong') {
          return route.fulfill({ status: 401, contentType: 'application/json', body: '{}' })
        }
        return route.fulfill(json({ token }))
      }
      if (path.includes('/tfps/action/')) {
        actionRequests.push(path)
        return route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' })
      }
      if (path.endsWith('/boards')) return route.fulfill(json(boards))
      if (path.endsWith('/tfp-configs')) return route.fulfill(json(tfpConfig))
      if (path.endsWith('/tfp-states')) return route.fulfill(json(tfpState))
      if (path.endsWith('/dfp-configs/1') && request.method() === 'PATCH') {
        patchedDfpBody = request.postData() ?? ''
        return route.fulfill(json(dfpConfig))
      }
      if (path.endsWith('/dfp-configs')) return route.fulfill(json(dfpConfig))
      if (path.endsWith('/dfp-states')) return route.fulfill(json(dfpState))
      if (path.endsWith('/tanks')) return route.fulfill(json(tanks))
      if (path.endsWith('/tank-configs')) return route.fulfill(json(tankConfigs))
      return route.fulfill(json({ data: [] }))
    })

    // Scenario 1: unauthenticated visit redirects to /login
    await page.goto('/')
    await page.waitForURL(/\/login$/, { timeout: 60000 })

    // Invalid credentials show the inline error alert
    await page.getByTestId('username').fill('admin')
    await page.getByTestId('password').fill('wrong')
    await page.getByTestId('login-submit').click()
    await expect(page.getByText('Incorrect username or password')).toBeVisible()

    // Valid credentials redirect to home and render the cards
    await page.getByTestId('password').fill('secret')
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText('TFP control')).toBeVisible()
    await expect(page.getByText('DFP control')).toBeVisible()

    // Scenario 2: toggling the pond pump posts an action and refreshes tfp-states
    await page.locator('[data-test="btn-off"]').first().click()
    await expect.poll(() => actionRequests.length).toBeGreaterThan(0)

    // Scenario 3: edit the DFP config and save it
    await page.getByRole('link', { name: 'Config' }).click()
    await expect(page.getByText('DFP config')).toBeVisible()
    await page.getByTestId('dfp-config-edit').click()
    await page.getByTestId('dfp-config-washingDuration').fill('180')
    await page.getByTestId('dfp-config-save').click()
    await expect.poll(() => patchedDfpBody).toContain('washing_duration')
  })
})
