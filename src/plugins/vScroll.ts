import type { Directive, DirectiveBinding } from 'vue'

interface Dire {
  isAuto?: boolean
}

// 鼠标是否移入
let isMouseEnter = false

const vScroll: Directive = {
  mounted: (el: HTMLElement) => {
    // 隐藏超出部分
    el.style.overflow = 'hidden'
    el.style.whiteSpace = 'pre-wrap'
    el.style.wordBreak = 'break-all'

    scrollBottom(el)

    // 添加鼠标移入移出事件
    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)
  },
  updated: (el: HTMLElement, binding: DirectiveBinding<Dire>) => {
    // console.log(binding)
    const {
      modifiers: { isAuto }
    } = binding

    if (isAuto && !isMouseEnter) {
      // 鼠标未移入且开启isAuto，则滚动到底部
      scrollBottom(el)
    }
  },
  unmounted: (el: HTMLElement) => {
    // 取消监听器
    el.removeEventListener('mouseenter', onMouseEnter)
    el.removeEventListener('mouseleave', onMouseLeave)
  }
}

function scrollBottom(el: HTMLElement) {
  el.scrollTo({
    top: el.scrollHeight
  })
}

function onMouseEnter(this: HTMLElement) {
  this.style.overflow = 'auto'
  isMouseEnter = true
}

function onMouseLeave(this: HTMLElement) {
  this.style.overflow = 'hidden'
  isMouseEnter = false
}

export default vScroll
