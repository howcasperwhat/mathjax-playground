<script setup lang='ts'>
import ColorPanel from './ColorPanel.vue'
import SavePanel from './SavePanel.vue'

interface UIData {
  icon: string
  component: Component
}

const data: Record<string, UIData> = {
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
  <div of-auto>
    <div flex="~ col gap-4" text-sm m-4>
      <TabState
        :names="Object.keys(data)" :active
        @switch="name => active = name"
      >
        <template
          v-for="[key, value] in Object.entries(data)"
          :key="key" #[key]
        >
          <div :class="value.icon" />
          {{ key.charAt(0).toUpperCase() + key.slice(1) }}
        </template>
      </TabState>
      <component :is="data[active].component" />
    </div>
  </div>
</template>
