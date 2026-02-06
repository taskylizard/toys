import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseConvertView from '../BaseConvertView.vue'

const mountView = () =>
  mount(BaseConvertView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('BaseConvertView', () => {
  it('converts decimal to hex', async () => {
    const wrapper = mountView()

    await wrapper.find('#base-input').setValue('255')
    expect(wrapper.text()).toContain('ff')
  })
})
