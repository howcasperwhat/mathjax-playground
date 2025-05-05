<script setup lang='ts'>
const props = defineProps<{
  names: string[]
  active?: string
}>()

const emits = defineEmits<{
  (e: 'switch', active: string): void
}>()

const active = ref(props.active || props.names[0])
const hover = ref<string | null>(null)
const ielem = ref<HTMLInputElement | null>(null)
const ename = ref('')
const editing = ref(false)

function editState() {
  editing.value = true
  nextTick(() => ielem.value?.focus())
}

function confirmEditState() {
  if (!playState.exists(ename.value)) {
    playState.add(ename.value)
    editing.value = false
  }
  else {
    message.error('State name already exists')
    ielem.value?.focus()
  }
}

function cancelEditState() {
  editing.value = false
  ename.value = ''
  // eslint-disable-next-line no-console
  console.log('cancelEditState', ename.value)
}

function removeState(name: string) {
  // eslint-disable-next-line no-console
  console.log('removeState', name)
}
</script>

<template>
  <div flex="~ items-center gap-1">
    <button
      v-for="name in props.names" :key="name"
      :style="{
        opacity: active === name
          ? 1 : hover === name
            ? 0.75 : 0.5,
      }"
      bd bg-hex-8882 btn-sm icon-text
      @click="emits('switch', active = name)"
      @mouseenter="hover = name"
      @mouseleave="hover = null"
    >
      <div i-carbon:3d-mpr-toggle />
      {{ name }}
      <div
        v-show="hover === name"
        @click="removeState(name)"
      >
        <div i-carbon:close />
      </div>
    </button>
    <button
      v-show="editing"
      bd bg-hex-8882 btn-sm icon-text
    >
      <div i-carbon:3d-mpr-toggle />
      <input
        ref="ielem"
        v-model="ename"
        placeholder="Name"
        maxlength="20"
        p-0 ipt-sm w-20
        @blur="cancelEditState"
        @keydown.enter="confirmEditState"
        @keydown.esc="cancelEditState"
      >
    </button>
    <button
      p-.4 bd btn rd="1/2"
      op="60 hover:80 active:100"
      @click="editState()"
    >
      <div i-carbon:add />
    </button>
  </div>
</template>
