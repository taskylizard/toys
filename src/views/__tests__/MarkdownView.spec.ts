import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownView from '../MarkdownView.vue'

const mountView = () =>
  mount(MarkdownView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('MarkdownView', () => {
  it('renders markdown to html', async () => {
    const wrapper = mountView()

    await wrapper.find('#markdown-input').setValue('# Title')
    expect(wrapper.html()).toContain('<h1>Title</h1>')
  })
})
