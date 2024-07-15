
import axios, { type AxiosResponse } from 'axios'
import { getToken } from '@/utils/location';
import { removeLocalStorage, refreshToken } from '@/utils'
import { createBrowserHistory } from "history";
import { API_HOST } from '@/constant/host';
// import { message } from 'antd';

const history = createBrowserHistory({});

const service = axios.create({
  baseURL: API_HOST
})

service.interceptors.request.use(
  (config) => {
    const token = getToken('user')
    if (token && token !=="S1") {
      config.headers['X-Token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res?.headers['refresh-token'] || res?.headers['Refresh-Token']) {
      refreshToken(res?.headers['refresh-token'] || res?.headers['Refresh-Token'])
    }
    const isAllowNotLogin =['checktoken', 'gpt/adparam', 'demolist', 'task/paging'].some((i:string) => {
      return (res.config.url && res.config.url?.includes(i))
    });
    if (res?.data?.code===401 && !isAllowNotLogin) {
      history.push('/');
      history.go(0)
      removeLocalStorage('user')
      // message.error('登录已失效，请重新登录')
      return Promise.reject(res.data)
    }
    // 处理请求回来的东西
    if(!res.data || res.data.code!==0){
      return Promise.reject(res.data)
    }
    if(res.data.code!==200 && res.data.code!==0) {
      return Promise.reject(res.data)
    }
    return res?.data;
  },
  (error) => {
    console.log('error' ,error);
    return Promise.reject(error)
  },
)

export default service