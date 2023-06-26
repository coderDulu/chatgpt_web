/**
 * 对pre添加复制按钮
 */
export function addCopyBtn() {
  const codeEl = document.querySelectorAll('pre')
  codeEl.forEach(item => {
    // @ts-ignore
    const isBtn = item.lastChild.className !== 'copy-btn'

    if (isBtn) {
      const btn = document.createElement('button')
      btn.innerText = "复制"
      btn.id = 'copy-btn'
      btn.style.top = '10px'
      btn.style.right = '10px'
      btn.style.cursor = 'pointer'
      btn.style.padding = ' 0 10px'
      btn.style.position = 'absolute'

      btn.onclick = () => {
        // @ts-ignore
        copyText(item.firstChild.innerText)
      }

      item.appendChild(btn)
    }

  })
}

/**
 * 复制文本到剪切板
 * @param text 需要复制的文本
 */
function copyText(text: string) {
  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.opacity = "0";
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    import("ant-design-vue").then(res => {
      res.message.success("复制成功")
    })
  } catch (err) {
    console.error("Failed to copy message to clipboard: ", err);
  }
  document.body.removeChild(textarea);
}

/**
 * 防抖函数
 * @param func 需要运行的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行
 * @returns 
 */
export function debounce(func: Function, wait: number, immediate: boolean = false): Function {
  let timeout: any; // 定时器
  return function (this: any, ...args: any[]) {
    const context = this; // 获取执行上下文
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait); // 延时执行
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 节流函数
 * @param func 延迟执行的函数
 * @param limit 延迟
 * @returns 
 */
export function throttle(func: (...args: any[]) => any, limit: number): (...args: any[]) => void {
  let inThrottle = false;
  return function (...args: any[]) {
    // @ts-ignore
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/**
 * 防抖添加复制按钮到pre标签当中
 */
export const addCopyBtnDebounce = debounce(() => {
  addCopyBtn()
}, 500)