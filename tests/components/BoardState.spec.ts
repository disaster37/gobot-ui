import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BoardState from '~/components/BoardState.vue'
import type { Board } from '~/types/models'

const boards: Board[] = [
  { id: 'dfp', name: 'DFP board', isOnline: true },
  { id: 'tfp', name: 'TFP board', isOnline: false }
]

describe('BoardState', () => {
  it('renders uppercase board ids with status icons', () => {
    const wrapper = mount(BoardState, { props: { boards } })
    expect(wrapper.text()).toContain('DFP')
    expect(wrapper.text()).toContain('TFP')
    expect(wrapper.find('[data-icon="i-bi-check"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="i-bi-x"]').exists()).toBe(true)
  })

  it('renders an empty state when no boards are connected', () => {
    const wrapper = mount(BoardState, { props: { boards: [] } })
    expect(wrapper.text()).toContain('No boards connected')
  })
})
