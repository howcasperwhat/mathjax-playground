<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { transformer } from '../composables/transformer'
import { art } from '~/composables/artwork';

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
    const element = transformer.from(props.tex).children[0]
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
    h="25%" bg-gray bg-op-8 rd-4 of-scroll b="1px solid gray op-24"
    :style="{
      display: 'flex',
      justifyContent: 'safe center',
      alignItems: 'safe center',
    }"
  >
    <div v-html="html" ref="container" />
  </div>
</template>

<style scoped>
</style>
