<script setup lang="ts">
const props = defineProps<{
  tex: string
}>()
// const emits = defineEmits<{
//   (e: 'rendered', elem: Element): void
// }>()
const html = ref(props.tex)
const container = ref<HTMLElement | null>(null)

onMounted(() => {
  watch(() => props.tex, () => {
    // console.log(props.tex)
    const element = transformer.from(props.tex).children[0]
    // // eslint-disable-next-line no-console
    // console.log('tex changed', props.tex, element)
    html.value = element.outerHTML
    nextTick(() => {
      state.elem = container.value!.children[0] as SVGSVGElement
      // emits('rendered', state.elem!)
    })
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
    <div ref="container" v-html="html" />
  </div>
</template>
