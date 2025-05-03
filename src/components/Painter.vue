<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:box @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush-alt @click="state.tool = ToolType.Pen" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush @click="state.tool = ToolType.Brush" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:erase @click="state.tool = ToolType.Eraser" />
  </button>
</template>
