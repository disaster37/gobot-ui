import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusIcon from '~/components/StatusIcon.vue'

describe('StatusIcon', () => {
  it('renders a green check when isOk is true', () => {
    const wrapper = mount(StatusIcon, { props: { isOk: true } })
    expect(wrapper.find('[data-icon="i-bi-check"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="i-bi-x"]').exists()).toBe(false)
    expect(wrapper.find('span.rounded-full').exists()).toBe(true)
  })

  it('renders a red X when isOk is false', () => {
    const wrapper = mount(StatusIcon, { props: { isOk: false } })
    expect(wrapper.find('[data-icon="i-bi-x"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="i-bi-check"]').exists()).toBe(false)
  })

  it('applies a custom size', () => {
    const wrapper = mount(StatusIcon, { props: { isOk: true, size: '2em' } })
    expect(wrapper.attributes('style')).toContain('2em')
  })
})
