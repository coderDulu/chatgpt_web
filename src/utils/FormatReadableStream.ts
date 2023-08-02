type EventNameType = 'data' | 'end'

class FormatReadableStream extends EventTarget {
  constructor(readableStream: ReadableStream) {
    super()
    this.handle(readableStream)
  }

  async handle(readableStream: ReadableStream) {
    const reader = readableStream.getReader()
    let isRunning = true

    while (isRunning) {
      const { done, value } = await reader.read()
      if (done) {
        // 数据流读取完毕，触发结束事件
        this.triggerEvent('end')
        isRunning = false
      }

      const textDecoder = new TextDecoder()
      const str = textDecoder.decode(value)
      this.triggerEvent('data', str)
    }
  }

  addEventListener(
    type: EventNameType,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    super.addEventListener(type, callback, options)
  }

  // 触发事件
  triggerEvent(eventName: EventNameType, eventData?: any) {
    const myEvent = new CustomEvent(eventName, { detail: eventData })
    this.dispatchEvent(myEvent)
  }
}

export default FormatReadableStream
