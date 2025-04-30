<script setup lang='ts'>
const MAX_LENGTH = 20
const saved = computed(() =>
  Object.entries(art.memory.value).map(([key, value]) => ({
    content: key,
    preview: Boolean(value.preview),
  })),
)
const preshowing = ref(false)
function preshow(tex: string) {
  preshowing.value = true
  art.preShow(tex)
}
function confirm() {
  preshowing.value = false
  art.confirmShow()
}
function cancel() {
  preshowing.value = false
  art.cancelShow()
}
function remove() {
  preshowing.value = false
  art.removeShow()
}
</script>

<template>
  <div panel>
    <div
      flex="~ col items-center gap-2" m-4
      children:flex="~ items-center gap-2"
      w-full children:w-full children-of-hidden
    >
      <div p-2 bd rd icon-text>
        <div i-carbon:search />
        <input ipt type="text" placeholder="Search...">
      </div>
      <button
        v-for="tex, _ in saved.slice(0, MAX_LENGTH)" :key="_"
        :disabled="preshowing"
        bd bg-hex-8884 bg-op-36 btn-md active:bg-op-12 hover:bg-op-24 icon-text
        @click="preshow(tex.content)"
      >
        <div v-if="tex.preview" i-carbon:function />
        <div v-else i-carbon:code />
        <div v-text="tex.content.slice(0, 20)" />
      </button>
      <div v-if="saved.length > MAX_LENGTH" c-gray>
        <span v-text="`...${saved.length - MAX_LENGTH} more`" />
      </div>
    </div>
    <div
      v-show="preshowing"
      flex="~ items-center gap-2 justify-between "
      text-sm w-full bottom-0 left-0 sticky z-10
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
