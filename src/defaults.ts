import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  /**
   * @description 请求方式
   */
  method: 'get',
  /**
   * @description 请求超时时间
   */
  timeout: 0,
  /**
   * @description 请求头部
   */
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  /**
   * @description
   */
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  /**
   * @description 请求拦截
   */
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  /**
   * @description 响应拦截
   */
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  /**
   * 合法状态码
   * @param {number} status
   * @returns {boolean}
   */
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
