export function debounce(this: any, func: any, delay: number) {
  let timer: string | number | NodeJS.Timeout | undefined;
  return  (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}