<script setup lang='ts'>
</script>

<template>
  <nav
    p-x-2 p-y-4 rd-4 bg-gray bg-op-8
    b="1px solid gray op-24" h-max
    grid="~ flow-row items-center justify-center gap-4"
    children:flex="~ items-center justify-center"
  >
    <Logo />
    <hr c-gray op-24>
    <ThemeSwitch />
    <Painter />
    <hr c-gray op-24>
    <Copy />
    <Save />
  </nav>
</template>
