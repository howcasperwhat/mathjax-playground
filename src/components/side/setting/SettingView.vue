<template>
  <div
    flex="~ col gap-4" text-sm
    children:flex="~ items-center gap-3"
    children:children:shrink-0
  >
    <TitledSep title="Color Settings" />
    <div>
      <div i-carbon:paint-brush-alt c-gray />
      <Colorist v-model="appState.pen" />
    </div>
    <div>
      <div i-carbon:paint-brush c-gray />
      <Colorist v-model="appState.brush" />
    </div>
    <div>
      <div i-carbon:color-palette c-gray />
      <Colorist v-model="appState.global" />
    </div>
    <TitledSep title="Picture Scale" />
    <PicScale />
  </div>
</template>
