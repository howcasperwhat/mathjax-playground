<script setup lang='ts'>
import { art } from '~/composables/artwork';
</script>

<template>
  <button icon-btn>
    <div i-carbon:copy @click="art.copy('png')" />
  </button>
</template>
