class LocalStorage {
  constructor() {

  }

  get(key: string) {
    let value;
    const getItem = localStorage.getItem(key);
    // 如果为null返回
    if(!getItem) return getItem;
    try {
      value = JSON.parse(getItem);
    } catch (error) {
      value = localStorage.getItem(key);
    }
    return value;
  }

  set(key: string, value: any) {
    let data;
    try {
      data = JSON.stringify(value);
    } catch (error) {
      data = value
    }
    localStorage.setItem(key, data);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

export default new LocalStorage();