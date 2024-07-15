import { post } from '@/utils/request'

import { getUserName } from '@/utils/location';

// 创建task
interface CreateParams {
  task_name: string;
  task_en_name?: string;
  tbn_main_img: string;
  main_img: string;
}
export function taskCreate(params: CreateParams) {
  return post({
    url: '/api/v1/task/create',
    data: params
  })
}
export function taskTemplateCreate(params: CreateParams) {
  return post({
    url: '/api/v1/template/task/create',
    data: params
  })
}

export function taskDevCreate(params: CreateParams) {
  return post({
    url: '/api/v1/devtask/create',
    data: params
  })
}

export function cutout(params: any) {
  return post({
    url: `/api/v1/img/cutout?user_name=${getUserName('user')}`,
    data: params,
    isNeedFresh: true
  })
}
export function templateUpload(params: any) {
  return post({
    url: `/api/v1/template/img/upload`,
    data: params,
  })
}
export function cutoutimgtool(params: any) {
  return post({
    url: '/api/v1/imgtool/cutout',
    data: params,
    isNeedFresh: true
  })
}
// 任务列表
export function getTaskList<T = any>(data: { page_index: string, page_size: string }) {
  return post<T>({
    url: '/api/v1/task/paging',
    data
  })
}
// 任务列表
export function getTemplateTaskList<T = any>(data: { page_index: string, page_size: string }) {
  return post<T>({
    url: '/api/v1/template/task/paging',
    data
  })
}
export function getDevTaskList<T = any>(data: { page_index: string, page_size: string }) {
  return post<T>({
    url: '/api/v1/devtask/paging',
    data
  })
}

export function deleteTask(params: { task_id: string}) {
  return post({
    url: `/api/v1/task/delete?task_id=${params.task_id}`,
  })
}

// 重命名
export function updateName(params: any) {
  return post({
    url: '/api/v1/task/updatename',
    method: 'post',
    params
  })
}
// 重命名
export function updateTemplteName(params: any) {
  return post({
    url: '/api/v1/template/task/updatename',
    method: 'post',
    params
  })
}
// 重命名
export function updateDevName(params: any) {
  return post({
    url: '/api/v1/devtask/updatename',
    method: 'post',
    params
  })
}
// 风格列表
export function getStyleList() {
  return post({
    url: '/api/v1/style/list'
  })
}

// 风格列表,带统计
export function getStyleCountList() {
  return post({
    url: '/api/v1/stylecount/list'
  })
}

export function CollectStyle(data: any) {
  return post({
    url: '/api/v1/style/collection/save',
    data
  })
}

// 风格列表
export function getdemolist() {
  return post({
    url: '/api/v1/img/demolist'
  })
}

// 风格列表
export function getSlogan(data: any) {
  return post({
    url: '/api/v1/gpt/slogan',
    data
  })
}

export function taskCurrent() {
  return post({
    url: '/api/v1/task/current'
  })
}

export function taskServerStatus() {
  return post({
    url: '/api/v1/task/serverstatus'
  })
}

export function taskCopy(data: { task_id: string, task_name: any }) {
  return post({
    url: '/api/v1/devtask/copy',
    data
  })
}

export function taskSdConfigSave(params: any, data: any) {
  return post({
    url: '/api/v1/img/sdconfig/save',
    params,
    data
  })
}

export function getAllstyle(data: any) {
  return post({
    url: '/api/v1/img/allstyle',
    data,
  })
}

          
          
