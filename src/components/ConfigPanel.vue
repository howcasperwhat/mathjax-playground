<script setup lang='ts'>
const active = ref('color')
function setActive(name: string) {
  active.value = name
}
</script>

<template>
  <div
    b="1px solid gray op-24"
    p-4 rounded bg-gray bg-op-8 of-auto
    flex="~ col"
  >
    <Tabbar :names="['color', 'save']" @switch="setActive">
      <template #color>
        <div flex="~ items-center gap-2">
          <div i-carbon:color-palette />
          <div v-show="true">
            Color
          </div>
        </div>
      </template>
      <template #save>
        <div flex="~ items-center gap-2">
          <div i-carbon:save />
          <div v-show="true">
            Save
          </div>
        </div>
      </template>
    </Tabbar>
    <ColorPanel v-if="active === 'color'" />
    <SavePanel v-if="active === 'save'" />
  </div>
</template>
