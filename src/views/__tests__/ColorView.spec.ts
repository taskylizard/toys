import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorView from '../ColorView.vue'

const mountView = () =>
  mount(ColorView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('ColorView', () => {
  it('updates hex output when sliders change', async () => {
    const wrapper = mountView()
    const sliders = wrapper.findAll('input[type="range"]')

    if (sliders.length < 3) {
      throw new Error('missing sliders')
    }

    await sliders[0]!.setValue('0')
    await sliders[1]!.setValue('100')
    await sliders[2]!.setValue('50')

    expect(wrapper.text()).toContain('#')
  })
})
