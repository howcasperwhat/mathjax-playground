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
      v-tooltip="name"
      :class="active === name
        ? 'op-100! b-b-stone'
        : 'op-60 b-b-transparent'
      "
      b-b="2px solid" text-lg m-x-0.5 p-x-1.5 p-y-1 color-base btn
      hover:op-80
      @click="emits('switch', active = name)"
    >
      <slot :name />
    </button>
  </div>
</template>
