<script setup lang='ts'>
const delta = 20
const length = ref(delta)
const query = ref('')

const filtered = computed(() => {
  if (!query.value)
    return Object.entries(playState.memory.value)
  return Object.entries(playState.memory.value).filter(
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
</script>

<template>
  <div panel>
    <div
      flex="~ col items-center gap-2"
      children:flex="~ gap-2"
      text-sm m-4 children:w-full children-of-hidden
    >
      <div p-2 bd rd icon-text>
        <div i-carbon:search />
        <input
          v-model="query" maxlength="36"
          type="text" placeholder="Search..."
          ipt @input="length = delta"
        >
      </div>
      <button
        v-for="[name, item] in filtered.slice(0, length)"
        :key="name" :title="name"
        bd bg-hex-8884 bg-op-36 btn-md active:bg-op-12
        hover:bg-op-24 icon-text
        @click="show(name)"
      >
        <div :class="playState.icon(item)" />
        <div op-80 shrink-1 truncate v-text="name" />
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
