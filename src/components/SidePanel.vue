<script setup lang='ts'>
import MemoryView from './MemoryView.vue'
import SettingView from './SettingView.vue'

interface UIData {
  icon: string
  component: Component
}

const data: Record<string, UIData> = {
  storage: {
    icon: 'i-carbon:block-storage',
    component: MemoryView,
  },
  setting: {
    icon: 'i-carbon:settings',
    component: SettingView,
  },
}

const active = ref(Object.keys(data).at(0)!)
</script>

<template>
  <div
    flex="~ col gap-4"
    py-4 bd rd-xl h-full shadow children:px-4
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
      text-sm ml-2 rd-full op-75 h-4 w-max
      v-text="active.toUpperCase()"
    />
    <component :is="data[active].component" />
  </div>
</template>
