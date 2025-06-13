<script setup lang='ts'>
const show = ref(true)
const message = useMessage()
function copy(type: 'png' | 'svg') {
  appState.copy(type)
  message.success(`Copied ${type.toUpperCase()} to clipboard`)
}
</script>

<template>
  <button toggle-btn @click="show = !show">
    <div i-carbon:copy />
  </button>
  <button v-show="show" v-tooltip.right="'Copy PNG To Clipboard'" icon-btn>
    <div i-carbon:png @click="copy('png')" />
  </button>
  <button v-show="show" v-tooltip.right="'Copy SVG To Clipboard'" icon-btn>
    <div i-carbon:svg @click="copy('svg')" />
  </button>
</template>
