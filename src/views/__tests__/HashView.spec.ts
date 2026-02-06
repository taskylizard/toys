import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HashView from '../HashView.vue'

const mountView = () =>
  mount(HashView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('HashView', () => {
  it('updates md5 hash', async () => {
    const wrapper = mountView()

    await wrapper.find('#hash-input').setValue('hello')
    expect(wrapper.text()).toContain('5d41402')
  })
})
