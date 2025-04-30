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
    themes: ['vitesse-dark', 'vitesse-light'],
    langs: [litemath],
  })
  monaco.languages.register({ id: 'litemath' })
  shikiToMonaco(highlighter, monaco)
  monaco.languages.registerCompletionItemProvider('litemath', MONACO_COMPLETION)
  monaco.languages.setLanguageConfiguration('litemath', {
    brackets: [['{', '}'], ['[', ']'], ['(', ')'], ['|', '|']],
  })

  editor.value = monaco.editor.create(element.value!, {
    ...MONACO_CONFIG,
    value: model.value,
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
