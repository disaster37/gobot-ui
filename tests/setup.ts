import { h, defineComponent, type PropType } from 'vue'
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

import StatusIcon from '~/components/StatusIcon.vue'
import DfpStatus from '~/components/DfpStatus.vue'
import BoardState from '~/components/BoardState.vue'
import ButtonOnOff from '~/components/ButtonOnOff.vue'
import TfpAction from '~/components/TfpAction.vue'
import DfpAction from '~/components/DfpAction.vue'
import DfpConfig from '~/components/DfpConfig.vue'
import TfpConfig from '~/components/TfpConfig.vue'
import TfpState from '~/components/TfpState.vue'
import TankAction from '~/components/TankAction.vue'
import TankConfig from '~/components/TankConfig.vue'

const globals = globalThis as Record<string, unknown>

globals.useRuntimeConfig = () => ({
  public: { apiBase: '/backend/api', authEndpoint: '/backend/token-auth' }
})
globals.navigateTo = vi.fn()
globals.$fetch = vi.fn()

const passthrough = (name: string, tag = 'div', renderSlots = false) =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () =>
        h(
          tag,
          { ...attrs },
          renderSlots ? [slots.header?.(), slots.default?.()] : slots.default?.()
        )
    }
  })

const UInputStub = defineComponent({
  name: 'UInput',
  inheritAttrs: false,
  props: {
    modelValue: { default: '' },
    type: { type: String, default: 'text' },
    readonly: Boolean,
    disabled: Boolean,
    placeholder: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        ...attrs,
        value: props.modelValue,
        type: props.type,
        readonly: props.readonly,
        disabled: props.disabled,
        placeholder: props.placeholder,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value)
      })
  }
})

const USelectStub = defineComponent({
  name: 'USelect',
  inheritAttrs: false,
  props: {
    modelValue: { default: '' },
    items: {
      type: Array as PropType<Array<string | { label: string; value: string }>>,
      default: () => []
    },
    disabled: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'select',
        {
          ...attrs,
          disabled: props.disabled,
          value: props.modelValue,
          onChange: (event: Event) =>
            emit('update:modelValue', (event.target as HTMLSelectElement).value)
        },
        props.items.map((item) =>
          typeof item === 'string'
            ? h('option', { value: item }, item)
            : h('option', { value: item.value }, item.label)
        )
      )
  }
})

const UCheckboxStub = defineComponent({
  name: 'UCheckbox',
  inheritAttrs: false,
  props: { modelValue: Boolean, label: String, disabled: Boolean },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        ...attrs,
        type: 'checkbox',
        checked: props.modelValue,
        disabled: props.disabled,
        onChange: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).checked)
      })
  }
})

const UIconStub = defineComponent({
  name: 'UIcon',
  inheritAttrs: false,
  props: { name: String },
  setup(props, { attrs }) {
    return () => h('span', { ...attrs, 'data-icon': props.name })
  }
})

const UAlertStub = defineComponent({
  name: 'UAlert',
  inheritAttrs: false,
  props: { title: String, description: String, color: String },
  setup(props, { attrs }) {
    return () => h('div', { ...attrs }, [props.title, props.description])
  }
})

config.global.components = {
  UApp: passthrough('UApp'),
  UCard: passthrough('UCard', 'div', true),
  UForm: passthrough('UForm', 'form'),
  UFormField: passthrough('UFormField'),
  UButton: passthrough('UButton', 'button'),
  UBadge: passthrough('UBadge', 'span'),
  UAlert: UAlertStub,
  UIcon: UIconStub,
  UInput: UInputStub,
  USelect: USelectStub,
  UCheckbox: UCheckboxStub,
  StatusIcon,
  DfpStatus,
  BoardState,
  ButtonOnOff,
  TfpAction,
  DfpAction,
  DfpConfig,
  TfpConfig,
  TfpState,
  TankAction,
  TankConfig
}
