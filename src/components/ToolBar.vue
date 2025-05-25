<template>
  <div

    max-h="[calc(100vh-2rem)]" p-x-4 p-y-6 bd rd-full h-max shadow of-y-auto
    grid="~ flow-row items-center justify-center gap-4"
    children:flex="~ items-center justify-center"
  >
    <Logo />
    <hr sep>
    <Painter />
    <hr sep>
    <Copy />
    <hr sep>
    <Download />
    <hr sep>
    <Save />
    <hr sep>
    <ThemeSwitcher />
  </div>
</template>

<style scoped>
div {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

div::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  background: transparent;
}
</style>
