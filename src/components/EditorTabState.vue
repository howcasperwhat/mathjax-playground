<script setup lang='ts'>
const props = defineProps<{
  names: string[]
  active?: string
}>()

const emits = defineEmits<{
  (e: 'switch', active: string): void
}>()

interface State {
  active: boolean
  hover: boolean
}

const active = ref(props.active || props.names[0])
const states = ref<Record<string, State>>(
  Object.fromEntries(props.names.map(name =>
    [name, { active: false, hover: false }],
  )),
)

function setActive(name: string) {
  active.value = name
  emits('switch', name)
}

onMounted(() => {

})
</script>

<template>
  <div flex="~ items-center gap-1">
    <button
      v-for="[name, state] in Object.entries(states)" :key="name"
      :style="{ opacity: active === name ? 1 : 0.5 }"
      bd bg-hex-8882 btn-sm icon-text
      @click="setActive(name)"
      @mouseenter="state.hover = true"
      @mouseleave="state.hover = false"
    >
      <div i-carbon:3d-mpr-toggle />
      {{ name }}
      <div
        v-show="state.hover"
        @click="playState.remove(name)"
      >
        <div i-carbon:close />
      </div>
    </button>
    <button
      p-.4 bd btn rd="1/2"
      op="60 hover:80 active:100"
    >
      <div i-carbon:add />
    </button>
  </div>
</template>
