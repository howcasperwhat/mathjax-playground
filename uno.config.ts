import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'text-[1em] inline-block cursor-pointer select-none disabled:cursor-not-allowed disabled:op-20 whitespace-nowrap of-hidden'],
    ['icon-btn', 'btn opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-hex-18f active:opacity-100 active:text-hex-c66'],
    ['toggle-btn', 'text-[0.8em] inline-block cursor-pointer select-none opacity-80 transition duration-200 ease-in-out hover:opacity-90 active:opacity-100 c-gray'],
    ['sm', 'p-x-2 p-y-1'],
    ['md', 'p-x-2 p-y-2'],
    ['lg', 'p-x-4 p-y-2'],
    ['bd', 'b-1px b-solid b-gray b-op-24'],
    ['ipt', 'focus:outline-unset'],
    ['sep', 'c-gray op-24'],
    ['btn-sm', 'btn sm rd'],
    ['btn-md', 'btn md rd'],
    ['btn-lg', 'btn lg rd'],
    ['ipt-sm', 'ipt sm rd'],
    ['ipt-md', 'ipt md rd'],
    ['ipt-lg', 'ipt lg rd'],
    ['panel', 'rd bg-gray bg-op-8 of-auto bd'],
    ['icon-text', 'flex items-center flex-gap-2 children:shrink-0'],
    ['i:tex', 'i-carbon:code c-green-700 dark:c-green-400'],
    ['i:svg', 'i-carbon:function c-blue-700 dark:c-blue-400'],
    ['i:workspace', 'i-carbon:3d-mpr-toggle c-purple-700 dark:c-purple-400'],
    ['i:default', 'i-carbon:document c-gray-700 dark:c-gray-400'],
  ],
  safelist: [
    'i:tex',
    'i:svg',
    'i:workspace',
    'i:default',
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
