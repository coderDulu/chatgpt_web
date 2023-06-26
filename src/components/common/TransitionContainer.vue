<script setup lang="ts">
import 'animate.css';
import { onMounted } from 'vue';
import { ref } from 'vue';
const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__bounce" leave-active-class="animate__animated animate__backOutDown">
    <slot v-if="show"></slot>
  </Transition>
</template>

<style scoped></style>