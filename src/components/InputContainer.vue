<script setup lang="ts">
// @ts-ignore
import { SendOutlined } from '@ant-design/icons-vue';
import { useAntd } from './hooks/useAntdMsg';
import { ref } from 'vue';
import { useStateStore } from '@/stores';
import { stringifyJSON } from '@/utils/json';

const { $msg } = useAntd()
const store = useStateStore();
// const sendData = store.$state.sendData
const value = ref('')

const send = () => {
  if (value.value) {
    store.$state.sendData.push({ send: value.value, receive: '' })
    store.sendDataToServer(store.$state.sendData)
    value.value = ""
  } else {
    $msg.warn("请输入内容")
  }
}

const stopSend = () => {

  const stopData = stringifyJSON({
    type: "status",
    value: "stop"
  })
  store.ws.send(stopData)

  setTimeout(() => {
    store.$state.isRunning = false
  }, 500);
}

const resetSend = () => {
  store.$state.sendData[store.$state.sendData.length - 1].receive = ""
  store.sendDataToServer(store.$state.sendData)
}

const clearData = () => {
  store.$state.sendData = []
  localStorage.removeItem('sendData')
}

const handleFocus = () => {
  console.log('focus');
}

</script>

<template>
  <div class="utils-c">
    <a-button v-if="store.$state.isRunning" @click="stopSend" class="stop-btn">中断</a-button>
    <a-button v-else @click="resetSend" class="stop-btn">重发</a-button>
    <a-button @click="clearData" class="stop-btn" type="primary" danger>清空</a-button>
  </div>
  <div class="input-c">
    <a-input :disabled="!store.ws.connected" v-model:value="value" autofocus @focus="handleFocus" @press-enter="send">
      <template #suffix>
        <send-outlined @click="send" class="send-icon" />
      </template>
    </a-input>
  </div>
</template>

<style scoped lang="less">
.input-c {
  width: 90%;
  height: 50px;
  margin: 10px auto;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-input-affix-wrapper {
    height: 100%;
    max-width: 800px;
    box-shadow: 0 0 10px 5px rgba(221, 216, 216, 0.5);
    font-size: 16px;
    border-color: transparent;
    border: 1px solid #000;
    flex: 1;
    border-color: transparent !important;
    padding: 0 10px;
    border-radius: 5px;
  }
}

.utils-c {
  display: inline;
  margin: 0 auto;
  margin-top: 10px;
  justify-content: center;
  .ant-btn {
    margin: 0 4px;
  }
}

.send-icon {
  cursor: pointer;
}

.stop-btn {
  margin: 0px auto;
  width: 100px;
  margin-top: 10px;
}
</style>
