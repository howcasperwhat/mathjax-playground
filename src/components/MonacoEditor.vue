<script setup lang='ts'>
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import { createHighlighter } from 'shiki'
import litemath from '~/data/litemath'

const modelValue = defineModel<string>()

const editor = ref<HTMLElement | null>(null)
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

onMounted(async () => {
  if (editor.value) {
    window.MonacoEnvironment = {
      getWorker() {
        return new EditorWorker()
      },
    }
    // Create the highlighter, it can be reused
    const highlighter = await createHighlighter({
      themes: [
        'vitesse-dark',
        'vitesse-light',
      ],
      langs: [litemath],
    })

    // Register the languageIds first. Only registered languages will be highlighted.
    monaco.languages.register({ id: 'litemath' })
    shikiToMonaco(highlighter, monaco)

    editorInstance.value = monaco.editor.create(editor.value, {
      value: modelValue.value || '', // Use modelValue or a default
      language: 'litemath', // Or use props.language
      // theme: '', // Or use props.theme
      automaticLayout: true, // Adjusts layout on container resize
      minimap: { enabled: false }, // Optional: disable minimap
      // Add other Monaco options as needed
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

    // Listen to content changes and update the modelValue
    editorInstance.value.onDidChangeModelContent(() => {
      modelValue.value = editorInstance.value?.getValue()
    })

    watch(isDark, () => {
      monaco.editor.setTheme(`vitesse-${isDark.value ? 'dark' : 'light'}`)
    }, { immediate: true })
  }
})

onUnmounted(() => {
  editorInstance.value?.dispose()
})
// });
</script>

<template>
  <div
    ref="editor"
    rounded of-hidden
    b="1px solid gray op-24"
  />
</template>
