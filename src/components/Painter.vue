<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button v-tooltip.right="'toggle'" toggle-btn>
    <div i-carbon:box @click="show = !show" />
  </button>
  <button v-show="show" v-tooltip.right="'pen'" icon-btn>
    <div i-carbon:paint-brush-alt @click="playState.tool = ToolType.Pen" />
  </button>
  <button v-show="show" v-tooltip.right="'brush'" icon-btn>
    <div i-carbon:paint-brush @click="playState.tool = ToolType.Brush" />
  </button>
  <button v-show="show" v-tooltip.right="'eraser'" icon-btn>
    <div i-carbon:erase @click="playState.tool = ToolType.Eraser" />
  </button>
</template>
