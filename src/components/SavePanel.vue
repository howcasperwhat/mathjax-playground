<script setup lang='ts'>
const active = ref(true)

const name = computed({
  get: () => playState.name,
  set: v => playState.name = v,
})

function getClass() {
  return active.value
    ? 'c-green b-green op-80'
    : 'c-gray b-gray op-50'
}
</script>

<template>
  <div
    flex="~ col gap-4"
    children:flex="~ items-center gap-2 wrap"
  >
    <div>
      <input
        v-model="name"
        placeholder="Name"
        maxlength="20" ipt-sm
        bd
      >
      <button
        bd btn-sm icon-text
        :class="getClass()"
        @click="active = !active"
      >
        <div i-carbon:function />
        Preview
      </button>
    </div>
    <div text-sm text-white children:btn-sm>
      <button bg-gray-700 @click="name = ''">
        Reset
      </button>
      <button bg-teal-700 @click="playState.save(active)">
        Save
      </button>
    </div>
  </div>
</template>
