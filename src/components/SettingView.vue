<template>
  <div
    flex="~ col gap-4"
    children:flex="~ items-center gap-3"
  >
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <ColorPicker v-model="playState.color.pen" :opacity="playState.opacity.pen" />
      <OpacityPicker v-model="playState.opacity.pen" />
      <input v-model="playState.color.pen" font-mono ipt-sm bd w="[calc(8ch+.5rem)]">
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <ColorPicker v-model="playState.color.brush" :opacity="playState.opacity.brush" />
      <OpacityPicker v-model="playState.opacity.brush" />
      <input v-model="playState.color.brush" font-mono ipt-sm bd w="[calc(8ch+.5rem)]">
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <ColorPicker v-model="playState.color.global" :opacity="playState.opacity.global" />
      <OpacityPicker v-model="playState.opacity.global" />
      <input v-model="playState.color.global" font-mono ipt-sm bd w="[calc(8ch+.5rem)]">
    </div>
  </div>
</template>
