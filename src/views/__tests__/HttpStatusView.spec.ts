import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HttpStatusView from '../HttpStatusView.vue'

const mountView = () =>
  mount(HttpStatusView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('HttpStatusView', () => {
  it('filters status codes by query', async () => {
    const wrapper = mountView()

    await wrapper.find('#status-query').setValue('404')
    const rows = wrapper.findAll('[data-testid="status-row"]')

    expect(rows).toHaveLength(1)
    expect(rows[0]?.text()).toContain('404')
  })
})
