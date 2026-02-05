import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HomeView from '../HomeView.vue'

const mountView = () =>
  mount(HomeView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('HomeView', () => {
  it('lists available tools', () => {
    const wrapper = mountView()
    expect(wrapper.text()).toContain('tools')
    expect(wrapper.text()).toContain('base64 encode / decode')
  })
})
