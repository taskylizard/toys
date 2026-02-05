import { defineConfig, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      fonts: {
        sans: 'Geist:400,500,600,700',
      },
    }),
  ],
})
