import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import IdsView from '../IdsView.vue'

const mountView = () =>
  mount(IdsView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('IdsView', () => {
  it('generates a uuid v4', async () => {
    const wrapper = mountView()

    await wrapper.find('button').trigger('click')
    const input = wrapper.find('#uuid-v4').element as HTMLInputElement
    expect(input.value.length).toBeGreaterThan(10)
  })
})
