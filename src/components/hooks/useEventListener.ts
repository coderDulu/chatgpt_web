// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target = window, event: any, callback: (event: any) => void) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}