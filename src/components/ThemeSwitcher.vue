<script setup lang="ts">
import { toggleTheme } from '~/composables'
</script>

<template>
  <button toggle-btn @click="toggleTheme">
    <div i-carbon:sun dark:i-carbon:moon />
  </button>
</template>
