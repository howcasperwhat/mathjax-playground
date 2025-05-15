<script setup lang='ts'>
const tabs = computed(() => {
  return Array.from(playState.tabs.value)
})

const active = computed(() => {
  return playState.active.value
})
const hover = ref('')

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
  <div
    flex="~ items-center"
    w-full select-none of-auto
    color-base children:h-full
  >
    <template v-for="name in tabs" :key="name">
      <button
        :title="name"
        bd rd-xl rd-b-0 min-w-24 shadow
        transition-margin-300 btn-sm icon-text
        :class="active === name
          ? 'm-b--2 b-stone:24'
          : hover === name
            ? 'm-b--4 b-stone:20'
            : 'm-b--6 b-stone:16'
        "
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
      <div b-b="1px solid stone:16" shrink-0 w-1 />
    </template>
    <div
      v-show="isEditing"
      m-b--.5rem sm bd rd-t-xl
      flex="~ items-center"
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
    <div
      v-show="!isEditing"
      b-b="1px solid stone:16"
      flex="~ items-center"
    >
      <button
        op="60 hover:80 active:100"
        rd="1/2" m-t-.25rem p-.4
        bd shadow btn
        @click="editState()"
      >
        <div i-carbon:add />
      </button>
    </div>
    <div grow-1 b-b="1px solid stone:16" />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
