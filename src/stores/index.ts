import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import localStorage from '@/utils/storage/localStorage';


interface SendDataType {
  send: string;
  receive: string
}

export const useStateStore = defineStore('state', () => {
  const ws = ref({ // websocket相关
    send: (data: any) => { },
    connected: false
  })

  const isRunning = ref(false);

  const resetId = ref<null | number>(null)
  
  const sendData = ref<SendDataType[]>(localStorage.get("sendData") ?? [])  // 发送的数据

  /**
 * // 下发消息到服务器
 * @param data 
 */
  function sendDataToServer(data: any[]) {
    const sendData: {
      role: string,
      content: string
    }[] = [];

    const newData = data.slice(-3);

    newData.forEach((item: { send: string; receive: string; }) => {
      const me = item.send;
      me && sendData.push({ role: "user", content: me })
      const ai = item.receive?.replace(/[\n|\s]/g, '') ?? '';
      const aiLen = ai.length;
      ai && sendData.push({ role: "assistant", content: aiLen >= 300 ? ai.slice(-500) : ai })
    })

    ws.value.send(JSON.stringify({ text: sendData }));
  }



  return { ws, sendData, sendDataToServer, resetId, isRunning }
})
