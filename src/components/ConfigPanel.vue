<script setup lang='ts'>
import ColorPanel from './ColorPanel.vue'
import SavePanel from './SavePanel.vue'

const active = ref('color')

function setActive(name: string) {
  active.value = name
}

interface UIData {
  icon: string
  component: Component
}

const data: Record<string, UIData> = {
  color: {
    icon: 'i-carbon:color-palette',
    component: ColorPanel,
  },
  save: {
    icon: 'i-carbon:save',
    component: SavePanel,
  },
}
</script>

<template>
  <div panel>
    <div flex="~ col gap-4" m-4>
      <TabState :names="Object.keys(data)" @switch="setActive">
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
