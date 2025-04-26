<script setup lang='ts'>
import { art } from '~/composables/artwork'

const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:download @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:png @click="art.download('png')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:svg @click="art.download('svg')" />
  </button>
</template>
