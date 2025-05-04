<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:copy @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:png @click="playState.copy('png')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:svg @click="playState.copy('svg')" />
  </button>
</template>
