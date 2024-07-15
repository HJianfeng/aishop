import { post } from '@/utils/request'


// 生成结果 图片list
export function getImgList(data: any) {
  return post({
    url: '/api/v1/img/pagging',
    method: 'post',
    data
  })
}


// 生成结果 图片list
export function getImgListInner(data: any) {
  return post({
    url: '/api/v1/img/innerlist',
    method: 'post',
    data
  })
}

// sd 生成
export function imgCreate(params: any, cancelToken?: any) {
  return post({
    url: '/api/v1/img/create',
    method: 'post',
    params: {
      ...params,
    },
    isNeedFresh: true,
    cancelToken
  })
}

// temp 生成
export function imgTempCreate(params: any, cancelToken?: any) {
  return post({
    url: '/api/v1/template/img/create',
    method: 'post',
    data: {
      ...params,
    },
    isNeedFresh: true,
    cancelToken
  })
}
export function templateSave(data: any) {
  return post({
    url: '/api/v1/template/save',
    method: 'post',
    data,
  })
}

// 调试模式 sd 生成
export function imgCreateInner(params: any, data: any, cancelToken?: any) {
  return post({
    url: '/api/v1/img/create/inner',
    data,
    params: {
      ...params
    },
    isNeedFresh: true,
    cancelToken
  })
}


// 结果图片删除
export function taskDetailDelete(params: any) {
  return post({
    url: '/api/v1/taskdetail/delete',
    params
  })
}
// 结果图片删除
export function taskDevDetailDelete(params: any) {
  return post({
    url: '/api/v1/taskdevdetail/delete',
    params
  })
}
export function taskDetailLike(data: { id: string, favorite: string }) {
  return post({
    url: '/api/v1/img/favorite',
    data
  })
}