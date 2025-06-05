<script setup lang="ts">
</script>

<template>
  <div
    flex="~ col gap-4"
    children:flex="~ items-center gap-3"
  >
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <Colorist v-model="playState.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <Colorist v-model="playState.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <Colorist v-model="playState.global" />
    </div>
  </div>
</template>
