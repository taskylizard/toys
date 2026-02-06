import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NotesView from '../NotesView.vue'

const mountView = () =>
  mount(NotesView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('NotesView', () => {
  it('binds notes text', async () => {
    const wrapper = mountView()

    await wrapper.find('#notes-input').setValue('hello notes')
    const textarea = wrapper.find('#notes-input').element as HTMLTextAreaElement
    expect(textarea.value).toBe('hello notes')
  })
})
