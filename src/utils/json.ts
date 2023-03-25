export function parseJSON(jsonStr: string) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(`JSON解析错误：${e}`);
    return null;
  }
}

export function stringifyJSON(jsonStr: object) {
  try {
    return JSON.stringify(jsonStr);
  } catch (e) {
    console.error(`JSON解析错误：${e}`);
    return null;
  }
}
