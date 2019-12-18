# brower-axios

使用 TypeScript 实现 axios 的浏览器端的所有功能

# Installing

Using npm:
```$xslt
$ npm install browser-axios
```
# Example
```$xslt
import axios from

const instance = axios.create()
instance.interceptors.request.use((config) => {
  config.params = {
   _t: +new Date()
  }
  return config
})

instance.get('https://yesno.wtf/api').then((response) => {
  console.log(response)
})
```

# brower-axios API
reference [axios](https://github.com/axios/axios)
