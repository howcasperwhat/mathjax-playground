<script setup lang="ts">
const tex = computed({
  get: () => playState.tex,
  set: v => playState.tex = v,
})
const names = [
  'Einston',
  'Gauss',
  'Newton',
]
useStorage('tex', tex)
</script>

<template>
  <div flex="~ gap-4">
    <ToolBar w-16 />
    <div flex="~ col gap-4" w="[calc(100vw-7rem)]">
      <EditorTabState :names h-8 />
      <Resizable dir="x" h="[calc(100vh-5rem)]" flex :perc="68">
        <template #start="lprops">
          <Resizable dir="y" flex="~ col" h-full :style="lprops.style" :perc="36">
            <template #start="tprops">
              <MathJaxEditor :tex="tex" :style="tprops.style" />
            </template>
            <template #end="bprops">
              <MonacoEditor v-model="tex" :style="bprops.style" />
            </template>
          </Resizable>
        </template>
        <template #end="rprops">
          <Resizable dir="y" flex="~ col" h-full :style="rprops.style" :perc="26">
            <template #start="tprops">
              <ConfigPanel :style="tprops.style" />
            </template>
            <template #end="bprops">
              <HistoryPanel :style="bprops.style" />
            </template>
          </Resizable>
        </template>
      </Resizable>
    </div>
  </div>
</template>
