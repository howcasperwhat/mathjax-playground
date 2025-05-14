<script setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const anyway = ref(false)
const show = computed(() => {
  return !anyway.value && !breakpoints.sm.value
})
</script>

<template>
  <div
    v-show="show"
    flex="~ col items-center justify-center"
    p-8 bg-neutral bg-op-4 h-full w-full
    inset-0 bottom-0 left-0 right-0 top-0 fixed
    backdrop-blur-8
  >
    <h1 text-2xl op-80>
      Mobile is Not Supported
    </h1>
    <p m-y-2 text-center op-60>
      The layout is not optimized for mobile devices.
      <br>
      Please use a desktop browser or wider screen.
    </p>
    <button
      op="60 hover:80"
      m-t-8 bd rd btn-sm hover:bg-stone:20 icon-text
      @click="anyway = true"
    >
      <div i-carbon:windy-strong />
      Use It Anyway
    </button>
  </div>
</template>
