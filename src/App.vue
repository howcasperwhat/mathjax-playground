<script setup lang="ts">
const code = ref(`\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}`)
const leftRateY = ref(32)
const rightRateY = ref(50)
const RateX = ref(68)
useStorage('code', code)
</script>

<template>
  <ToolBar w-16 />
  <div h="[calc(100vh-2rem)]" w="[calc(100vw-7rem)]" flex>
    <div flex="~ col" h-full :style="{ width: `${RateX}%` }">
      <MathJax :tex="code" :style="{ height: `${leftRateY}%` }" />
      <YResizable @rate="r => leftRateY = r * 100" />
      <MonacoEditor v-model="code" :style="{ height: `${100 - leftRateY}%` }" />
    </div>
    <XResizable @rate="r => RateX = r * 100" />
    <div flex="~ col" h-full :style="{ width: `${100 - RateX}%` }">
      <ColorTabbar :style="{ height: `${rightRateY}%` }" />
      <YResizable @rate="r => rightRateY = r * 100" />
      <CodeHistory :style="{ height: `${100 - rightRateY}%` }" />
    </div>
  </div>
</template>
