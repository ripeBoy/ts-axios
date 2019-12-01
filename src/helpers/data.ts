import { isPlainObject } from './util'

/**
 * 转化请求data方法
 * @param data
 * @returns {any}
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 处理响应的data数据
 * @param data
 * @returns {any}
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
