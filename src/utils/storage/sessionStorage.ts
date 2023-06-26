class SessionStorage {
  constructor() {

  }

  get(key: string) {
    let value;
    const getItem = sessionStorage.getItem(key);
    // 如果为null返回
    if(!getItem) return getItem;
    try {
      value = JSON.parse(getItem);
    } catch (error) {
      value = sessionStorage.getItem(key);
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
    sessionStorage.setItem(key, data);
  }

  clear() {
    sessionStorage.clear();
  }

  remove(key: string) {
    sessionStorage.removeItem(key)
  }
}

export default new SessionStorage();