import any = jasmine.any

const toString = Object.prototype.toString

/**
 * 判断数据类型时候为Date
 * @param val
 * @returns {val is Date}
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }
/**
 * 判断数据类型是否为普通函数
 * @param val
 * @returns {val is Object}
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

/**
 * 判断数据类型是否为FormData
 * @param val
 * @returns {val is FormData}
 */
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

/**
 * 判断数据类型是否为URLSearchParams
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
/**
 * 混合继承
 * @param {T} to
 * @param {U} from
 * @returns {T & U}
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 深拷贝
 * @param objs
 * @returns {any}
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
