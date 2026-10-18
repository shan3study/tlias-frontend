import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
//创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 600000
})
//请求拦截器，获取LocalStorage中的token，并且在请求头中添加token字段
request.interceptors.request.use(
    config => { //请求成功
        const loginUser = JSON.parse(localStorage.getItem('loginUser'))
        if (loginUser && loginUser.token) {
            config.headers.token = loginUser.token
        }
        return config
    },
    error => { //请求失败
        return Promise.reject(error)
    }
)

//响应拦截器
request.interceptors.response.use(
    response => { //响应成功
        return response.data
    },
    error => { //响应失败
        //响应信息
        ElMessage.error('登录超时，请重新登录')
        if(error.response.status === 401){//全等判断
            router.push('/login')
        }else{
            ElMessage.error('接口访问异常')
        }
        return Promise.reject(error)
    }
)

//导出axios实例
export default request