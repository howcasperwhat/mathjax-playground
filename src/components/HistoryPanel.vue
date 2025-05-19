<script setup lang='ts'>
const delta = 20
const length = ref(delta)
const query = ref('')
const el = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const reversed = [...Object.entries(playState.memory.value)].reverse()
  if (!query.value)
    return reversed
  return reversed.filter(
    ([name, _]) => name.toLowerCase().includes(
      query.value.toLowerCase(),
    ),
  )
})
function format(usage: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  for (let i = 0; i < units.length; i++) {
    if (usage < 1024 ** (i + 1))
      return `${(usage / (1024 ** i)).toFixed(2)} ${units[i]}`
  }
  return `${(usage / (1024 ** units.length)).toFixed(2)} TB`
}
function show(name: string) {
  playState.tabs.value.add(name)
  playState.switchActive(name)
}

const inputElement = ref<HTMLInputElement | null>(null)
const editingName = ref('')
const isEditing = ref(false)

function editState() {
  isEditing.value = !isEditing.value
  isEditing.value && nextTick(
    () => inputElement.value?.focus(),
  )
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
</script>

<template>
  <div flex="~ col gap-2" of-auto>
    <div
      flex="~ items-center gap-2"
      p-b-2 shrink-0 top-0 sticky
      z-1 bg-base
    >
      <button
        bd rd-full flex shrink-0 h-8
        w-8 children:text-lg children:m-a
        hover:bg-stone:8 btn
        @click="editState"
      >
        <div v-if="isEditing" i-carbon:subtract />
        <div v-else i-carbon:add />
      </button>
      <label

        flex="~ items-center gap-1"
        focus-within="w-60"
        :class="query ? 'w-60' : 'w-8'"
        p-1.5 bd rd-full h-8 w-8 transition-width duration-300 of-hidden hover:bg-stone:8
      >
        <div i-carbon:search shrink-0 />
        <input
          ref="el"
          v-model="query" maxlength="36"
          type="text" placeholder="Search..."
          ipt w-full @input="length = delta"
        >
        <button

          rd-full flex shrink-0 h-6 w-6 color-base btn
          :class="query ? '' : 'op0'"
          @click="query = ''"
        >
          <div i-carbon:close m-a />
        </button>
      </label>
    </div>
    <div
      flex="~ col gap-2"
      children:flex="~ gap-2"
      children:bd color-base
      children:rd-full children:icon-text
      children:w-full children:of-hidden
    >
      <div v-show="isEditing" p-2>
        <div i:tex />
        <input
          ref="inputElement"
          v-model="editingName"
          placeholder="name"
          maxlength="20"
          p-0 ipt-sm
          @blur="cancelEditState"
          @keydown.enter="confirmEditState"
          @keydown.esc="cancelEditState"
        >
      </div>
      <button
        v-for="[name, item] in filtered.slice(0, length)"
        :key="name" :title="name"
        btn-md hover:bg-hex-8881
        @click="show(name)"
      >
        <div :class="playState.icon(item)" />
        <div shrink-1 truncate v-text="name" />
        <div text-sm text-gray m-l-a v-text="format(playState.usage(name, item))" />
      </button>
      <button
        v-if="filtered.length > length"
        text-gray bd b-op-80 op-40 w-max btn-sm active:op-80
        hover:op-60 disabled:important-op-20
        @click="length += delta"
      >
        <div v-text="'Load More'" />
      </button>
    </div>
  </div>
</template>
