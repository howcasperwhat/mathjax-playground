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
const el = useTemplateRef<HTMLElement>('el')
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

function getClass() {
  const classes = []
  if (isHidden.value)
    classes.push('translate-y-[calc(100%-4rem)]')
  if (isExpanded.value)
    classes.push('w-[calc(100%-1rem)] h-[calc(100%-1rem)]')
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

  editor.value = monaco.editor.create(el.value!, {
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
    bd rd-t-xl b-b-none shadow
    transition="~ property-[height,transform,width]"
    duration-300 z-monaco children:w-full
    :class="getClass()"
  >
    <div
      flex="~ items-center justify-end gap-4"
      text-lg p-x-4 rd-t-xl h-4rem bg-base
      b-b="1px solid stone:16"
      @click="isHidden = false"
    >
      <div m-r-a p-1 rd-xl bg-stone:16>
        <div i:tex />
      </div>
      <button
        v-tooltip.top="`${isHidden ? 'Show' : 'Hide'} Editor`"
        c-stone op="80 hover:100" btn
        @click.stop="isHidden = !isHidden"
      >
        <div v-if="isHidden" i-carbon:bottom-panel-open />
        <div v-else i-carbon:bottom-panel-close />
      </button>
      <button
        v-tooltip.top="`${isExpanded ? 'Collapse' : 'Expand'} Editor`"
        c-stone op="80 hover:100" btn
        @click.stop="isExpanded = !isExpanded"
      >
        <div v-if="isExpanded" i-carbon:minimize />
        <div v-else i-carbon:maximize />
      </button>
    </div>
    <div ref="el" h="[calc(100%-4rem)]" />
  </div>
</template>
