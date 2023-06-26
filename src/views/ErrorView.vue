<template>
  <div v-if="hasError" class="err-c">
    <div class="err-info">
      <h2>Error of Page：</h2>
      <h4>
        <div>错误信息：<span class="err-msg">{{ errorMsg?.msg }}</span></div>
        <div>错误组件：<span class="err-instance">{{ errorMsg?.errInstance }}</span></div>
      </h4>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const hasError = ref(false)
const errorMsg = ref<{
  errInstance: string | undefined;
  msg: string
}>()

onErrorCaptured((err, target) => {
  console.error('Error:', err.message);
  console.error('Vue instance:', target?.$.type.__name);

  hasError.value = true;
  errorMsg.value = {
    errInstance: target?.$.type.__name,
    msg: err.message
  }

  return false;
})
</script>

<style scoped>
.err-c {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.err-msg {
  color: red;
}

.err-instance {
  font-weight: bold;
}
</style>
