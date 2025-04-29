<script setup lang='ts'>
const MAX_LENGTH = 20
const saved = computed(() =>
  Object.keys(art.memory.value).map(key => ({
    tex: key,
    preview: !!art.memory.value[key].preview,
  })),
)
const preshowing = ref(false)
function preshow(tex: string) {
  // eslint-disable-next-line no-console
  console.log('preshow', tex)
  preshowing.value = true
  // art.preview(tex)
}
function confirm() {
  preshowing.value = false
  // art.save(tex)
}
function cancel() {
  preshowing.value = false
  // art.cancel()
}
function getUsage() {
  const usage = Object.entries(art.memory.value).reduce((acc, [key, value]) => {
    return acc + key.length + value.tex.length + (value.preview?.length ?? 0)
  }, 0)
  return usage / art.MAX_SIZE
}
function getClass() {
  const rate = getUsage()
  if (rate < 0.4)
    return 'bg-green-400 dark:bg-green-600'
  if (rate < 0.6)
    return 'bg-yellow-400 dark:bg-yellow-600'
  if (rate < 0.8)
    return 'bg-orange-400 dark:bg-orange-600'
  return 'bg-red-400 dark:bg-red-600'
}
</script>

<template>
  <div
    rounded bg-gray bg-op-8 of-auto
    b="1px solid gray op-24"
  >
    <div h-2 w-full left-0 top-0 sticky z-10>
      <div bg-gray bg-op-20 h-full w-full>
        <div bg-op-80 h-full :class="getClass()" :style="{ width: `${getUsage() * 100}%` }" />
      </div>
    </div>
    <div
      flex="~ col items-center gap-2"
      children:flex="~ items-center gap-2"
      p-4 w-full children:p-2 children:w-full
    >
      <div b="1px solid gray op-24" rounded>
        <div i-carbon:search />
        <input
          type="text" placeholder="Search..."
          h-full w-full focus:outline-unset
        >
      </div>
      <button
        v-for="tex, _ in saved.slice(0, MAX_LENGTH)" :key="_"
        :disabled="preshowing"
        b="1px solid gray op-24"
        rounded bg-hex-8884 bg-op-36 whitespace-nowrap of-hidden btn active:bg-op-12 hover:bg-op-24 @click="preshow(tex.tex)"
      >
        <div v-if="tex.preview" i-carbon:function />
        <div v-else i-carbon:code />
        <div v-text="tex.tex.slice(0, 20)" />
      </button>
      <div v-if="saved.length > MAX_LENGTH" c-gray>
        <span v-text="`...${saved.length - MAX_LENGTH} more`" />
      </div>
    </div>
    <div
      v-show="preshowing"
      flex="~ items-center justify-between gap-2"
      text-sm p-4 shrink-0 w-full bottom-0 left-0 sticky z-10
    >
      <div
        flex="~ items-center gap-2"
      >
        <button
          text-white p-x-2 p-y-1 rounded bg-red btn
          @click="1"
        >
          Delete
        </button>
      </div>
      <div
        flex="~ items-center gap-2"
      >
        <button
          text-white p-x-2 p-y-1 rounded bg-teal-700 btn
          @click="confirm"
        >
          Confirm
        </button>
        <button
          text-white
          p-x-2 p-y-1 rounded bg-gray-700 btn @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
