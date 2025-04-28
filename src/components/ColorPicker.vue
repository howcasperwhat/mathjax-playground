<script setup lang='ts'>
import { ref } from 'vue'
import { art } from '~/composables/artwork'

const model = defineModel<string>({ required: true })
const element = ref<HTMLInputElement | null>(null)

function toggle() {
  element.value?.click()
  art.switchTool()
}

function change(event: Event) {
  model.value = (event.target as HTMLInputElement).value
  // eslint-disable-next-line no-console
  console.log('color', model.value)
}
</script>

<template>
  <div inline-flex items-center relative>
    <button btn @click="toggle">
      <svg width="1.2em" height="1.2em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="gray" stroke-width="2" :fill="model" />
      </svg>
    </button>
    <input
      ref="element" type="color"
      op-0 h-0 w-0 left-12 top-0 absolute
      :value="model" @input="change"
    >
  </div>
</template>
