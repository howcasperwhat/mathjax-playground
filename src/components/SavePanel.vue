<script setup lang="ts">
const name = ref(playState.active.value)

function rename(name: string) {
  if (!playState.exists(name)) {
    playState.rename(name)
  }
  else {
    message.error('State name already exists')
  }
}

onMounted(() => {
  watch(playState.active, () => {
    name.value = playState.active.value
  })
})
</script>

<template>
  <div
    flex="~ col gap-4"
    children:flex="~ items-center gap-2 nowrap"
  >
    <div>
      <input
        v-model="name"
        placeholder="Name"
        :maxlength="NAME_MAX_LENGTH"
        ipt-sm bd w-full
      >
    </div>
    <div
      children:btn-sm children:icon-text
      children:bg-op="40 hover:60"
      children:op="60 hover:80 active:100"
    >
      <button bg-stone @click="rename(name)">
        <div i-carbon:status-resolved />
        <div v-text="'Rename'" />
      </button>
      <button bg-red @click="playState.delete()">
        <div i-carbon:trash-can />
        <div v-text="'Delete'" />
      </button>
    </div>
    <div
      children:btn-sm children:icon-text
      children:bg-op="40 hover:60"
      children:op="60 hover:80 active:100"
    >
      <button bg-green @click="playState.save('tex')">
        <div i:tex />
        <div v-text="'tex'" />
      </button>
      <button bg-blue @click="playState.save('svg')">
        <div i:svg />
        <div v-text="'svg'" />
      </button>
      <button bg-purple @click="playState.save('workspace')">
        <div i:workspace />
        <div v-text="'workspace'" />
      </button>
    </div>
  </div>
</template>
