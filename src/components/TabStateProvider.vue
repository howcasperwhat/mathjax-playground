<script setup lang='ts'>
const content = defineModel({ required: true })
</script>

<template>
  <button
    bd bg-hex-8882 btn-sm icon-text
  >
    <div i-carbon:code />
    <input
      v-model="content"
      placeholder="Name"
      :maxlength="NAME_MAX_LENGTH"
      ipt-sm bd
    >
  </button>
</template>
