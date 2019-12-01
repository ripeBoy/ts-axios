import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

/**
 * 发送请求
 * @param {AxiosRequestConfig} config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // TODO
  throwIfCancellationRequsted(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

/**
 * 处理配置参数
 * @param {AxiosRequestConfig} config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * 转化请求的url和params
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

/**
 * 转化请求的data
 * @param {AxiosRequestConfig} config
 * @returns {any}
 */
// function transformData(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
// }

/**
 * 转化请求的headers
 * @param {AxiosRequestConfig} config
 * @returns {any}
 */
// function transformHeaders(config: AxiosRequestConfig): any {
//   const  { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

/**
 * 处理响应的数据
 * @param {AxiosResponse} res
 * @returns {AxiosResponse}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 * 监测是否需要取消
 * @param {AxiosRequestConfig} config
 */
function throwIfCancellationRequsted(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
