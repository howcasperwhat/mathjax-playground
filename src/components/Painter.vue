<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:box />
  </button>
  <div v-show="show" flex="~ col gap-4">
    <button
      v-tooltip.right="'pen'" icon-btn
      :class="playState.tool === ToolType.Pen ? 'c-blue' : ''"
      @click="playState.tool = ToolType.Pen"
    >
      <div i-carbon:paint-brush-alt />
    </button>
    <button
      v-tooltip.right="'brush'" icon-btn
      :class="playState.tool === ToolType.Brush ? 'c-blue' : ''"
      @click="playState.tool = ToolType.Brush"
    >
      <div i-carbon:paint-brush />
    </button>
    <button
      v-tooltip.right="'eraser'" icon-btn
      :class="playState.tool === ToolType.Eraser ? 'c-blue' : ''"
      @click="playState.tool = ToolType.Eraser"
    >
      <div i-carbon:erase />
    </button>
  </div>
</template>
