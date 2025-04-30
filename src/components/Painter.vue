<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:box @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush-alt @click="art.switchTool('pen')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush @click="art.switchTool('brush')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:erase @click="art.switchTool('eraser')" />
  </button>
</template>
