<script setup lang='ts'>
const originalWidth = computed(() => {
  return Number.parseFloat(appState.elem?.getAttribute('width') ?? '0')
})
const originalHeight = computed(() => {
  return Number.parseFloat(appState.elem?.getAttribute('height') ?? '0')
})

const scale = computed({
  get: () => appState.picScale.value,
  set: value => appState.picScale.value = value,
})

const scaledWidth = computed(() => {
  return originalWidth.value * scale.value
})
const scaledHeight = computed(() => {
  return originalHeight.value * scale.value
})
</script>

<template>
  <div flex="~ items-center">
    <div flex="~ col items-center gap-2">
      <div text-neutral>
        Original Size
      </div>
      <div flex="~ items-center gap-1">
        <div p-1 bd rd>
          {{ originalWidth }}
        </div>
        <div i-carbon:close />
        <div p-1 bd rd>
          {{ originalHeight }}
        </div>
      </div>
    </div>
    <NumInput
      v-model="scale" h-8
      :min="0" :max="100"
    />
    <div flex="~ col items-center gap-2">
      <div text-neutral>
        Scaled Size
      </div>
      <div flex="~ items-center gap-1">
        <div p-1 bd rd>
          {{ scaledWidth }}
        </div>
        <div i-carbon:close />
        <div p-1 bd rd>
          {{ scaledHeight }}
        </div>
      </div>
    </div>
  </div>
</template>
