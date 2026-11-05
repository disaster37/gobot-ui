import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DfpConfig from '~/components/DfpConfig.vue'
import type { DfpConfig as DfpConfigModel } from '~/types/models'

function makeConfig(overrides: Partial<DfpConfigModel> = {}): DfpConfigModel {
  return {
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
    version: 1,
    ...overrides
  }
}

const inputValue = (wrapper: ReturnType<typeof mount>, selector: string) =>
  (wrapper.find(selector).element as HTMLInputElement).value

describe('DfpConfig', () => {
  it('renders all eight fields read-only', () => {
    const wrapper = mount(DfpConfig, { props: { config: makeConfig() } })
    const fields = [
      'forceWashingDuration',
      'forceWashingDurationWhenFrozen',
      'temperatureThresholdWhenFrozen',
      'waitTimeBetweenWashing',
      'washingDuration',
      'startWashingPumpBeforeWashing',
      'waitTimeBeforeUnsetSecurity',
      'temperatureSensorPolling'
    ]
    for (const field of fields) {
      const input = wrapper.find(`[data-test="dfp-config-${field}"]`)
      expect(input.exists()).toBe(true)
      expect(input.attributes('readonly')).toBeDefined()
    }
  })

  it('enables editing and saves coerced numbers', async () => {
    const wrapper = mount(DfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="dfp-config-edit"]').trigger('click')
    expect(
      wrapper.find('[data-test="dfp-config-washingDuration"]').attributes('readonly')
    ).toBeUndefined()

    await wrapper.find('[data-test="dfp-config-washingDuration"]').setValue('180')
    await wrapper.find('form').trigger('submit')

    const saved = wrapper.emitted('saved')?.[0]?.[0] as DfpConfigModel
    expect(saved.washingDuration).toBe(180)
    expect(typeof saved.washingDuration).toBe('number')
  })

  it('rejects invalid numbers without emitting saved', async () => {
    const wrapper = mount(DfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="dfp-config-edit"]').trigger('click')
    await wrapper.find('[data-test="dfp-config-washingDuration"]').setValue('-10')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('saved')).toBeUndefined()
    expect(wrapper.text()).toContain('Must be >= 1 second')
  })

  it('reacts to external config updates', async () => {
    const wrapper = mount(DfpConfig, { props: { config: makeConfig() } })
    await wrapper.setProps({ config: makeConfig({ washingDuration: 55 }) })
    expect(inputValue(wrapper, '[data-test="dfp-config-washingDuration"]')).toBe('55')
  })

  it('renders an empty state without a config', () => {
    const wrapper = mount(DfpConfig, { props: { config: null } })
    expect(wrapper.text()).toContain('No configuration available')
  })

  it('cancels editing and restores the original values', async () => {
    const wrapper = mount(DfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="dfp-config-edit"]').trigger('click')
    await wrapper.find('[data-test="dfp-config-washingDuration"]').setValue('999')
    await wrapper.find('[data-test="dfp-config-cancel"]').trigger('click')
    expect(inputValue(wrapper, '[data-test="dfp-config-washingDuration"]')).toBe('120')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
