<script setup lang='ts'>
import { art } from '~/composables/artwork'

const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:box @click="show = !show" />
  </button>
  <ColorPicker v-show="show" v-model="art.pigment.value" />
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush-alt @click="art.switchTool('paint')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:paint-brush @click="art.switchTool('brush')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:erase @click="art.switchTool('eraser')" />
  </button>
</template>
