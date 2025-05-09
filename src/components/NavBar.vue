<script setup lang='ts'>
const tabs = computed(() => {
  return Array.from(playState.tabs.value)
})

const active = computed(() => {
  return playState.active.value
})
const hover = ref<string>('')

const inputElement = ref<HTMLInputElement | null>(null)
const editingName = ref('')
const isEditing = ref(false)

function editState() {
  isEditing.value = true
  nextTick(() => inputElement.value?.focus())
}

function confirmEditState() {
  const name = editingName.value.trim()
  if (!playState.exists(name)) {
    // memory
    playState.add(name)
    // tabs
    playState.tabs.value.add(name)
    // active
    playState.switchActive(name)
    isEditing.value = false
  }
  else {
    message.error('State name already exists')
    inputElement.value?.focus()
  }
}

function cancelEditState() {
  isEditing.value = false
  editingName.value = ''
}

function removeState(name: string) {
  playState.remove(name)
}
</script>

<template>
  <div flex="~ items-center gap-1">
    <button
      v-for="name in tabs"
      :key="name"
      :style="{
        opacity: active === name
          ? 1 : hover === name
            ? 0.75 : 0.5,
      }"
      bd bg-hex-8882 btn-sm icon-text
      @click="playState.switchActive(name)"
      @mouseenter="hover = name"
      @mouseleave="hover = ''"
    >
      <div :class="playState.icon(name)" />
      {{ name }}
      <div
        v-show="hover === name"
        @click.stop="removeState(name)"
      >
        <div i-carbon:close />
      </div>
    </button>
    <button
      v-show="isEditing"
      bd bg-hex-8882 btn-sm icon-text
    >
      <div i-carbon:3d-mpr-toggle />
      <input
        ref="inputElement"
        v-model="editingName"
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
