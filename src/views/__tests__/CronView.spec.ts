import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CronView from '../CronView.vue'

const mountView = () =>
  mount(CronView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

describe('CronView', () => {
  it('builds expression from fields', async () => {
    const wrapper = mountView()

    await wrapper.find('select').setValue('5')
    const expression = wrapper.find('#cron-expression').element as HTMLInputElement
    expect(expression.value.startsWith('5 ')).toBe(true)
  })
})
