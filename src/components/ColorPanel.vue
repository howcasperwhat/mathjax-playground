<template>
  <div
    flex="~ gap-4 wrap"
    children:flex="~ items-center gap-2"
  >
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <ColorPicker v-model="state.color.pen" :opacity="state.opacity.pen" />
      <OpacityPicker v-model="state.opacity.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <ColorPicker v-model="state.color.brush" :opacity="state.opacity.brush" />
      <OpacityPicker v-model="state.opacity.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <ColorPicker v-model="state.color.global" :opacity="state.opacity.global" />
      <OpacityPicker v-model="state.opacity.global" />
    </div>
  </div>
</template>
