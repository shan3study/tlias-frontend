import axios from 'axios'
//创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 600000
})
//响应拦截器
request.interceptors.response.use(
    response => { //响应成功
        return response.data
    },
    error => { //响应失败
        return Promise.reject(error)
    }
)

//导出axios实例
export default request