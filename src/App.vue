<script setup lang="ts">
const perc = ref({
  x: 72,
  l: 32,
  r: 32,
})
useLocalStorage(`${APP_NAME}_perc`, perc)
</script>

<template>
  <div flex="~ gap-4" lt-sm:hidden>
    <ToolBar w-16 />
    <div flex="~ col" w="[calc(100vw-7rem)]">
      <Resizable v-model="perc.x" dir="x" h="[calc(100vh-2rem)]" flex>
        <template #start="lprops">
          <MainPanel h-full :style="lprops.style" />
        </template>
        <template #end="rprops">
          <ConfigPanel h-full :style="rprops.style" />
        </template>
      </Resizable>
    </div>
  </div>
  <div
    flex="~ items-center justify-center"
    h-full w-full sm:hidden
  >
    This app is not supported on mobile devices. Please try with a bigger screen.
  </div>
</template>
