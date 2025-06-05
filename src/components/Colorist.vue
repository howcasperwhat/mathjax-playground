<script setup lang='ts'>
// TODO: color和props属性，emit color和opacity事件
const setting = defineModel<ColorSettings>({ required: true })
const el = useTemplateRef<HTMLInputElement>('el')

function change(event: Event) {
  const target = event.target as HTMLInputElement
  setting.value.color = target.value
}

function input(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  setting.value.opacity = shrink(Number.parseInt(value) || 0)
  target.value = setting.value.opacity.toString()
  playState.init()
}
function update(delta: number) {
  setting.value.opacity = shrink(setting.value.opacity + delta)
  playState.init()
}
</script>

<template>
  <div lh-0 relative>
    <button p-0 bd btn-sm @click="el?.click()">
      <svg
        width="1.2rem" height="1.2rem"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0" y="0" width="32" height="32"
          :fill="setting.color" :fill-opacity="setting.opacity / 100"
        />
      </svg>
    </button>
    <input
      ref="el" type="color" :value="setting.color"
      op-0 scheme-light h-0 w-0 left-0 top-full
      absolute dark:scheme-dark @input="change"
    >
  </div>
  <div flex="~ items-center" bd rd>
    <input
      :value="setting.opacity" maxlength="3"
      px-1 text-align-center ipt w-12
      @input.prevent="input"
    >
    <div
      flex="~ col"
      text-xs bd b-b-0 b-r-0 b-t-0
    >
      <button
        bd b-l-0 b-r-0 b-t-0 btn
        @click="update(1)"
      >
        <div i-carbon:caret-up />
      </button>
      <button btn @click="update(-1)">
        <div i-carbon:caret-down />
      </button>
    </div>
  </div>
  <input
    v-model="setting.color"
    font-mono ipt-sm text-align-center bd
    w="[calc(8ch+1rem)]" maxlength="7"
  >
</template>
