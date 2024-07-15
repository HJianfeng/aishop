import { getLocalStorage } from './index';
import { HOST} from '@/constant/host'

export const getUserName = (name: string = 'user'): string => {
  return getLocalStorage(name)?.user_name
};

export const getToken = (name: string = 'user'): string => {
  return getLocalStorage(name)?.token;
}

export const getImgUrl = () => {
  return `${HOST}/img/${getUserName()}`
}

export const getBigImgUrl = () => {
  return `${HOST}/bigimg/${getUserName()}`
}

export const getResultImgUrl = (url: string) => {
  if(!url) return '';
  if(url.startsWith('http')) {
    return url
  }
  return `${HOST}/img/${getUserName()}/${url}`
}

/**
 * 拼接风格图片
 * @param img 
 * @returns 
 */
export const getTypeImg = (img: string) => {
  return `${HOST}/img/style/${img}`
}
export const isLogin = (): boolean => {
  const token = getToken('user');
  return !!token
}