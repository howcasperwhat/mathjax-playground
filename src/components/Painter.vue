<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:box />
  </button>
  <div v-show="show" flex="~ col gap-4">
    <button v-tooltip.right="'pen'" icon-btn>
      <div i-carbon:paint-brush-alt @click="playState.tool = ToolType.Pen" />
    </button>
    <button v-tooltip.right="'brush'" icon-btn>
      <div i-carbon:paint-brush @click="playState.tool = ToolType.Brush" />
    </button>
    <button v-tooltip.right="'eraser'" icon-btn>
      <div i-carbon:erase @click="playState.tool = ToolType.Eraser" />
    </button>
  </div>
</template>
