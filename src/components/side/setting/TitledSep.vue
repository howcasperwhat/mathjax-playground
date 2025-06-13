<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div flex="~ items-center" w-full select-none>
    <div bg-neutral:50 h-1px w-2 />
    <span text="sm neutral:50">{{ title }}</span>
    <div bg-neutral:50 flex-1 h-1px />
  </div>
</template>
