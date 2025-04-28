<script setup lang="ts">
import { toggleTheme } from '~/composables'

const github = 'https://github.com/howcasperwhat/mathjax-playground'
</script>

<template>
  <a :href="github" target="_blank" toggle-btn>
    <div i-carbon:logo-github />
  </a>
  <button toggle-btn @click="toggleTheme">
    <div i-carbon:sun dark:i-carbon:moon />
  </button>
</template>
