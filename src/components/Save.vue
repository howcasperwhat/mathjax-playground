<script setup lang='ts'>
import { art } from '~/composables/artwork';
</script>

<template>
  <button icon-btn>
    <div i-carbon:save @click="art.save('png')" />
  </button>
</template>
