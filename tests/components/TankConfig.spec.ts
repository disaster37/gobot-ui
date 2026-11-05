import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TankConfig from '~/components/TankConfig.vue'
import type { TankConfig as TankConfigModel } from '~/types/models'

function makeConfig(overrides: Partial<TankConfigModel> = {}): TankConfigModel {
  return {
    id: '1',
    updatedAt: null,
    createdAt: null,
    version: 1,
    enable: true,
    name: 'Main pond',
    depth: 150,
    sensorHeight: 120,
    literPerCm: 40,
    ...overrides
  }
}

const inputValue = (wrapper: ReturnType<typeof mount>, selector: string) =>
  (wrapper.find(selector).element as HTMLInputElement).value

describe('TankConfig', () => {
  it('renders the config read-only', () => {
    const wrapper = mount(TankConfig, { props: { config: makeConfig() } })
    expect(wrapper.text()).toContain('Main pond config')
    expect(inputValue(wrapper, '[data-test="tank-config-name"]')).toBe('Main pond')
    expect(inputValue(wrapper, '[data-test="tank-config-depth"]')).toBe('150')
    expect(wrapper.find('[data-test="tank-config-save"]').exists()).toBe(false)
  })

  it('edits and saves the tank config', async () => {
    const wrapper = mount(TankConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tank-config-edit"]').trigger('click')
    await wrapper.find('[data-test="tank-config-name"]').setValue('Big pond')
    await wrapper.find('[data-test="tank-config-depth"]').setValue('200')
    await wrapper.find('[data-test="tank-config-sensorHeight"]').setValue('90')
    await wrapper.find('[data-test="tank-config-literPerCm"]').setValue('42')
    await wrapper.find('form').trigger('submit')

    const saved = wrapper.emitted('saved')?.[0]?.[0] as TankConfigModel
    expect(saved.name).toBe('Big pond')
    expect(saved.depth).toBe(200)
    expect(saved.sensorHeight).toBe(90)
    expect(saved.literPerCm).toBe(42)
    expect(typeof saved.depth).toBe('number')
  })

  it('rejects invalid values', async () => {
    const wrapper = mount(TankConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tank-config-edit"]').trigger('click')
    await wrapper.find('[data-test="tank-config-depth"]').setValue('0')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('saved')).toBeUndefined()
    expect(wrapper.text()).toContain('Depth must be > 0 cm')
  })

  it('reacts to external config updates', async () => {
    const wrapper = mount(TankConfig, { props: { config: makeConfig() } })
    await wrapper.setProps({ config: makeConfig({ name: 'Quarantine' }) })
    expect(inputValue(wrapper, '[data-test="tank-config-name"]')).toBe('Quarantine')
  })

  it('cancels editing and restores the original values', async () => {
    const wrapper = mount(TankConfig, { props: { config: makeConfig() } })
    await wrapper.find('[data-test="tank-config-edit"]').trigger('click')
    await wrapper.find('[data-test="tank-config-name"]').setValue('Temporary')
    await wrapper.find('[data-test="tank-config-cancel"]').trigger('click')
    expect(inputValue(wrapper, '[data-test="tank-config-name"]')).toBe('Main pond')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
