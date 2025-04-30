<script setup lang='ts'>
defineProps <{
  opacity: number
}>()

const model = defineModel<string>({ required: true })
const element = ref<HTMLInputElement | null>(null)

function toggle() {
  element.value?.click()
  art.switchTool()
}

function change(event: Event) {
  const target = event.target as HTMLInputElement
  model.value = target.value
}
</script>

<template>
  <div lh-0 relative>
    <button p-0 bd btn-sm @click="toggle">
      <svg
        width="1.2rem" height="1.2rem"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0" y="0" width="32" height="32"
          :fill="model" :fill-opacity="opacity / 100"
        />
      </svg>
    </button>
    <input
      ref="element" type="color"
      left="50%" top="50%"
      op-0 h-0 w-0 absolute
      :value="model" @input="change"
    >
  </div>
</template>
