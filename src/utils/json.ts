/**
 * 解析 string -> object
 * @param jsonStr 需要解析的字符串
 * @returns null | object
 */
export function parseJSON(jsonStr: string) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("parse error")
    return {};
  }
}

/**
 * 解析json -> string
 * @param jsonObj 需要解析的对象
 * @returns null | string
 */
export function stringifyJSON(jsonObj: object) {
  try {
    return JSON.stringify(jsonObj);
  } catch (e) {
    console.error(`JSON解析错误：${e}`);
    return "";
  }
}
