<script setup lang='ts'>
import { art } from '~/composables/artwork'

const show = ref(true)
</script>

<template>
  <button toggle-btn>
    <div i-carbon:save @click="show = !show" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:code @click="art.save('code')" />
  </button>
  <button v-show="show" icon-btn>
    <div i-carbon:function @click="art.save('preview')" />
  </button>
</template>
