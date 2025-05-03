<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:download @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:png @click="state.download('png')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:svg @click="state.download('svg')" />
  </button>
</template>
