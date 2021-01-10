import axios from 'axios'
import { Toast} from 'antd-mobile'
import qs from 'qs'
//创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 200000, // 请求超时时间
    withCredentials: true // 选项表明了是否是跨域请求
})
service.interceptors.request.use(config => {
    let state = sessionStorage.getItem('saveLoginInfo')
    state = state?JSON.parse(state):state
    config.url = 'fssc-api/' + config.url
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;Access-Control-Allow-Origin:*'
    if(config.formData) config.data=qs.stringify(config.data)
    
    if (state) config.headers['Authorization'] = state.auth_token

    
    Toast.loading('加载中', 1) // loading组件，显示文字加载中，自动关闭延时1s
    return config;
}, err => {
    
    return Promise.reject(err)
})
//拦截响应
service.interceptors.response.use(config => {
    Toast.hide() // 销毁Toast组件
    return config;
}, err => {
    
    return Promise.reject(err)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非000000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.rstCode !==0) {
            res.code = res.data.code
            res.message = res.response.data.msg
            Toast.info(res.code + res.message, 2);
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        return Promise.reject(error)
    }
)
export default service