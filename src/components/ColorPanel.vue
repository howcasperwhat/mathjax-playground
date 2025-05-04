<template>
  <div
    flex="~ gap-4 wrap"
    children:flex="~ items-center gap-2"
  >
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <ColorPicker v-model="playState.color.pen" :opacity="playState.opacity.pen" />
      <OpacityPicker v-model="playState.opacity.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <ColorPicker v-model="playState.color.brush" :opacity="playState.opacity.brush" />
      <OpacityPicker v-model="playState.opacity.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <ColorPicker v-model="playState.color.global" :opacity="playState.opacity.global" />
      <OpacityPicker v-model="playState.opacity.global" />
    </div>
  </div>
</template>
