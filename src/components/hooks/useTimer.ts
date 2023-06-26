export function throttle(func: Function, delay: number) {
  let lastTime = 0;
  return function(...args: any[]) {
    const nowTime = +new Date();
    if (nowTime - lastTime > delay) {
      func(args);
      lastTime = nowTime;
    }
  };
}

export function debounce(func: Function, delay: number): Function {
  let timer: ReturnType<typeof setTimeout>;

  return function(this: any, ...args: any[]) {
    const context = this;

    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}