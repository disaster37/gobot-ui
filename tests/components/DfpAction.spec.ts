import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DfpAction from '~/components/DfpAction.vue'
import type { DfpConfig, DfpState } from '~/types/models'

const config: DfpConfig = {
  id: '1',
  forceWashingDuration: 3600,
  forceWashingDurationWhenFrozen: 7200,
  temperatureThresholdWhenFrozen: 2.5,
  waitTimeBetweenWashing: 1800,
  washingDuration: 120,
  startWashingPumpBeforeWashing: 10,
  waitTimeBeforeUnsetSecurity: 300,
  temperatureSensorPolling: 60,
  updatedAt: null,
  createdAt: null,
  version: 1
}

const state: DfpState = {
  id: '1',
  isWashed: false,
  isRunning: true,
  isSecurity: false,
  isEmergencyStopped: false,
  isDisableSecurity: false,
  lastWashing: '2026-02-01T08:00:00Z'
}

describe('DfpAction', () => {
  it('renders every control row', () => {
    const wrapper = mount(DfpAction, { props: { config } })
    expect(wrapper.text()).toContain('Auto')
    expect(wrapper.text()).toContain('Stop')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Last washing')
    expect(wrapper.text()).toContain('Average washing time')
    expect(wrapper.text()).toContain('Watter used')
  })

  it('falls back to the placeholder last washing value', () => {
    const wrapper = mount(DfpAction, { props: { config } })
    expect(wrapper.find('[data-test="dfp-last-washing"]').text()).toBe('2020-01-01 10:00:00')
  })

  it('formats the last washing date when state is present', () => {
    const wrapper = mount(DfpAction, { props: { config, state } })
    expect(wrapper.find('[data-test="dfp-last-washing"]').text()).toBe('01/02/2026')
    expect(wrapper.find('[data-icon="i-bi-arrow-repeat"]').exists()).toBe(true)
  })

  it('shows the API error', () => {
    const wrapper = mount(DfpAction, { props: { config, error: 'dfp failed' } })
    expect(wrapper.find('[data-test="dfp-error"]').text()).toBe('dfp failed')
  })

  it('emits refresh on control change', async () => {
    const wrapper = mount(DfpAction, { props: { config } })
    for (const button of wrapper.findAll('[data-test="btn-on"]')) {
      await button.trigger('click')
    }
    expect(wrapper.emitted('refresh')).toHaveLength(2)
  })
})
