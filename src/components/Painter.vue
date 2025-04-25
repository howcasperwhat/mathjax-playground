<script setup lang='ts'>
import { art } from '~/composables/artwork';
</script>

<template>
  <button icon-btn>
    <div i-carbon:paint-brush-alt @click="art.switchTool('paint')" />
  </button>
</template>
