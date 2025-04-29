<script setup lang='ts'>
const props = defineProps<{
  names: string[]
  active?: string
}>()
const emits = defineEmits<{
  (e: 'switch', active: string): void
}>()
const active = ref(props.active || props.names[0])
function setActive(name: string) {
  active.value = name
  emits('switch', name)
}
</script>

<template>
  <div
    flex="~ items-center gap-2"
  >
    <button
      v-for="name, _ in props.names" :key="_"
      b="1px solid gray op-24"
      p-x-2 p-y-1 rounded btn
      :style="{ opacity: active === name ? 1 : 0.5 }"
      @click="setActive(name)"
    >
      <slot :name />
    </button>
  </div>
</template>
