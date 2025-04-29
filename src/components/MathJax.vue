<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { art } from '~/composables/artwork'
import { transformer } from '../composables/transformer'

const props = defineProps<{
  tex: string
}>()
const emits = defineEmits<{
  (e: 'rendered', elem: Element): void
}>()
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
      art.setElement(container.value!.children[0])
      emits('rendered', art.element.value!)
    })
  }, { immediate: true })
})
</script>

<template>
  <div
    rounded bg-gray bg-op-0 of-auto
    b="1px solid gray op-24"
    :style="{
      display: 'flex',
      justifyContent: 'safe center',
      alignItems: 'safe center',
    }"
  >
    <div ref="container" v-html="html" />
  </div>
</template>

<style scoped>
</style>
