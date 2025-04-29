<script setup lang='ts'>
const active = ref(true)
function getClass() {
  return active.value
    ? 'c-green b-green op-80'
    : 'c-gray b-gray op-50'
}
</script>

<template>
  <div
    p-y-4 w-full
    flex="~ col items-center gap-4"
  >
    <div
      flex="~ items-center gap-2"
      w-full
    >
      <input
        placeholder="Save Name"
        p-x-2 p-y-1 w="3/5"
        b="1px gray solid op-24"
        maxlength="20"
        focus:outline-unset
        @v-model="art.name"
      >
      <button

        b="1px solid op-24" w="2/5"
        flex="~ items-center gap-2"
        p-x-2 p-y-1 whitespace-nowrap of-hidden btn
        :class="getClass()"
        @click="active = !active"
      >
        <div i-carbon:function />
        <div m-a>
          Save Preview
        </div>
      </button>
    </div>
    <div
      flex="~ items-center justify-center gap-2"
      children:btn children:text-sm
    >
      <button

        b="1px solid gray op-24"
        text-white p-x-2 p-y-1 rounded bg-gray-700
      >
        Reset
      </button>
      <button

        b="1px solid gray op-24"
        text-white p-x-2 p-y-1 rounded bg-teal-700
      >
        Save
      </button>
    </div>
  </div>
</template>
