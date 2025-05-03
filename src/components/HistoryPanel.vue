<script setup lang='ts'>
const delta = 20
const length = ref(delta)
const query = ref('')
const preshowing = ref(false)

const saved = computed(() =>
  Object.entries(state.memory.value).map(([key, value]) => ({
    content: key,
    preview: Boolean(value.preview),
  })),
)
const filtered = computed(() => {
  if (!query.value)
    return saved.value
  return saved.value.filter(tex =>
    tex.content.toLowerCase().includes(query.value.toLowerCase()),
  )
})
function preshow(tex: string) {
  preshowing.value = true
  state.preShow(tex)
}
function confirm() {
  preshowing.value = false
  state.confirmShow()
}
function cancel() {
  preshowing.value = false
  state.cancelShow()
}
function remove() {
  preshowing.value = false
  state.removeShow()
}
</script>

<template>
  <div panel>
    <div
      flex="~ col items-center gap-2" m-4
      children:flex="~ gap-2"
      children:w-full children-of-hidden
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
        v-for="tex, _ in filtered.slice(0, length)" :key="_"
        :disabled="preshowing"
        bd bg-hex-8884 bg-op-36 btn-md active:bg-op-12
        hover:bg-op-24 icon-text
        @click="preshow(tex.content)"
      >
        <div v-if="tex.preview" i-carbon:function />
        <div v-else i-carbon:code />
        <div v-text="tex.content.slice(0, 20)" />
      </button>
      <button
        v-if="filtered.length > length"
        :disabled="preshowing"
        text-gray bd b-op-80 op-40 w-max btn-sm active:op-80
        hover:op-60 disabled:important-op-20
        @click="length += delta"
      >
        <div v-text="'Load More'" />
      </button>
    </div>
    <div
      v-show="preshowing"
      flex="~ items-center gap-2 justify-between "
      text-sm m-x-4 bottom-4 left-0 sticky z-10
    >
      <div flex="~ items-center gap-2">
        <button text-white bg-yellow-700 btn-sm @click="remove">
          Remove
        </button>
      </div>
      <div flex="~ items-center gap-2" children:btn-sm>
        <button text-white bg-teal-700 @click="confirm">
          Confirm
        </button>
        <button text-white bg-gray-700 @click="cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
