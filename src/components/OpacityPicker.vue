<script setup lang="ts">
const model = defineModel<number>({ required: true })

function input(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  model.value = shrink(Number.parseInt(value) || 0)
  target.value = model.value.toString()
}
function update(delta: number) {
  model.value = shrink(model.value + delta)
}
</script>

<template>
  <div flex="~ items-center" bd rd>
    <input
      :value="model" maxlength="3"
      p-x-1 text-align-center ipt w-12
      @input.prevent="input"
    >
    <div
      flex="~ col"
      text-xs bd b-b-0 b-r-0 b-t-0
    >
      <button
        bd b-l-0 b-r-0 b-t-0 btn
        @click="update(1)"
      >
        <div i-carbon:caret-up />
      </button>
      <button btn @click="update(-1)">
        <div i-carbon:caret-down />
      </button>
    </div>
  </div>
</template>
