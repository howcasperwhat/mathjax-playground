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
  <div flex="~ items-center">
    <button
      v-for="name, _ in props.names" :key="_"
      :style="{
        'opacity': active === name ? 0.8 : 0.5,
        'border-bottom-color': active === name ? 'gray' : 'transparent',
      }"
      m-x-0.5 p-x-1.5 rd-0 btn-sm b-b="2px solid"
      @click="emits('switch', active = name)"
    >
      <slot :name />
    </button>
  </div>
</template>
