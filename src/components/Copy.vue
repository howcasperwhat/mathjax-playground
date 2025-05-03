<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:copy @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:png @click="state.copy('png')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:svg @click="state.copy('svg')" />
  </button>
</template>
