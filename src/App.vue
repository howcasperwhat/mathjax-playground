<script setup lang="ts">
const perc = ref(72)
useLocalStorage(`${APP_NAME}_perc`, perc)
</script>

<template>
  <div flex="~ gap-4">
    <ToolBar w-16 />
    <div flex="~ col" w="[calc(100vw-7rem)]">
      <Resizable
        v-model="perc" dir="x"
        :min="20" :max="80"
        h="[calc(100vh-2rem)]" flex
      >
        <template #start="lprops">
          <MainPanel h-full :style="lprops.style" />
        </template>
        <template #end="rprops">
          <ConfigPanel h-full :style="rprops.style" />
        </template>
      </Resizable>
    </div>
  </div>
  <NoMobile />
</template>
