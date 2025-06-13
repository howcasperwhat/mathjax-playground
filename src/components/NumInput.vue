<script setup lang='ts'>
import { clamp } from '@vueuse/core'

const {
  min = -Infinity,
  max = +Infinity,
} = defineProps<{
  min?: number
  max?: number
}>()

const el = useTemplateRef<HTMLInputElement>('el')
const value = defineModel<number>({ required: true })
const uivalue = ref(value.value)

// avoid prefixing zero
function input(e: Event) {
  const strValue = (e.target as HTMLInputElement).value
  const numValue = Number.parseFloat(strValue)
  if (strValue !== String(numValue)) {
    el.value!.value = numValue.toString()
  }
}
onMounted(() => {
  watch(uivalue, (v) => {
    uivalue.value = clamp(v, min, max)
    value.value = uivalue.value
  })
})
</script>

<template>
  <div
    flex="~ items-center"

    font-mono bd rd children:h-full
  >
    <button
      btn b-r="1px solid stone:16"
      @click="uivalue -= 1"
    >
      <div i-carbon:subtract />
    </button>
    <input
      ref="el"
      v-model="uivalue" type="number"
      :style="{ width: `${Math.max(0, String(uivalue).length) + 2}ch` }"
      px-1 text-align-center ipt @input="input"
    >
    <button
      btn b-l="1px solid stone:16"
      @click="uivalue += 1"
    >
      <div i-carbon:add />
    </button>
  </div>
</template>

<style scoped>
::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
  appearance: none !important;
}
</style>
