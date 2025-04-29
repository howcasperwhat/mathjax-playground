<script setup lang='ts'>

</script>

<template>
  <div
    p-y-4
    flex="~ gap-4 wrap"
    children:flex="~ items-center gap-2"
  >
    <div>
      <div i-carbon:pen c-gray />
      <ColorPicker v-model="art.color.pen" />
      <OpacityPicker v-model="art.opacity.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <ColorPicker v-model="art.color.brush" />
      <OpacityPicker v-model="art.opacity.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <ColorPicker v-model="art.color.global" />
      <OpacityPicker v-model="art.opacity.global" />
    </div>
  </div>
</template>
