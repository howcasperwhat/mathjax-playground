<script setup lang="ts">
const pen = appState.pen.props
const brush = appState.brush.props
const global = appState.global.props
</script>

<template>
  <div
    flex="~ col gap-4" text-sm
    children:flex="~ items-center gap-3"
    children:children:shrink-0
  >
    <TitledSep title="Color Settings" />
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <Colorist v-model="pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <Colorist v-model="brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <Colorist v-model="global" />
    </div>
    <TitledSep title="Picture Scale" />
    <PicScale />
  </div>
</template>
