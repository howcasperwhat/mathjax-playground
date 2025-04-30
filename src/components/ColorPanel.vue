<template>
  <div
    flex="~ gap-4 wrap"
    children:flex="~ items-center gap-2"
  >
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <ColorPicker v-model="art.color.pen" :opacity="art.opacity.pen" />
      <OpacityPicker v-model="art.opacity.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <ColorPicker v-model="art.color.brush" :opacity="art.opacity.brush" />
      <OpacityPicker v-model="art.opacity.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <ColorPicker v-model="art.color.global" :opacity="art.opacity.global" />
      <OpacityPicker v-model="art.opacity.global" />
    </div>
  </div>
</template>
