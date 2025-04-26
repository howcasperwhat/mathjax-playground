<script setup lang="ts">
const code = ref(`\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}`)
useStorage('code', code)
</script>

<template>
  <ToolBar w-16 />
  <main
    flex="~ col gap-4"
    w="[calc(100vw-7rem)]"
    h="[calc(100vh-2rem)]"
  >
    <MathJax :tex="code" />
    <MonacoEditor v-model="code" />
  </main>
</template>
