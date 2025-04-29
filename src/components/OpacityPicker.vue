<script setup lang="ts">
const model = defineModel<number>({ required: true })
function input(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  model.value = Math.max(0, Math.min(100, Number.parseInt(value) || 0))
  target.value = model.value.toString()
}
function update(delta: number) {
  model.value = Math.max(0, Math.min(100, (model.value) + delta))
}
</script>

<template>
  <div
    flex="~ items-center"
    b="1px solid gray op-24"
    rounded
  >
    <input
      :value="model"
      maxlength="3"
      p-x-1

      text-align-center w-12 focus:outline-unset @input.prevent="input"
    >
    <div
      flex="~ col"
      b="1px solid gray op-24"
      text-3 b-b-0 b-r-0 b-t-0
    >
      <button
        b="1px solid gray op-24"
        b-l-0
        b-r-0 b-t-0 btn @click="update(1)"
      >
        <div i-carbon:caret-up />
      </button>
      <button btn @click="update(-1)">
        <div i-carbon:caret-down />
      </button>
    </div>
  </div>
</template>
