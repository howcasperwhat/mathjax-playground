<script setup lang='ts'>
const props = defineProps<{
  names: string[]
  active: string
}>()

const emits = defineEmits<{
  (e: 'switch', active: string): void
}>()

const active = ref(props.active)
</script>

<template>
  <div flex="~ items-center gap-2">
    <button
      v-for="name, _ in props.names" :key="_"
      :style="{ opacity: active === name ? 1 : 0.5 }"
      bd btn-sm icon-text @click="emits('switch', active = name)"
    >
      <slot :name />
    </button>
  </div>
</template>
