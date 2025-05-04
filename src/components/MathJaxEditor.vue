<script setup lang="ts">
const props = defineProps<{
  tex: string
}>()

const container = ref<HTMLDivElement | null>(null)

function error(elem: SVGSVGElement) {
  const decisive = elem?.lastChild?.lastChild?.lastChild
  return (
    decisive instanceof SVGGElement
    && decisive.getAttribute('data-mjx-error')
  )
}

onMounted(() => {
  watch(() => props.tex, () => {
    const elem = mathjax.from(props.tex)
    if (error(elem))
      return container.value!.innerHTML = 'Error'
    container.value!.innerHTML = ''
    container.value!.appendChild(
      playState.elem = elem,
    )
  }, { immediate: true })
})
</script>

<template>
  <div
    bd rd of-auto
    :style="{
      display: 'flex',
      justifyContent: 'safe center',
      alignItems: 'safe center',
    }"
  >
    <div ref="container" />
  </div>
</template>
