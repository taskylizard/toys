import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UrlView from '../UrlView.vue'

const mountView = () =>
  mount(UrlView, {
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

describe('UrlView', () => {
  it('encodes url text', async () => {
    const wrapper = mountView()

    await wrapper.find('#url-input').setValue('hello world')

    const encodeButton = wrapper.findAll('button').find((button) => button.text() === 'encode')
    if (!encodeButton) {
      throw new Error('missing encode button')
    }

    await encodeButton.trigger('click')

    const output = wrapper.find('#url-output').element as HTMLTextAreaElement
    expect(output.value).toBe('hello%20world')
  })
})
