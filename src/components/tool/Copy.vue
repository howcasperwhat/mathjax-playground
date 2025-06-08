<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:copy />
  </button>
  <button v-show="show" v-tooltip.right="'Copy PNG To Clipboard'" icon-btn>
    <div i-carbon:png @click="appState.copy('png')" />
  </button>
  <button v-show="show" v-tooltip.right="'Copy SVG To Clipboard'" icon-btn>
    <div i-carbon:svg @click="appState.copy('svg')" />
  </button>
</template>
