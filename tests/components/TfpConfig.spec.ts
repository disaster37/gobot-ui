import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import TfpConfig from '~/components/TfpConfig.vue'
import type { TfpConfig as TfpConfigModel } from '~/types/models'

function makeConfig(overrides: Partial<TfpConfigModel> = {}): TfpConfigModel {
  return {
    id: '1',
    UVC1BlisterMaxTime: 8000,
    UVC2BlisterMaxTime: 8000,
    ozoneBlisterMaxTime: 5000,
    isWaterfallAuto: true,
    startTimeWaterfall: '08:00',
    stopTimeWaterfall: '20:00',
    mode: 'UVC',
    UVC1BlisterTime: '2025-06-01T00:00:00Z',
    UVC2BlisterTime: '2025-07-01T00:00:00Z',
    ozoneBlisterTime: '2025-08-01T00:00:00Z',
    updatedAt: null,
    createdAt: null,
    version: 1,
    ...overrides
  }
}

const inputValue = (wrapper: ReturnType<typeof mount>, selector: string) =>
  (wrapper.find(selector).element as HTMLInputElement).value

describe('TfpConfig', () => {
  it('starts in read-only mode', () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    expect(
      wrapper.find('[data-test="tfp-config-UVC1BlisterMaxTime"]').attributes('readonly')
    ).toBeDefined()
    expect(wrapper.find('[data-test="tfp-config-save"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="tfp-config-edit"]').exists()).toBe(true)
  })

  it('formats blister dates as DD/MM/YYYY', () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    expect(inputValue(wrapper, '[data-test="tfp-config-UVC1BlisterTime"]')).toBe('01/06/2025')
    expect(inputValue(wrapper, '[data-test="tfp-config-UVC2BlisterTime"]')).toBe('01/07/2025')
  })

  it('enables editing and saves ISO dates', async () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tfp-config-edit"]').trigger('click')
    expect(
      wrapper.find('[data-test="tfp-config-UVC1BlisterMaxTime"]').attributes('readonly')
    ).toBeUndefined()
    expect(wrapper.find('[data-test="tfp-config-save"]').exists()).toBe(true)

    await wrapper.find('[data-test="tfp-config-UVC1BlisterMaxTime"]').setValue('9000')
    await wrapper.find('[data-test="tfp-config-UVC2BlisterMaxTime"]').setValue('9000')
    await wrapper.find('[data-test="tfp-config-ozoneBlisterMaxTime"]').setValue('6000')
    await wrapper.find('[data-test="tfp-config-mode"]').setValue('ozone')
    await wrapper.find('[data-test="tfp-config-UVC1BlisterTime"]').setValue('15/03/2026')
    await wrapper.find('[data-test="tfp-config-UVC2BlisterTime"]').setValue('16/03/2026')
    await wrapper.find('[data-test="tfp-config-ozoneBlisterTime"]').setValue('17/03/2026')
    await wrapper.find('[data-test="tfp-config-isWaterfallAuto"]').setValue(false)
    await wrapper.find('[data-test="tfp-config-startTimeWaterfall"]').setValue('07:00')
    await wrapper.find('[data-test="tfp-config-stopTimeWaterfall"]').setValue('21:00')
    await wrapper.find('form').trigger('submit')

    const saved = wrapper.emitted('saved')?.[0]?.[0] as TfpConfigModel
    expect(saved.UVC1BlisterTime).toBe(dayjs('2026-03-15').toISOString())
    expect(saved.UVC1BlisterMaxTime).toBe(9000)
    expect(saved.mode).toBe('ozone')
    expect(saved.isWaterfallAuto).toBe(false)
    expect(saved.startTimeWaterfall).toBe('07:00')
  })

  it('rejects invalid dates without emitting saved', async () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tfp-config-edit"]').trigger('click')
    await wrapper.find('[data-test="tfp-config-UVC1BlisterTime"]').setValue('31/31/2026')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('saved')).toBeUndefined()
    expect(wrapper.text()).toContain('Format must be DD/MM/YYYY')
  })

  it('reacts to external prop updates when not editing', async () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    await wrapper.setProps({ config: makeConfig({ UVC1BlisterMaxTime: 9999 }) })
    expect(inputValue(wrapper, '[data-test="tfp-config-UVC1BlisterMaxTime"]')).toBe('9999')
  })

  it('cancels editing without emitting saved', async () => {
    const wrapper = mount(TfpConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tfp-config-edit"]').trigger('click')
    await wrapper.find('[data-test="tfp-config-cancel"]').trigger('click')
    expect(wrapper.find('[data-test="tfp-config-save"]').exists()).toBe(false)
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('renders an empty state without a config', () => {
    const wrapper = mount(TfpConfig, { props: { config: null } })
    expect(wrapper.text()).toContain('No configuration available')
  })
})
