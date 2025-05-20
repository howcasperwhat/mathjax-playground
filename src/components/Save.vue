<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:save />
  </button>
  <div v-show="show" flex="~ col gap-4">
    <button
      v-tooltip.right="'Save As TEX'" icon-btn
      @click="playState.save('tex')"
    >
      <div i:tex />
    </button>
    <button
      v-tooltip.right="'Save As SVG'" icon-btn
      @click="playState.save('svg')"
    >
      <div i:svg />
    </button>
    <button
      v-tooltip.right="'Save As Workspace'" icon-btn
      @click="playState.save('workspace')"
    >
      <div i:workspace />
    </button>
  </div>
</template>
