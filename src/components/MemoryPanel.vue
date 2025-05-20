<script setup lang='ts'>
const delta = 20
const length = ref(delta)
const query = ref('')
const queryElement = useTemplateRef<HTMLInputElement>('queryElement')

const filtered = computed(() => {
  const reversed = Object.entries(playState.memory.value).reverse()
  if (!query.value)
    return reversed
  return reversed.filter(
    ([name, _]) => name.toLowerCase().includes(
      query.value.toLowerCase(),
    ),
  )
})

const editing = ref(false)
const deleting = ref(false)
</script>

<template>
  <div flex="~ col gap-2" of-auto>
    <div
      flex="~ items-center gap-2"
      p-b-2 shrink-0 top-0 sticky
      z-1 bg-base
    >
      <button
        v-tooltip.top="'Add New Item'"
        bd rd-full flex shrink-0
        h-8 w-8 children:text-lg
        children:m-a hover:bg-stone:8 btn
        :class="editing ? 'bg-teal:80 hover:bg-teal:60!' : ''"
        @click="editing = !editing, deleting = false"
      >
        <div v-if="editing" i-carbon:subtract />
        <div v-else i-carbon:add />
      </button>
      <button
        v-tooltip.top="'Delete State'"
        bd rd-full flex shrink-0
        h-8 w-8 children:text-lg
        children:m-a hover:bg-stone:8 btn
        :class="deleting ? 'bg-red:80 hover:bg-red:60!' : ''"
        @click="deleting = !deleting, editing = false"
      >
        <div v-if="deleting" i-carbon:checkmark />
        <div v-else i-carbon:trash-can />
      </button>
      <label
        flex="~ items-center gap-1"
        focus-within="w-60" p-1.5 bd
        rd-full h-8 transition-width
        duration-300 of-hidden
        :class="query ? 'w-60' : 'w-8'"
      >
        <div i-carbon:search shrink-0 />
        <input
          ref="queryElement"
          v-model="query" maxlength="36"
          type="text" placeholder="Search..."
          ipt w-full @input="length = delta"
        >
        <button
          rd-full flex shrink-0
          h-6 w-6 color-base btn
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
      <MemoryProvider v-show="editing" v-model="editing" p-2 />
      <MemoryButton
        v-for="[name, item] in filtered.slice(0, length)"
        :key="name" :name :item :deleting
      />
      <button
        v-if="filtered.length > length"
        text-stone p-x-2 p-y-1 w-max btn
        op="80 hover:100"
        @click="length += delta"
      >
        <div v-text="'Load More'" />
      </button>
    </div>
  </div>
</template>
