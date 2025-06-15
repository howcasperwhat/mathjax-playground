<script setup lang='ts'>
const setting = defineModel<ColorProps>({ required: true })
const el = useTemplateRef<HTMLInputElement>('el')

const change = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement
  setting.value.color = target.value
}, 200)

const opacity = computed<number>({
  get: () => setting.value.opacity,
  set: value => setting.value.opacity = value,
})
</script>

<template>
  <div lh-0 relative>
    <button p-0 bd btn-sm @click="el?.click()">
      <svg
        width="1.2rem" height="1.2rem"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0" y="0" width="32" height="32"
          :fill="setting.color" :fill-opacity="setting.opacity / 100"
        />
      </svg>
    </button>
    <input
      ref="el" type="color" :value="setting.color"
      op-0 scheme-light h-0 w-0 left-0 top-full
      absolute dark:scheme-dark @input="change"
    >
  </div>
  <NumInput
    v-model="opacity"
    :min="0" :max="100" h-8
  />
  <input
    v-model="setting.color"
    font-mono ipt-sm text-align-center bd h-8
    w="[calc(8ch+1rem)]" maxlength="7"
  >
</template>
