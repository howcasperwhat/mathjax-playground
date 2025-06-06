<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:download />
  </button>
  <button v-show="show" v-tooltip.right="'Download PNG'" icon-btn>
    <div i-carbon:png @click="appState.download('png')" />
  </button>
  <button v-show="show" v-tooltip.right="'Download SVG'" icon-btn>
    <div i-carbon:svg @click="appState.download('svg')" />
  </button>
</template>
