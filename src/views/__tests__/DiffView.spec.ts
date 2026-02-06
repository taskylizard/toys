import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DiffView from '../DiffView.vue'

const mountView = () =>
  mount(DiffView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('DiffView', () => {
  it('renders diff rows when text differs', async () => {
    const wrapper = mountView()

    await wrapper.find('#diff-left').setValue('alpha')
    await wrapper.find('#diff-right').setValue('beta')

    const rows = wrapper.findAll('[data-testid="diff-row"]')
    expect(rows.length).toBeGreaterThan(0)
  })
})
