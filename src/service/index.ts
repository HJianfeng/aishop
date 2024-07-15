import { post } from '@/utils/request'

// dev sd 参数
export function getSdConfig(params: { task_id: string}) {
  return post({
    url: '/api/v1/task/sdconfig',
    params
  })
}

// hd 高清图片生成
export function upscale(data: any) {
  return post({
    url: '/api/v1/img/upscale',
    data,
    isNeedFresh: true
  })
}
export function upscaleZoomin(params: any, data?: any) {
  return post({
    url: '/api/v1/imgtool/upscale',
    params,
    data,
    isNeedFresh: true
  })
}
export function upscaleHd(params: any, data?: any) {
  return post({
    url: '/api/v1/imgtool/hd',
    params,
    data,
    isNeedFresh: true
  })
}
export function imgtoolInpaint(data: any) {
  return post({
    url: '/api/v1/imgtool/inpaint/upload',
    data,
    isNeedFresh: true
  })
}
export function toInpaintTool(data: any) {
  return post({
    url: '/api/v1/imgtool/inpaint',
    data,
    isNeedFresh: true
  })
}
export function toInpaintImg(data: any) {
  return post({
    url: '/api/v1/img/inpaint',
    data,
    isNeedFresh: true
  })
}
export function toMergeImg(data: any) {
  return post({
    url: '/api/v1/img/docmerge',
    data,
    isNeedFresh: true
  })
}
export function toDownload(data: any) {
  return post({
    url: '/api/v1/img/download/bpoint',
    data
  })
}

export * from './tool'
export * from './login'
export * from './task'
export * from './imgList'
export * from './admin'
export * from './model'
export * from './slogan'
export * from './pay'