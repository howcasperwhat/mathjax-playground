<script setup lang="ts">
const tex = computed({
  get: () => art.tex.value,
  set: v => art.tex.value = v,
})
useStorage('tex', tex)
</script>

<template>
  <ToolBar w-16 />
  <Resizable dir="x" h="[calc(100vh-2rem)]" w="[calc(100vw-7rem)]" flex :perc="68">
    <template #start="lprops">
      <Resizable dir="y" flex="~ col" h-full :style="lprops.style" :perc="36">
        <template #start="tprops">
          <MathJaxPreview :tex="tex" :style="tprops.style" />
        </template>
        <template #end="bprops">
          <MonacoEditor v-model="tex" :style="bprops.style" />
        </template>
      </Resizable>
    </template>
    <template #end="rprops">
      <Resizable dir="y" flex="~ col" h-full :style="rprops.style" :perc="24">
        <template #start="tprops">
          <ConfigPanel :style="tprops.style" />
        </template>
        <template #end="bprops">
          <HistoryPanel :style="bprops.style" />
        </template>
      </Resizable>
    </template>
  </Resizable>
</template>
