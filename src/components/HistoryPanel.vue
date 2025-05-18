<script setup lang='ts'>
const delta = 20
const length = ref(delta)
const query = ref('')
const el = ref<HTMLInputElement | null>(null)

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
  <div flex="~ col gap-2" of-auto>
    <div flex="~ items-center gap-2" shrink-0 z-1 bg-base>
      <button bd rd-full flex shrink-0 h-8 w-8>
        <div i-carbon:add text-lg m-a />
      </button>
      <label
        flex="~ items-center gap-1"
        focus-within="w-60"
        :class="query ? 'w-60' : 'w-8'"
        p-1.5 bd rd-full h-8 w-8 transition-width duration-300 of-hidden
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
