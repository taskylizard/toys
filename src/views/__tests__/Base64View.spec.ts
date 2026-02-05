import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Base64View from '../Base64View.vue'

const getButton = (wrapper: ReturnType<typeof mount>, label: string) => {
  const button = wrapper.findAll('button').find((item) => item.text() === label)
  if (!button) {
    throw new Error(`missing button: ${label}`)
  }
  return button
}

const mountView = () =>
  mount(Base64View, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
        ToolbarRoot: {
          template: '<div><slot /></div>',
        },
        ToolbarButton: {
          props: ['disabled', 'type'],
          template: '<button :disabled="disabled" :type="type"><slot /></button>',
        },
      },
    },
  })

describe('Base64View', () => {
  it('encodes input to base64', async () => {
    const wrapper = mountView()

    await wrapper.find('#input').setValue('hello')
    await getButton(wrapper, 'encode').trigger('click')

    const output = wrapper.find('#output').element as HTMLTextAreaElement
    expect(output.value).toBe('aGVsbG8=')
  })

  it('decodes base64 to text', async () => {
    const wrapper = mountView()

    await wrapper.find('#input').setValue('aGVsbG8=')
    await getButton(wrapper, 'decode').trigger('click')

    const output = wrapper.find('#output').element as HTMLTextAreaElement
    expect(output.value).toBe('hello')
  })

  it('resets fields', async () => {
    const wrapper = mountView()

    await wrapper.find('#input').setValue('hello')
    await getButton(wrapper, 'encode').trigger('click')
    await getButton(wrapper, 'reset').trigger('click')

    const input = wrapper.find('#input').element as HTMLTextAreaElement
    const output = wrapper.find('#output').element as HTMLTextAreaElement
    expect(input.value).toBe('')
    expect(output.value).toBe('')
  })
})
