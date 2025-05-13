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

const isCollapsed = ref(false)
const element = ref<HTMLElement | null>(null)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

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
    // avoid emit->tex-update->setValue->cursor jump
    if (editor.value?.getValue() === props.tex)
      return
    editor.value?.setValue(props.tex)
  }, { immediate: true })
})

onUnmounted(() => editor.value?.dispose())
</script>

<template>
  <div
    flex="~ col"
    b="solid stone:10"
    b-r-1 b-t-1 rd-tr-xl transition-transform duration-300 of-hidden
    :class="isCollapsed ? 'translate-x--99%' : ''"
    @mouseenter="isCollapsed = false"
  >
    <div
      flex="~ items-center justify-end"
      text-lg p-4 bg-base b-b="1px solid stone:10"
    >
      <button
        c-stone op-75 btn
        @click="isCollapsed = true"
      >
        <div i-carbon:previous-outline />
      </button>
    </div>
    <div
      ref="element" h-full w-full
    />
  </div>
</template>
