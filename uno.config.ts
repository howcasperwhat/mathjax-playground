import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['icon-btn', 'text-[1em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-hex-18f active:opacity-100 active:text-hex-c66'],
    ['toggle-btn', 'text-[0.8em] inline-block cursor-pointer select-none opacity-80 transition duration-200 ease-in-out hover:opacity-90 active:opacity-100 c-gray'],
    ['btn', 'text-[1em] inline-block cursor-pointer select-none'],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
})
