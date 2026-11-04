import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TankAction from '~/components/TankAction.vue'
import type { TankState } from '~/types/models'

const state: TankState = { id: '1', level: 120, volume: 480, percent: 80, distance: 30 }

describe('TankAction', () => {
  it('renders the tank telemetry read-only', () => {
    const wrapper = mount(TankAction, { props: { state } })
    expect(wrapper.text()).toContain('1 state')
    expect((wrapper.find('[data-test="tank-level"]').element as HTMLInputElement).value).toBe('120')
    expect((wrapper.find('[data-test="tank-volume"]').element as HTMLInputElement).value).toBe(
      '480'
    )
    expect((wrapper.find('[data-test="tank-percent"]').element as HTMLInputElement).value).toBe(
      '80'
    )
    expect((wrapper.find('[data-test="tank-distance"]').element as HTMLInputElement).value).toBe(
      '30'
    )
    expect(wrapper.find('[data-test="tank-level"]').attributes('readonly')).toBeDefined()
  })
})
