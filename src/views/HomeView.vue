<script setup lang="ts">
import { UpCircleOutlined } from '@ant-design/icons-vue'
import InputContainerVue from '@/components/InputContainer.vue';
import ReceiveContainer from '@/components/ReceiveContainer.vue';
import AutoScroll from '@/components/common/AutoScroll.vue';
import SendContainer from '@/components/SendContainer.vue';

import { useWebSocket } from '@/components/hooks/useWebsocket';
import { useStateStore } from '@/stores';
import { ref, watch, watchEffect, nextTick, onMounted } from 'vue';
import { parseJSON } from '@/utils/json';
import localStorage from '@/utils/storage/localStorage';
import { addCopyBtn } from '@/utils';
import { computed } from 'vue';

const store = useStateStore()
const contentRef = ref<any>(null)
const showGoTopIcon = computed(() => contentRef.value?.scrollH > document.body.clientHeight)  // 更具滚动条高度是否大于body高度显示顶部按钮

const { message, send, connected } = useWebSocket(`ws://${location.host}/ws`)


watchEffect(() => {
  store.$state.ws.send = send
  store.$state.ws.connected = connected.value
})

// 监听接收的数据
watch(message, (newVal) => {
  if (newVal) {
    const parseMsg = parseJSON(newVal)
    const { type, value } = parseMsg

    switch (type) {
      case 'answer':
        // 如果是修改某个问题，则替换对应的回答。如果是直接发送问题，则替换最后一条
        store.$state.isRunning = true
        store.$state.sendData[store.$state.resetId ?? store.$state.sendData.length - 1].receive += value
        break;
      case 'status':
        if (value === "end") {
          nextTick(() => {
            localStorage.set('sendData', store.$state.sendData)
            addCopyBtn()
            store.$state.resetId = null
            store.$state.isRunning = false
          })
        }
        break;
    }
  }
})

const goToTop = () => {
  contentRef.value?.scrollTo(0, 'smooth')
}

</script>

<template>
  <div class="home">
    <div class="main-c">
      <AutoScroll ref="contentRef" class="main-c-content" is-auto v-if="store.$state.sendData.length">
        <template v-for="(item, index) in store.$state.sendData" :key="index">
          <SendContainer :id="index" :data="item.send" />
          <ReceiveContainer :data="item.receive" />
        </template>
      </AutoScroll>
      <TitleOfHome v-else />
      <InputContainerVue />
      <up-circle-outlined v-if="showGoTopIcon" class="up-c" @click="goToTop" />
    </div>
  </div>
</template>


<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  /* padding: 10px 0; */
  background-color: #202123;
}

.main-c {
  display: flex;
  height: 100%;
  flex-direction: column;
  max-width: 1600px;
  position: relative;
  /* min-width: 960px; */
  margin: 0 auto;
  background-color: #fff;
}

.main-c-content {
  flex: 1;
}

.up-c {
  /* background-color: #fff; */
  position: absolute;
  bottom: 20px;
  right: -50px;
  color: #1890ff;
  font-size: 24px;
  transform: scale(1.4);
  cursor: pointer;
  box-shadow: 0 0 10px 10px rgba(#1890ff, .4);
}
</style>