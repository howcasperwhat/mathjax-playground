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
      :class="active === name
        ? 'op-100 b-b-stone'
        : 'op-60 b-b-transparent'
      "
      m-x-0.5 p-x-1.5 rd-0 btn-sm color-base b-b="2px solid"
      @click="emits('switch', active = name)"
    >
      <slot :name />
    </button>
  </div>
</template>
