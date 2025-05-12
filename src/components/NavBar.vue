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
  <div flex="~ items-center gap-1" m-x-xl w-full of-auto>
    <button
      v-for="name in tabs"
      :key="name"
      :title="name"
      :style="{ 'margin-bottom': active === name ? '-.25rem' : '-.75rem' }"

      bd rd-xl rd-b-0 h-full min-w-24 relative z-100 btn-sm icon-text
      @click="playState.switchActive(name)"
      @mouseenter="hover = name"
      @mouseleave="hover = ''"
    >
      <div :class="playState.icon(name)" />
      <div shrink-1 truncate v-text="name" />
      <div
        flex="~ items-center"
        rd bg-gray
        bg-op="0 hover:20 active:40"
        @click.stop="removeState(name)"
      >
        <div i-carbon:close />
      </div>
    </button>
    <div
      v-show="isEditing"
      sm bd rd bg-hex-8882
    >
      <input
        ref="inputElement"
        v-model="editingName"
        placeholder="Name"
        maxlength="20"
        p-0 ipt-sm
        @blur="cancelEditState"
        @keydown.enter="confirmEditState"
        @keydown.esc="cancelEditState"
      >
    </div>
    <button
      rd="1/2"
      op="60 hover:80 active:100"
      p-.4 bd shrink-0 btn
      @click="editState()"
    >
      <div i-carbon:add />
    </button>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
