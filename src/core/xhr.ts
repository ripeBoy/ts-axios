import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

/**
 * 实例化XMLHttpRequest
 * @param {AxiosRequestConfig} config
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    // 发送请求
    request.send(data)

    /**
     * 请求配置相关设置
     */
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    /**
     * 事件处理相关
     */
    function addEvents(): void {
      // 监听响应
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        //  处理响应
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      // 处理网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 处理超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms execeeded`, config, 'ECONNABORTED', request))
      }
      /**
       * 绑定下载进度事件
       */
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      /**
       * 绑定上传进度事件
       */
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    /**
     * headers相关处理
     */
    function processHeaders(): void {
      /**
       * 如果data为FormData类型  则删除默认的type 让浏览器自动设置
       */
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      /**
       * 设置请求token
       */
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      /**
       * 设置auth
       */

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
      //  设置请求头
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    /**
     * 取消相关处理
     */
    function processCancel(): void {
      // 判断是否可以取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          console.log(reason)
          request.abort()
          reject(reason)
        })
      }
    }

    /**
     * 响应处理
     * @param {AxiosResponse} response
     */
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed withstatus code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
