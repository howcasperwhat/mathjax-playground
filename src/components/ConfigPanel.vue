<script setup lang='ts'>
import ColorPanel from './ColorPanel.vue'
import HistoryPanel from './HistoryPanel.vue'
import SavePanel from './SavePanel.vue'

interface UIData {
  icon: string
  component: Component
}

const data: Record<string, UIData> = {
  history: {
    icon: 'i-carbon:ibm-knowledge-catalog',
    component: HistoryPanel,
  },
  save: {
    icon: 'i-carbon:save',
    component: SavePanel,
  },
  color: {
    icon: 'i-carbon:color-palette',
    component: ColorPanel,
  },
}

const active = ref(Object.keys(data).at(0)!)
</script>

<template>
  <div bd rd-xl of-auto>
    <div flex="~ col gap-4" m-4>
      <TabState
        :names="Object.keys(data)" :active
        @switch="name => active = name"
      >
        <template
          v-for="[key, value] in Object.entries(data)"
          :key="key" #[key]
        >
          <div :class="value.icon" />
        </template>
      </TabState>
      <div text-sm m-l-2 rd-full op-75 w-max v-text="active.toUpperCase()" />
      <component :is="data[active].component" />
    </div>
  </div>
</template>
