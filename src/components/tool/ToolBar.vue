<template>
  <div

    max-h="[calc(100vh-2rem)]" px-4 py-6 bd rd-full h-max shadow of-y-auto
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
  --at-apply: hidden w-0 h-0 bg-transparent;
}
</style>
