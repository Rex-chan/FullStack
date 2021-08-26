import axios from 'axios'
var service = axios.create({
  timeout: 15000
})
// 添加请求拦截器
service.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
}, function (error) {
  return Promise.reject(error)
})
// 添加响应拦截器
service.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})
export default service
