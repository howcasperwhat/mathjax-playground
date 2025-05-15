<script setup lang='ts'>
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import { createHighlighter } from 'shiki'
import litemath from '~/data/litemath'

const props = defineProps<{
  tex: string
}>()
const emits = defineEmits<{
  (e: 'update', value: string): void
}>()

const isHidden = ref(false)
const isExpanded = ref(false)
const element = ref<HTMLElement | null>(null)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

function getClass() {
  const classes = []
  if (isHidden.value)
    classes.push('translate-x--99%')
  if (isExpanded.value)
    classes.push('w-[calc(100%-1rem)] h-[calc(100%-4rem)]')
  else
    classes.push('w-[calc(100%-5rem)] h-50%')
  return classes.join(' ')
}

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light'],
    langs: [litemath],
  })
  monaco.languages.register({ id: 'litemath' })
  shikiToMonaco(highlighter, monaco)
  monaco.languages.registerCompletionItemProvider('litemath', MONACO_COMPLETION)
  monaco.languages.setLanguageConfiguration('litemath', {
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    comments: { lineComment: '%' },
  })

  editor.value = monaco.editor.create(element.value!, {
    ...MONACO_CONFIG,
  })

  editor.value.onDidChangeModelContent(() => {
    // just for monaco-edit rather than setValue
    if (editor.value?.getValue() === props.tex)
      return
    emits('update', editor.value?.getValue() ?? '')
  })

  watch(isDark, () => monaco.editor.setTheme(
    `vitesse-${isDark.value ? 'dark' : 'light'}`,
  ), { immediate: true })

  watch(() => props.tex, async () => {
    if (editor.value?.getValue() === props.tex)
      return
    editor.value?.setValue(props.tex)
  }, { immediate: true })
})

onUnmounted(() => editor.value?.dispose())
</script>

<template>
  <div
    flex="~ col" b="solid stone:10"
    bd rd-tr-xl b-b-none b-l-none shadow
    transition="~ property-[height,transform,width]"
    duration-300
    :class="getClass()"
    @mouseenter="isHidden = false"
  >
    <div
      flex="~ items-center justify-end gap-4"
      text-lg p-4 rd-tr-xl bg-base
      b-b="1px solid stone:10"
    >
      <button
        v-tooltip.top="'Hide Editor'"
        c-stone op="80 hover:100" btn
        @click="isHidden = true"
      >
        <div i-carbon:right-panel-open />
      </button>
      <button
        v-tooltip.top="`${isExpanded ? 'Collapse' : 'Expand'} Editor`"
        c-stone op="80 hover:100" btn
        @click="isExpanded = !isExpanded"
      >
        <div v-if="isExpanded" i-carbon:minimize />
        <div v-else i-carbon:maximize />
      </button>
    </div>
    <div
      ref="element" h-full w-full
    />
  </div>
</template>
