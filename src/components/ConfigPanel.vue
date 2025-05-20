<script setup lang='ts'>
import ColorPanel from './ColorPanel.vue'
import MemoryPanel from './MemoryPanel.vue'

interface UIData {
  icon: string
  component: Component
}

const data: Record<string, UIData> = {
  memory: {
    icon: 'i-carbon:ibm-knowledge-catalog',
    component: MemoryPanel,
  },
  color: {
    icon: 'i-carbon:color-palette',
    component: ColorPanel,
  },
}

const active = ref(Object.keys(data).at(0)!)
</script>

<template>
  <div
    flex="~ col gap-4"
    p-y-4 bd rd-xl h-full shadow children:p-x-4
  >
    <TabState
      :names="Object.keys(data)" :active
      h-8 @switch="name => active = name"
    >
      <template
        v-for="[key, value] in Object.entries(data)"
        :key="key" #[key]
      >
        <div :class="value.icon" />
      </template>
    </TabState>
    <div
      text-sm m-l-2 rd-full op-75 h-4 w-max
      v-text="active.toUpperCase()"
    />
    <component :is="data[active].component" />
  </div>
</template>
