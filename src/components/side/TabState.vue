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
  <div flex="~ items-center" children:shrink-0>
    <button
      v-for="name in props.names" :key="name"
      v-tooltip="name"
      :class="active === name
        ? 'op-100! b-b-stone'
        : 'op-60 b-b-transparent'
      "
      b-b="2px solid"
      text-lg mx-0.5 px-1.5 py-1 color-base btn hover:op-80
      @click="emits('switch', active = name)"
    >
      <slot :name />
    </button>
  </div>
</template>
