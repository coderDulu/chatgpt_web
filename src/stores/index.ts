import { ref, reactive, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import localStorage from '@/utils/storage/localStorage'
import FormatReadableStream from '@/utils/FormatReadableStream'

interface SendDataType {
  send: string
  receive: string
}

export const useStateStore = defineStore('state', () => {
  const ws = ref({
    // websocket相关
    send: (data: any) => {},
    connected: false
  })

  const isRunning = ref(false)

  const resetId = ref<null | number>(null)

  const sendData = ref<SendDataType[]>(localStorage.get('sendData') ?? []) // 发送的数据

  const receiveData = ref<string>()
  /**
   * // 下发消息到服务器
   * @param data
   */
  function sendDataToServer(data: any[]) {
    const sendData: {
      role: string
      content: string
    }[] = []

    const newData = data.slice(-2) // 截取最后对应次数的连续会话

    newData.forEach((item: { send: string; receive: string }) => {
      const me = item.send
      me && sendData.push({ role: 'user', content: me })
      const ai = item.receive?.replace(/[\n|\s]/g, '') ?? ''
      const aiLen = ai.length
      ai && sendData.push({ role: 'assistant', content: ai })
    })

    const body = JSON.stringify({ text: sendData })
    requestServer(body)
  }


  // 向服务器发送请求
  async function requestServer(body: any) {
    const response = await fetch(`/api/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    // 处理回答
    if (response.body) {
      const formatReadableStream = new FormatReadableStream(response.body)
      formatReadableStream.addEventListener('data', (event: any) => {
        receiveData.value = event.detail
      })
      formatReadableStream.addEventListener('end', () => {
        isRunning.value = false
        console.log('End of answer')
      })
    }
  }

  return { ws, sendData, sendDataToServer, resetId, isRunning, receiveData, requestServer }
})
