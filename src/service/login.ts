import { post } from '@/utils/request'
import { getLocalStorage, setLocalStorage } from '@/utils'
import PubSub from 'pubsub-js';

// 登录
export function login(params: { login_name: string,password: string}) {
  return post({
    url: '/api/v1/userlogin',
    method: 'post',
    isNeedToken: false,
    data: params
  })
}
export function logout() {
  return post({
    url: '/api/v1/logout',
    method: 'post',
    isNeedToken: false,
  })
}

export function forgetpwd(data: { user_name: string, passwd: string}) {
  return post({
    url: '/api/v1/forgetpwd',
    method: 'post',
    isNeedToken: false,
    data
  })
}

export function sendsmscode(data: { login_name: string }) {
  return post({
    url: '/api/v1/sendsmscode',
    method: 'post',
    isNeedToken: false,
    data
  })
}
export function checksmscode(data: { mobile: string, sms_code: string }) {
  return post({
    url: '/api/v1/checksmscode',
    method: 'post',
    isNeedToken: false,
    data
  })
}
// 注册
export function register(params: { login_name: string,password: string,iv_code: string,from?:string}) {
  return post({
    url: '/api/v1/register',
    method: 'post',
    isNeedToken: false,
    data: params
  })
}

export function getUserInfo() {
  return post({
    url: '/api/v1/getuserinfo',
    method: 'post',
  })
}
export async function freshUserInfo() {
  try {
    const res = await getUserInfo();
    const data = getLocalStorage('user')
    data.scores = res.scores;
    setLocalStorage('user' , data)
    PubSub.publish('freshUserScores', { user: data });
  } catch (error) {
    
  }
}
export async function detectScores(v:any) {
  const data = getLocalStorage('user')
  if (!v) v=10
  
  if(data.scores<v) {
    PubSub.publish('openRecharge');
  }
}
interface FeedBack {
  content: string
  score: string
}
export function feedBackSubmit(data: FeedBack) {
  return post({
    url: '/api/v1/feedback/submit',
    method: 'post',
    data
  })
}
export function feedBackList(data: {page_index: string, page_size: string}) {
  return post({
    url: '/api/v1/feedback/pagging',
    method: 'post',
    data
  })
}


export function changepassword(data: { new_pass: string }) {
  return post({
    url: '/api/v1/password/change',
    method: 'post',
    data
  })
}
export function recharge(data: any) {
  return post({
    url: '/api/v1/score/recharge',
    method: 'post',
    data
  })
}
export function checktoken(data: any) {
  return post({
    url: '/api/v1/checktoken',
    method: 'post',
    data
  })
}

export function orderList(data: {page_index: string, page_size: string}) {
  return post({
    url: '/api/v1/order/paging',
    method: 'post',
    data
  })
}

export function autologin(params: { code: string}) {
  return post({
    url: '/api/v1/autologin',
    method: 'post',
    isNeedToken: false,
    data: params
  })
}
