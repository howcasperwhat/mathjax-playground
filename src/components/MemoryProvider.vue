<script setup lang='ts'>
const editing = defineModel<boolean>({ required: true })

const el = useTemplateRef<HTMLInputElement>('el')
const content = ref('')

function confirm() {
  const name = content.value.trim()
  if (!playState.exists(name)) {
    playState.add(name) // memory
    playState.tabs.value.add(name) // tabs
    playState.active = name // active
    editing.value = false
  }
  else {
    message.error('State name already exists')
    el.value?.focus()
  }
}
function cancel() {
  editing.value = false
  content.value = ''
}

onMounted(() => {
  watch(editing, () => {
    editing.value && nextTick(
      () => el.value?.focus(),
    )
  })
})
</script>

<template>
  <div
    v-tooltip.left="'Enter to confirm, Esc to cancel'"
    flex class="b-teal:36 bg-teal:8 hover:bg-teal:8!"
  >
    <div i:tex />
    <input
      ref="el" v-model="content"
      placeholder="name" maxlength="20"
      p-0 ipt-sm flex-1
      @blur="cancel"
      @keydown.enter="confirm"
      @keydown.esc="cancel"
    >
  </div>
</template>
