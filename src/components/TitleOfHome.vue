<script setup lang="ts">
import TransitionContainer from './common/TransitionContainer.vue';


</script>

<template>
  <div class="title-c">
    <TransitionContainer enter-active-class="animate__animated animate__backInDown" leave-active-class="animate__animated animate__backOutUp">
      <h2>ChatGPT-基于3.5</h2>
    </TransitionContainer>
  </div>
</template>

<style scoped>
.title-c {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>
