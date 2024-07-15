import { post } from '@/utils/request'

export interface PayResponse {
  qrcode: string
  out_trade_no: string
  label: string
  price: string
}
export interface PayVipParams {
  /**
   * 1月卡，2季卡
   */
  member_type: 1|2
  /**
   * 微信：1，支付宝：2
   */
  pay_type: 1|2
}
export function payVip(data: PayVipParams) {
  return post({
    url: '/api/v1/bill/member/create',
    data
  })
}

export interface PayEnergyParams {
  scores: number
  /**
   * 微信：1，支付宝：2
   */
  pay_type: 1|2
}
export function payEnergy(data: PayEnergyParams) {
  return post({
    url: '/api/v1/bill/score/create',
    data
  })
}

/**
 * 轮训查询支付结果
 * @param data 
 * @returns 
 */
export function queryPay(data: {out_trade_no: string}) {
  return post({
    url: '/api/v1/bill/query',
    data
  })
}