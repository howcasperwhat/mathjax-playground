<script setup lang='ts'>
const content = defineModel({ required: true })
</script>

<template>
  <button
    bd bg-hex-8882 btn-sm icon-text
  >
    <div i-carbon:3d-mpr-toggle />
    <input
      v-model="content"
      placeholder="Name"
      maxlength="20"
      ipt-sm bd
    >
  </button>
</template>

<style scoped>

</style>
