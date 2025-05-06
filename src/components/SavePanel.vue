<template>
  <div
    flex="~ col gap-4"
    children:flex="~ items-center gap-2 wrap"
  >
    <div>
      <input
        placeholder="Name"
        maxlength="20" ipt-sm
        bd
      >
      <button
        bd btn-sm icon-text
      >
        <div i-carbon:function />
        Preview
      </button>
    </div>
    <div text-sm text-white children:btn-sm>
      <button bg-gray-700>
        Reset
      </button>
      <button bg-teal-700>
        Save
      </button>
    </div>
  </div>
</template>
