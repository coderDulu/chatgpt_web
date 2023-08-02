<script setup lang="ts">
import { ref } from 'vue';
import AutoScroll from './common/AutoScroll.vue';
import { DeleteOutlined, FormOutlined } from "@ant-design/icons-vue";
import { useStateStore } from '@/stores';
import localStorage from '@/utils/storage/localStorage';

const props = defineProps<{ data: string, id: number }>()
const store = useStateStore()
// const sendData = 

const showDelete = ref(false)
const showEdit = ref(false)
const editValue = ref(props.data)

const delItem = () => {
  store.$state.sendData.splice(props.id, 1)
  localStorage.set('sendData', store.$state.sendData);
}


const saveAndSend = () => {
  store.$state.sendData[props.id].send = editValue.value
  store.$state.sendData[props.id].receive = ''

  showEdit.value = false
  store.$state.resetId = props.id

  store.sendDataToServer(store.$state.sendData)
}
</script>

<template>
  <div class="send-c" @mouseenter="() => showDelete = true" @mouseleave="showDelete = false">
    <div class="header">ME</div>
    
    <AutoScroll v-if="!showEdit" class="scroll-c" is-auto>
      {{ data }}
    </AutoScroll>
    <div v-else class="edit-c">
      <a-input autofocus v-model:value="editValue"/>
      <a-button type="primary" class="save-btn" @click="saveAndSend">保存提交</a-button>
      <a-button @click="showEdit = false">取消</a-button>
    </div>

    <div v-if="showDelete" class="icons">
      <form-outlined  @click.stop="showEdit = true"/>
      <delete-outlined @click.stop="delItem" />
    </div>
  </div>
</template>

<style scoped>
.send-c {
  display: flex;
  padding: 10px;
  max-height: 200px;
}


.header {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #fff;
  background-color: #c11a5b;
}

.scroll-c {
  width: 100%;
  max-height: 200px;
  font-size: 16px;
}

.icons {
  position: absolute;
  font-size: 20px;
  right: 10px;
  top: 10px;
  cursor: pointer;
  display: flex;
  width: 80px;
  justify-content: space-around;
}

.edit-c {
  width: 100%;
  height: 100%;
}

.save-btn {
  margin: 10px;
}

@media screen and (max-width: 768px) {
  .header {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
}

</style>
