<script setup lang='ts'>
</script>

<template>
  <div
    p-x-2 p-y-4 rd-4 bg-gray bg-op-8 h-max of-auto
    max-h="[calc(100vh-2rem)]"
    b="1px solid gray op-24"
    grid="~ flow-row items-center justify-center gap-4"
    children:flex="~ items-center justify-center"
  >
    <Logo />
    <Separator />
    <Painter />
    <Separator />
    <Copy />
    <Separator />
    <Download />
    <Separator />
    <Save />
    <Separator />
    <About />
  </div>
</template>

<style scoped>
nav {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

nav::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  background: transparent;
}
</style>
