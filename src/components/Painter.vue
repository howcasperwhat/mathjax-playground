<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:box @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush-alt @click="playState.tool = ToolType.Pen" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush @click="playState.tool = ToolType.Brush" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:erase @click="playState.tool = ToolType.Eraser" />
  </button>
</template>
