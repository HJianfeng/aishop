
import { post } from '@/utils/request'

/**
 * 埋点
 */
export function addBpoint(params: any) {
  return post({
    url: '/api/v1/report/bpoint/add',
    data: params
  })
}
/** 
图片融合：
ok 背景融合 编辑 涂抹消除 (涂抹一次调一次埋点):{"action_type":"fusion" ,"action":"paint", "root":"","url":"","task_id":100,task_detail_id:100}
ok 背景融合 编辑 添加文案（点击添加文案时调一次埋点） :{"action_type":"fusion" ,"action":"merge", "root":"","url":"","task_id":100,task_detail_id:100}

图片工具：
ok 涂抹替换：{"action_type":"tool" ，"action":"paint", "root":""}
ok 高清修复 通用 下载 ：{"action_type":"tool" ，"action":"download", "root":"hd/clean","url":"http://***"}
ok 高清修复 人物 下载 ：{"action_type":"tool" ，"action":"download", "root":"hd/face","url":"http://***"}
ok 无损放大 X2 下载 ：{"action_type":"tool" ，"action":"download", "root":"upscale/x2","url":"http://***"}
ok 无损放大 X4 下载 ：{"action_type":"tool" ，"action":"download", "root":"upscale/x4","url":"http://***"}
*/


export function cutoutmerge(params: any) {
  return post({
    url: '/api/v1/imgtool/cutoutmerge',
    data: params
  })
}

interface Params {
  page_index: string,
  page_size: string,
  t_type: string // 氛围图
}
export function templateList(data: Params) {
  return post({
    url: '/api/v1/template/paging',
    data
  })
}
