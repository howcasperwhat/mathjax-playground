<script setup lang="ts">
const props = defineProps<{
  svg: string
}>()
const emits = defineEmits<{
  (e: 'update', value: SVGSVGElement): void
}>()

// function error(elem: SVGSVGElement) {
//   const decisive = elem?.lastChild?.lastChild?.lastChild
//   return (
//     decisive instanceof SVGGElement
//     && decisive.getAttribute('data-mjx-error')
//   )
// }

const container = ref<HTMLElement | null>(null)
const html = ref('')

//        monaco-edit(x) --------v
// playState.active(x) -> monaco.content -> playState.tex
//  +-> playState.svg -> html, playState.elem   | (just for monaco-edit)
//         ^------------------------------------+
// onEditMonaco -> playState.tex -> playState.svg
// playState.active -> playState.svg -> svg -> html -> playState.elem
//        +-> playState.tex -> tex -> monaco.content
// [TODO]: `playState.tex` that changed by `playState.active` shouldn't affect `playState.svg`
onMounted(() => {
  watch(() => props.svg, async () => {
    html.value = props.svg.includes('data-mjx-error')
      ? 'Error'
      : props.svg
    await nextTick()
    const elem = container.value!.firstChild as SVGSVGElement
    emits('update', elem)
    // console.log('svg in mathjax')
  })
  // watch(playState.active, async () => {
  //   const item = playState.toItem(playState.active.value)
  //   item?.svg && (playState.svg.value = item.svg)
  //   console.log('active in mathjax', playState.active.value)
  // }, { immediate: true })
  // watch(playState.tex, async () => {
  //   const elem = mathjax.from(playState.tex.value)
  //   if (error(elem))
  //   return html.value = 'Error'
  //   playState.svg.value = elem.outerHTML
  //   console.log('tex in mathjax')
  // }, { immediate: true })
  // watch(playState.svg, async () => {
  //   html.value = playState.svg.value
  //   nextTick(() => {
  //     playState.elem = container.value!.firstChild as SVGSVGElement
  //   })
  //   console.log('svg in mathjax')
  // }, { immediate: true })
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
    <div ref="container" v-html="html" />
  </div>
</template>
