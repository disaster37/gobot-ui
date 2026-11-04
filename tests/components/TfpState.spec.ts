import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TfpState from '~/components/TfpState.vue'
import type { TfpState as TfpStateModel } from '~/types/models'

function makeState(overrides: Partial<TfpStateModel> = {}): TfpStateModel {
  return {
    id: '1',
    pondPumpRunning: true,
    UVC1Running: true,
    UVC2Running: false,
    waterfallPumpRunning: false,
    pondBubbleRunning: true,
    filterBubbleRunning: false,
    UVC1BlisterNbHour: 1200,
    UVC2BlisterNbHour: 900,
    ozoneBlisterNbHour: 500,
    acknoledgeWaterfallAuto: true,
    BacteriumTime: null,
    updatedAt: null,
    createdAt: null,
    version: 1,
    ...overrides
  }
}

const inputValue = (wrapper: ReturnType<typeof mount>, selector: string) =>
  (wrapper.find(selector).element as HTMLInputElement).value

describe('TfpState', () => {
  it('renders the blister hours', () => {
    const wrapper = mount(TfpState, { props: { state: makeState() } })
    expect(inputValue(wrapper, '[data-test="tfp-state-UVC1BlisterNbHour"]')).toBe('1200')
    expect(inputValue(wrapper, '[data-test="tfp-state-UVC2BlisterNbHour"]')).toBe('900')
    expect(inputValue(wrapper, '[data-test="tfp-state-ozoneBlisterNbHour"]')).toBe('500')
  })

  it('toggles edit mode', async () => {
    const wrapper = mount(TfpState, { props: { state: makeState() } })
    expect(wrapper.find('[data-test="tfp-state-save"]').exists()).toBe(false)
    await wrapper.find('[data-test="tfp-state-edit"]').trigger('click')
    expect(wrapper.find('[data-test="tfp-state-save"]').exists()).toBe(true)
  })

  it('validates numeric hours and saves', async () => {
    const wrapper = mount(TfpState, { props: { state: makeState() } })
    await wrapper.find('[data-test="tfp-state-edit"]').trigger('click')

    await wrapper.find('[data-test="tfp-state-ozoneBlisterNbHour"]').setValue('-5')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('saved')).toBeUndefined()

    await wrapper.find('[data-test="tfp-state-ozoneBlisterNbHour"]').setValue('750')
    await wrapper.find('form').trigger('submit')
    const saved = wrapper.emitted('saved')?.[0]?.[0] as TfpStateModel
    expect(saved.ozoneBlisterNbHour).toBe(750)
  })

  it('renders an empty state without a state record', () => {
    const wrapper = mount(TfpState, { props: { state: null } })
    expect(wrapper.text()).toContain('No configuration available')
  })

  it('cancels editing and restores the original values', async () => {
    const wrapper = mount(TfpState, { props: { state: makeState() } })
    await wrapper.find('[data-test="tfp-state-edit"]').trigger('click')
    await wrapper.find('[data-test="tfp-state-UVC1BlisterNbHour"]').setValue('42')
    await wrapper.find('[data-test="tfp-state-cancel"]').trigger('click')
    expect(inputValue(wrapper, '[data-test="tfp-state-UVC1BlisterNbHour"]')).toBe('1200')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
