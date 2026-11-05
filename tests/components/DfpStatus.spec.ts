import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DfpStatus from '~/components/DfpStatus.vue'

describe('DfpStatus', () => {
  it('renders the repeat icon when on', () => {
    const wrapper = mount(DfpStatus, { props: { isOn: true } })
    expect(wrapper.find('[data-icon="i-bi-arrow-repeat"]').exists()).toBe(true)
  })

  it('renders the circle icon when off', () => {
    const wrapper = mount(DfpStatus, { props: { isOn: false } })
    expect(wrapper.find('[data-icon="i-bi-circle"]').exists()).toBe(true)
  })
})
