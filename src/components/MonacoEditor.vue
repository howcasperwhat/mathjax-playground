<script setup lang='ts'>
import * as monaco from 'monaco-editor'

const modelValue = defineModel<string>()

const editor = ref<HTMLElement | null>(null)
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

onMounted(() => {
  if (editor.value) {
    editorInstance.value = monaco.editor.create(editor.value, {
      value: modelValue.value || '// Start typing here...', // Use modelValue or a default
      language: 'plaintext', // Or use props.language
      theme: 'vs-dark', // Or use props.theme
      automaticLayout: true, // Adjusts layout on container resize
      minimap: { enabled: false }, // Optional: disable minimap
      // Add other Monaco options as needed
      padding: {
        top: 16,
        bottom: 16,
      },
      lineNumbersMinChars: 3,
      fontSize: 16,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      scrollBeyondLastLine: false,
      contextmenu: false
    })

    // Listen to content changes and update the modelValue
    editorInstance.value.onDidChangeModelContent(() => {
      modelValue.value = editorInstance.value?.getValue()
    })

    watch(isDark, () =>
      monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs'),
      { immediate: true }
    )
  }
})

onUnmounted(() => {
  editorInstance.value?.dispose()
})
// });

</script>

<template>
  <div ref="editor" rd-4 of-hidden
    b="1px solid gray op-24" h="75%" />
</template>
