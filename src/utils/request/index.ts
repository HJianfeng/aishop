import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import service from './axios'
import { getToken } from '@/utils/location';
import { createBrowserHistory } from "history";
import { freshUserInfo, detectScores } from "@/service";

const history = createBrowserHistory({});
export interface HttpOption {
  url: string
  data?: any
  params?: any
  method?: string
  isNeedToken?: boolean
  isNeedFresh?: boolean
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
  cancelToken?: any
}

export interface Response<T = any> {
  data: T
  errorMsg?: string | null
  message?: string | null
  code?: number
}


function http<T = any>(
  { url,  data, params, method, isNeedToken, isNeedFresh, headers, onDownloadProgress, signal, beforeRequest, afterRequest, cancelToken }: HttpOption,
) {
  const successHandler = (res: Response<T>): T => {
    if(isNeedFresh) freshUserInfo()
    return res.data
  }
  if(isNeedFresh) detectScores(10)
  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    console.log('error', error);
    
    if(error) error.errorMsg = error.message
    return Promise.reject(error || {errorMsg: '服务器请求失败'})
  }
  if (isNeedToken ) {
    if(!getToken('user') || getToken('user') === "S1"){
      history.push('/');
      history.go(0)
      throw new Error('Error')
    }
  }
  beforeRequest?.()

  method = (method || 'GET').toUpperCase()
  const dataTemp = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  switch (method) {
    case 'GET':
      return service.get(url, { params: dataTemp, headers, signal, onDownloadProgress }).then(successHandler, failHandler)
    case 'POST':
      return service.post(url, dataTemp, { params, headers, signal, onDownloadProgress, cancelToken }).then(successHandler, failHandler)
    case 'PUT':
      return service.put(url, dataTemp, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
   default:
      return service.get(url, { params: dataTemp, headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  }
}

export function get<T = any>(
  { url, data, method = 'GET', headers, onDownloadProgress, signal, beforeRequest, afterRequest, isNeedFresh, isNeedToken }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
    isNeedFresh,
    isNeedToken
  })
}

export function post<T = any>(
  { url, data, method = 'POST', params, headers, onDownloadProgress, signal, beforeRequest, afterRequest, cancelToken,isNeedFresh, isNeedToken }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    data,
    params,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
    cancelToken,
    isNeedFresh,
    isNeedToken
  })
}

export function put<T = any>(
  { url, data, method = 'PUT', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post
