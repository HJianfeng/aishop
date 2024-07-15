import { useState, forwardRef, useImperativeHandle } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, message } from 'antd'
import Style from './style.module.scss'
import { queryPay, PayResponse, freshUserInfo } from '@/service'
import wxpay from '@/assets/wechat_pay.png'
import payOk from '@/assets/pay_ok.svg'

let timer: any = null
const QrCode = (props: any, ref: any) => {
  const [isOpen, setisOpen] = useState(false);
  const [isPay, setPay] = useState(false);
  const [resData, setResData] = useState<PayResponse | null>();
  function openDialog(data: PayResponse, type: 'WeChat'|'Alipay', label: string) {
    if(!data.qrcode.startsWith('data:image/png;base64,') && !data.qrcode.startsWith('http')) {
      data.qrcode = 'data:image/png;base64,' + data.qrcode
    }
    timer && clearTimeout(timer)
    setResData(data)
    setPay(false)
    setisOpen(true);
    pollQuery(data.out_trade_no)
  }
  function closeDialog() {
    timer && clearTimeout(timer)
    setResData(null)
    setisOpen(false);
    setPay(false)
  }
  function pollQuery(out_trade_no: string) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      queryPay({out_trade_no: out_trade_no}).then((pay_status) => {
        // 0-未付款，1-已付款,3-失败，-1支付帐单过期或未查询到数据
        if(pay_status === 0) {
          pollQuery(out_trade_no)
        } else if(pay_status === 1) {
          message.success('付款成功')
          setPay(true)
          timer && clearTimeout(timer)
          freshUserInfo()
          // setTimeout(() => {
          //   closeDialog()
          // }, 2000)
        } else {
          closeDialog()
          message.error(pay_status === 3?'付款失败':'支付帐单过期或未查询到数据')
        }
      })
    }, 2000)
  }
  useImperativeHandle(ref, () => {
    return { openDialog }
  })

  return (
    <Modal 
    className={Style.module}
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    width={363} footer={null} centered open={isOpen} onCancel={() => closeDialog()} maskClosable={false}>
      <div className='py-[26px]'>
        <div className='text-[#121212] text-center text-[16px] font-medium'>{resData?.label}</div>
        <div className='relative'>
          <div className=' flex justify-center'>
            {
              resData?.qrcode.startsWith('https://')?
              <iframe className='w-[202px]  my-[20px] h-[210px] justify-center items-center flex' src={resData?.qrcode} title='zfb'></iframe>
              :
              <div className='w-[240px] h-[240px] relative'>
                <img className='w-full h-full' src={resData?.qrcode} alt="" />
                <img className='absolute bg-white w-[48px] rounded-[8px] -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2' src={wxpay} alt="" />
              </div>
            }
          </div>
          <div className='flex justify-center items-end font-medium'>
            <div className='text-[#121212] text-[16px] leading-[35px]'>确认支付：</div>
            <div className='text-[#6884FF] text-[24px]'>¥{resData?.price}</div>
          </div>
          {
            isPay?
            <div className='bg-white left-0 top-0 flex flex-col items-center justify-center absolute w-full h-full'>
              <img className='w-[70px] mb-[20px]' src={payOk} alt="" />
              <div className='text-[#121212] text-[20px]'>支付成功</div>
            </div>:null
          }
        </div>
        <div className='text-[#ACACAC] text-center text-[14px] mt-[12px]'>虚拟商品不支持退款</div>
      </div>
    </Modal>
  )
}

export default forwardRef(QrCode);