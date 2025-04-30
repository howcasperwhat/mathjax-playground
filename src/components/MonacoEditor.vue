<script setup lang='ts'>
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import { createHighlighter } from 'shiki'
import litemath from '~/data/litemath'

const model = defineModel<string>({ required: true })

const element = ref<HTMLElement | null>(null)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

onMounted(async () => {
  window.MonacoEnvironment = { getWorker: () => new EditorWorker() }

  const highlighter = await createHighlighter({
    themes: [
      'vitesse-dark',
      'vitesse-light',
    ],
    langs: [litemath],
  })
  monaco.languages.register({ id: 'litemath' })
  shikiToMonaco(highlighter, monaco)

  editor.value = monaco.editor.create(element.value!, {
    value: model.value,
    language: 'litemath',
    automaticLayout: true,
    minimap: { enabled: false },
    padding: {
      top: 16,
      bottom: 16,
    },
    lineNumbersMinChars: 3,
    fontSize: fontSize(),
    lineHeight: 1.6,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    scrollBeyondLastLine: false,
    contextmenu: false,
  })

  editor.value.onDidChangeModelContent(() =>
    model.value = editor.value!.getValue(),
  )

  watch(isDark, () => monaco.editor.setTheme(
    `vitesse-${isDark.value ? 'dark' : 'light'}`,
  ), { immediate: true })
})

onUnmounted(() => editor.value?.dispose())
</script>

<template>
  <div
    ref="element"
    rounded of-hidden
    b="1px solid gray op-24"
  />
</template>
