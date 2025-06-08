<template>
  <button v-tooltip.bottom="'Toggle Theme'" toggle-btn @click="toggleTheme">
    <div i-carbon:sun dark:i-carbon:moon />
  </button>
</template>
