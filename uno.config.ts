import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'btn': 'inline-block cursor-pointer select-none disabled:cursor-not-allowed disabled:op-20 whitespace-nowrap of-hidden',
    'ipt': 'focus:outline-unset min-w-0',
    'sep': 'color-base op-16',

    'icon-text': 'flex items-center flex-gap-2 children:shrink-0',
    'icon-btn': 'btn opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-hex-18f active:opacity-100 active:text-hex-c66',
    'toggle-btn': 'inline-block cursor-pointer select-none opacity-80 transition duration-200 ease-in-out hover:opacity-90 active:opacity-100 c-gray',

    'sm': 'px-2 py-1',
    'md': 'px-2 py-2',
    'lg': 'px-4 py-2',

    'bd': 'b-1px b-solid b-stone:16',

    'btn-sm': 'btn sm rd',
    'btn-md': 'btn md rd',
    'btn-lg': 'btn lg rd',
    'ipt-sm': 'ipt sm rd',
    'ipt-md': 'ipt md rd',
    'ipt-lg': 'ipt lg rd',

    'i:tex': 'i-carbon:code c-green-700 dark:c-green-400',
    'i:svg': 'i-carbon:function c-blue-700 dark:c-blue-400',
    'i:workspace': 'i-carbon:3d-mpr-toggle c-purple-700 dark:c-purple-400',
    'i:default': 'i-carbon:document c-stone-700 dark:c-stone-400',

    'color-base': 'color-neutral-800 dark:color-neutral-300',
    'bg-base': 'bg-white dark:bg-#121212',
    'border-base': 'border-#8882',
    'bg-tooltip': 'bg-white:75 dark:bg-#121212:75 backdrop-blur-8',

    'z-tabs': 'z-5',
    'z-mathjax': 'z-10',
    'z-mathjax-tool': 'z-15',
    'z-monaco': 'z-20',
    'z-nomobile': 'z-30',
  },
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
        sans: 'DM Sans:200,400,700',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
