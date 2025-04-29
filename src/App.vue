<script setup lang="ts">
const leftRateY = ref(36)
const rightRateY = ref(24)
const RateX = ref(68)
const tex = computed({
  get: () => art.tex.value,
  set: v => art.tex.value = v,
})
useStorage('tex', tex)
</script>

<template>
  <ToolBar w-16 />
  <div h="[calc(100vh-2rem)]" w="[calc(100vw-7rem)]" flex>
    <div flex="~ col" h-full :style="{ width: `${RateX}%` }">
      <MathJax :tex="tex" :style="{ height: `${leftRateY}%` }" />
      <YResizable @rate="r => leftRateY = r * 100" />
      <MonacoEditor v-model="tex" :style="{ height: `${100 - leftRateY}%` }" />
    </div>
    <XResizable @rate="r => RateX = r * 100" />
    <div flex="~ col" h-full :style="{ width: `${100 - RateX}%` }">
      <ConfigPanel :style="{ height: `${rightRateY}%` }" />
      <YResizable @rate="r => rightRateY = r * 100" />
      <HistoryPanel :style="{ height: `${100 - rightRateY}%` }" />
    </div>
  </div>
</template>
