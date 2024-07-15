import { post } from '@/utils/request'

export function getDailycount(data: any) {
  return post({
    url: '/api/v1/report/dailycount',
    data
  })
}
export function getReportCount(data: any) {
  return post({
    url: '/api/v1/report/count',
    data
  })
}

export function getUserList(data: any) {
  return post({
    url: '/api/v1/report/list',
    data
  })
}
export function getCollectionList(data: any) {
  return post({
    url: '/api/v1/style/collection/paging',
    data
  })
}

export function downloadDetail(data: any) {
  return post({
    url: '/api/v1/report/bpoint/detail',
    data
  })
}

export function favoriteDetail(data: any) {
  return post({
    url: '/api/v1/report/favorite/detail',
    data
  })
}

export function modelDetail(data: any) {
  return post({
    url: '/api/v1/report/model/detail',
    data
  })
}

export function userList() {
  return post({
    url: '/api/v1/modeluser/list',
  })
}

export interface FusionProps {
  login_name?: string
  account_type?: string
  fusion_a_type?: 'hd' | 'download' | 'inpaint' | 'merge' |'inpaint,merge'
  nick_name?: string
  style?: string
  page_index: number
  page_size: number
}
export function getFusionDetail(data: FusionProps) {
  return post({
    url: '/api/v1/report/fusion/detail',
    data
  })
}


export function getFusionDetailDownload(data: {
  "id": any
  "page_index": number
  "page_size": number
  }) {
  return post({
    url: '/api/v1/report/fusion/detail/download',
    data
  })
}

export interface BpointProps {
  login_name?: string
  account_type?: string
  action?: string[]
  action_type: 'tool' | 'fusion'
  root?: string[]
  page_index?: number
  page_size?: number
}
export function getBpointDetail(data: BpointProps) {
  return post({
    url: '/api/v1/report/bpoint/detail',
    data
  })
}
export function getBpointDownloadDetail(data: BpointProps) {
  return post({
    url: '/api/v1/report/bpoint/download/detail',
    data
  })
}
export function getBpointDetailCount(data: BpointProps) {
  return post({
    url: '/api/v1/report/bpoint/count',
    data
  })
}

export interface UpscaleProps {
  account_type?: string
  is_download: "true" | 'false',
  login_name?: string,
  upscale?:"X2" | 'X3' | 'X4', //X2,X3,X4
  page_index?: number
  page_size?: number
}
export function getUpscaleDetail(data: UpscaleProps) {
  return post({
    url: '/api/v1/report/upscale/detail',
    data
  })
}

export interface AiProps { 
  login_name?: string
  account_type?: string
  action?: string[]
  action_type: 'tool' | 'fusion'
  root?: string[]
  page_index?: number
  page_size?: number
}
export function getAiTextDetail(data: AiProps) {
  return post({
    url: '/api/v1/report/gpt/detail',
    data
  })
}
