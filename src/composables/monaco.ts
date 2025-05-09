import type { editor } from 'monaco-editor'
import { languages, Range } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import { CHARACTERS, COMMANDS, DELIMITERS, ENVIRONMENTS } from '~/data/completion'

window.MonacoEnvironment = { getWorker: () => new EditorWorker() }

export const MONACO_CONFIG: editor.IStandaloneEditorConstructionOptions = {
  language: 'litemath',
  automaticLayout: true,
  minimap: { enabled: false },
  padding: {
    top: 16,
    bottom: 16,
  },
  lineNumbersMinChars: 3,
  fontSize: fontSize(),
  lineHeight: 1.8,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  scrollBeyondLastLine: false,
  contextmenu: false,
}

export const MONACO_COMPLETION: languages.CompletionItemProvider = {
  triggerCharacters: ['\\'], // 触发字符

  provideCompletionItems(model, position) {
    const lineContent = model.getLineContent(position.lineNumber)
    const lineUntilPosition = lineContent.substring(0, position.column - 1)
    const suggestions: languages.CompletionItem[] = []

    if (!lineUntilPosition.endsWith('\\')
      || lineUntilPosition.endsWith('\\\\')
    ) { return { suggestions } }

    Array.from(new Set(COMMANDS)).forEach((func) => {
      suggestions.push({
        label: `\\${func.name}${func.format ?? ''}`,
        kind: languages.CompletionItemKind.Function,
        insertText: `\\${func.name}${func.snippet ?? ''}`, // 插入文本 (不带 '\')
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet, // 重要：将 insertText 作为 Snippet 处理
        range: new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column), // 替换掉触发的 '\'
      })
    })

    Array.from(new Set(CHARACTERS)).forEach((func) => {
      suggestions.push({
        label: `\\${func}`,
        kind: languages.CompletionItemKind.Constant,
        insertText: `\\${func}`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column),
      })
    })

    Array.from(new Set(DELIMITERS)).forEach((func) => {
      suggestions.push({
        label: `\\${func}`,
        kind: languages.CompletionItemKind.Constant,
        insertText: `\\${func}`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column),
      })
    })

    suggestions.push({
      label: '\\begin{...}',
      kind: languages.CompletionItemKind.Module,
      insertText: `\\begin{\${1|${ENVIRONMENTS.join(',')}|}}\n\t$0\n\\end{$1}`,
      insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column),
    })

    return { suggestions }
  },
}
