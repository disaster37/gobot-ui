import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonOnOff from '~/components/ButtonOnOff.vue'

describe('ButtonOnOff', () => {
  it('highlights the On button when isOn is true', () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: true } })
    expect(wrapper.find('[data-test="btn-on"]').attributes('color')).toBe('success')
    expect(wrapper.find('[data-test="btn-off"]').attributes('color')).toBe('neutral')
  })

  it('highlights the Off button when isOn is false', () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: false } })
    expect(wrapper.find('[data-test="btn-on"]').attributes('color')).toBe('neutral')
    expect(wrapper.find('[data-test="btn-off"]').attributes('color')).toBe('error')
  })

  it('emits change(!isOn) on click', async () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: true } })
    await wrapper.find('[data-test="btn-off"]').trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([false])
  })

  it('reacts to external isOn prop updates', async () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: true } })
    await wrapper.setProps({ isOn: false })
    expect(wrapper.find('[data-test="btn-off"]').attributes('color')).toBe('error')
  })

  it('disables both buttons while loading', () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: false, loading: true } })
    expect(wrapper.find('[data-test="btn-on"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-test="btn-off"]').attributes('disabled')).toBeDefined()
  })

  it('does not emit while disabled', async () => {
    const wrapper = mount(ButtonOnOff, { props: { isOn: false, disabled: true } })
    await wrapper.find('[data-test="btn-on"]').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
