import { post } from '@/utils/request'


export interface SloganParams {
	main1: string,   //产品
	main2: string,   //品类

	minor3: string,  //功能
	minor2: string,  //成份

	minor1: string,  //用途
	minor4: string,  //产地
	assist1: string, //辅助信息
	keypoint: string,  //侧重点 ，用途，成份，功能，产地 单项选择
	solgan_len?: string,  //长、短 ，下拉选择
  tone?: string  //文艺、活泼、幽默、专业  ，下拉选择
}
export function createSlogan(data: SloganParams) {
  return post({
    url: '/api/v1/gpt/adinfo/create',
    method: 'post',
    isNeedFresh: true,
    data
  })
}

export function getSloganInfo() {
  return post({
    url: '/api/v1/gpt/adparam/get',
    method: 'post',
  })
}