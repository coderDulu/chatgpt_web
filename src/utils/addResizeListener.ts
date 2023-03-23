/**
 * 添加监听resize
 */
class AddResize {
  fns = new Map()

  constructor() {
    window.addEventListener('resize', () => {
      this.fns.forEach(fn => fn());
      // console.log(this.fns)
    })
  }

  add(id: string, callback: () => void) {
    if(!this.fns.get(id)) {
      this.fns.set(id, callback);
    }
  }

  clear() {
    this.fns.clear()
  }

  remove(id: string) {
    this.fns.delete(id);
  }
}

const addResize = new AddResize();
export default addResize;