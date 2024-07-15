import { post } from '@/utils/request'


export function submitModel(data: any) {
  return post({
    url: '/api/v1/model/submit',
    data
  })
}

export function getModel(data?: any) {
  return post({
    url: '/api/v1/model/list',
    data
  })
}
