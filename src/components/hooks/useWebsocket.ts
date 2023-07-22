import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useWebSocket(url: string) {
  const ws = ref<WebSocket>()
  const connected = ref(false)
  const message = ref('')
  const timer = ref<any>(null)
  const delay = 1000  // 重连间隔
  const reconnectCount = ref(10) // 重连次数

  onMounted(() => {
    reconnect()
  })

  const reconnect = () => {
    console.log('reconnect');
    if (!connected.value) {
      ws.value = new WebSocket(url) // 创建

      ws.value.onopen = () => {
        connected.value = true
        clearInterval(timer.value)
      }

      ws.value.onmessage = ({ data }) => {
        message.value = data
      }

      ws.value.onclose = () => {
        console.log('ws close')
        if (!timer.value) {
          let recount = 0
          connected.value = false
          timer.value = setInterval(() => {
            recount++
            if (reconnectCount.value > recount) {
              reconnect()
            }
          }, delay)
        }
      }

      ws.value.onerror = () => {
        console.log('ws error');
        if(ws.value?.CLOSED) {
          connected.value = false
          reconnect()
        }
      }
    }
  }

  const send = (data: any) => {
    ws.value?.send(data)
  }

  onBeforeUnmount(() => {
    ws.value?.close()
  })


  return {
    send,
    message,
    connected
  }
}
