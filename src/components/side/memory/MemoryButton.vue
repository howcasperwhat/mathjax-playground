<script setup lang='ts'>
const { deleting, name, item } = defineProps<{
  deleting: boolean
  name: string
  item: Memory
}>()

const el = useTemplateRef<HTMLInputElement>('el')
const message = useMessage()
const editing = ref(false)
const content = ref(name)

function format(usage: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  for (let i = 0; i < units.length; i++) {
    if (usage < 1024 ** (i + 1))
      return `${(usage / (1024 ** i)).toFixed(2)} ${units[i]}`
  }
  return `${(usage / (1024 ** units.length)).toFixed(2)} TB`
}
function getClass() {
  if (editing.value)
    return 'b-blue:36 bg-blue:8 hover:bg-blue:8!'
  if (deleting)
    return 'hover:b-red:36 hover:bg-red:8!'
  return ''
}

function handle() {
  deleting ? _delete() : _show()
}

function _show() {
  appState.tabs.value.add(name)
  appState.active = name
}
function _delete() {
  appState.delete(name)
  message.success(`'${name}' deleted`)
}
function _rename(o: string, n: string) {
  appState.rename(o, n)
  message.success(`'${o}' renamed to '${n}'`)
}

function prepare() {
  content.value = name
  editing.value = true
  nextTick(() => {
    el.value?.focus()
    el.value?.select()
  })
}
function confirm() {
  const [o, n] = [name, content.value.trim()]
  appState.exists(n)
    ? message.error(`'${n}' already exists`)
    : _rename(o, n)
  cancel()
}
function cancel() {
  editing.value = false
  content.value = ''
}
</script>

<template>
  <button
    btn-md hover:bg-hex-8881
    :class="getClass()"
    @click="handle"
    @dblclick="prepare"
  >
    <div :class="appState.icon(item)" />
    <input
      v-if="editing" ref="el"
      v-model="content"
      :maxlength="30"
      placeholder="Name"
      p-0 ipt-sm b-0 bd flex-1
      @blur="cancel"
      @keydown.esc="cancel"
      @keydown.enter="confirm"
    >
    <div v-else shrink-1 truncate>
      {{ name }}
    </div>
    <div text-sm text-gray ml-a>
      {{ format(appState.usage(name, item)) }}
    </div>
  </button>
</template>
