import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TfpAction from '~/components/TfpAction.vue'
import type { TfpConfig, TfpState } from '~/types/models'

function makeConfig(overrides: Partial<TfpConfig> = {}): TfpConfig {
  return {
    id: '1',
    UVC1BlisterMaxTime: 100000,
    UVC2BlisterMaxTime: 100000,
    ozoneBlisterMaxTime: 100000,
    isWaterfallAuto: true,
    startTimeWaterfall: '08:00',
    stopTimeWaterfall: '20:00',
    mode: 'UVC',
    UVC1BlisterTime: new Date().toISOString(),
    UVC2BlisterTime: new Date().toISOString(),
    ozoneBlisterTime: new Date().toISOString(),
    updatedAt: null,
    createdAt: null,
    version: 1,
    ...overrides
  }
}

function makeState(overrides: Partial<TfpState> = {}): TfpState {
  return {
    id: '1',
    pondPumpRunning: true,
    UVC1Running: true,
    UVC2Running: false,
    waterfallPumpRunning: false,
    pondBubbleRunning: true,
    filterBubbleRunning: false,
    UVC1BlisterNbHour: 100,
    UVC2BlisterNbHour: 200,
    ozoneBlisterNbHour: 300,
    acknoledgeWaterfallAuto: true,
    BacteriumTime: null,
    updatedAt: null,
    createdAt: null,
    version: 1,
    ...overrides
  }
}

describe('TfpAction', () => {
  it('renders all controls in UVC mode', () => {
    const wrapper = mount(TfpAction, { props: { config: makeConfig(), state: makeState() } })
    expect(wrapper.findAll('[role="group"]')).toHaveLength(6)
    expect(wrapper.text()).toContain('Pond pump')
    expect(wrapper.text()).toContain('Pond bubble')
    expect(wrapper.text()).toContain('Filter bubble')
    expect(wrapper.text()).toContain('Waterfall pump')
    expect(wrapper.find('[data-test="uvc2-control"]').text()).toBe('UVC2')
  })

  it('renames UVC2 to Ozone in ozone mode', () => {
    const wrapper = mount(TfpAction, {
      props: { config: makeConfig({ mode: 'ozone' }), state: makeState() }
    })
    expect(wrapper.find('[data-test="uvc2-control"]').text()).toBe('Ozone')
  })

  it('hides UVC controls when mode is none', () => {
    const wrapper = mount(TfpAction, {
      props: { config: makeConfig({ mode: 'none' }), state: makeState() }
    })
    expect(wrapper.find('[data-test="uvc1-control"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="uvc2-control"]').exists()).toBe(false)
    expect(wrapper.findAll('[role="group"]')).toHaveLength(4)
  })

  it('renders the waterfall alarm icon based on acknowledgement', () => {
    const ack = mount(TfpAction, {
      props: { config: makeConfig(), state: makeState({ acknoledgeWaterfallAuto: true }) }
    })
    expect(ack.find('[data-icon="i-bi-alarm-fill"]').exists()).toBe(true)

    const pending = mount(TfpAction, {
      props: { config: makeConfig(), state: makeState({ acknoledgeWaterfallAuto: false }) }
    })
    expect(pending.find('[data-icon="i-bi-alarm"]').exists()).toBe(true)
  })

  it('emits action when a renewed button is clicked', async () => {
    const wrapper = mount(TfpAction, { props: { config: makeConfig(), state: makeState() } })
    await wrapper.find('[data-test="renewed-uvc1"]').trigger('click')
    await wrapper.find('[data-test="renewed-uvc2"]').trigger('click')
    await wrapper.find('[data-test="renewed-ozone"]').trigger('click')
    expect(wrapper.emitted('action')).toEqual([
      ['changeUVC1Blister'],
      ['changeUVC2Blister'],
      ['changeOzoneBlister']
    ])
  })

  it('emits action for on/off toggles', async () => {
    const wrapper = mount(TfpAction, { props: { config: makeConfig(), state: makeState() } })
    await wrapper.findAll('[data-test="btn-off"]')[0]!.trigger('click')
    expect(wrapper.emitted('action')?.[0]).toEqual(['stopPondPump'])
  })

  it('handles toggles for every control', async () => {
    const wrapper = mount(TfpAction, { props: { config: makeConfig(), state: makeState() } })
    for (const button of wrapper.findAll('[data-test="btn-off"]')) {
      await button.trigger('click')
    }
    expect(wrapper.emitted('action')).toHaveLength(6)
  })

  it('renders an empty state when config or state is missing', () => {
    const wrapper = mount(TfpAction, { props: { config: null, state: null } })
    expect(wrapper.text()).toContain('No configuration available')
  })

  it('renders the error message', () => {
    const wrapper = mount(TfpAction, {
      props: { config: makeConfig(), state: makeState(), error: 'boom' }
    })
    expect(wrapper.text()).toContain('boom')
  })
})
