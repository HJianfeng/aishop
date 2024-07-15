import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { CloseCircleFilled, CheckOutlined, AliwangwangOutlined, DingtalkOutlined, AlipayCircleOutlined} from '@ant-design/icons'
import { Modal, Button, } from 'antd'
import NavBar from './NavBar'
import Style from './style.module.scss'
import wxpay from '@/assets/wxpay.png'
import QrCode from './qrCode'
import { payVip, payEnergy, PayVipParams, PayEnergyParams, PayResponse } from '@/service'

const REACT_APP_MODE = process.env.REACT_APP_MODE
const Recharge = (prop: any, ref: any) => {
  const [isOpen, setisOpen] = useState(false);
  const [curTab, setCurTab] = useState(REACT_APP_MODE === 'ali'?'energy':'vip');
  const [selectVip, setSelectVip] = useState<1 | 2>(1);
  const [selectEnergy, setSelectEnergy] = useState(300);
  const [showText, setShowText] = useState(false);
  const QrCodeRef: any = useRef()
  const lists = [
    {
      key: 'energy',
      name: '算力包'
    },
  ]
  if(!REACT_APP_MODE) {
    lists.unshift({
      key: 'vip',
      name: '会员'
    })
  }
  const VipList= [
    { price: '19', origin: '29', unit: '月', value: 1, summary: '赠送100星星' },
    { price: '39', origin: '69', unit: '季', value: 2, summary: '赠送300星星' },
  ]
  const EnergyList= [
    { price: '39', unit: '300点', value: 300, summary: getText('120', '0.32') },
    { price: '59', unit: '700点', value: 700, summary: getText('280', '0.21') },
    { price: '99', unit: '1400点', value: 1400, summary: getText('560', '0.176') },
  ]
  function openDialog(isShowText?: boolean) {
    setShowText(!!isShowText)
    setisOpen(true);
  }
  useImperativeHandle(ref, () => {
    return { openDialog }
  })
 async function toPay(type: 'WeChat'|'Alipay') {
  try {
    let res: PayResponse = {
      qrcode: '',
      out_trade_no: '',
      label: '',
      price: ''
    }
    if(curTab === 'vip') {
      const data: PayVipParams = {
        member_type: selectVip,
        pay_type: type === 'WeChat'? 1: 2
      }
      res = await payVip(data)
      res.label = `会员${selectVip === 1?'月':'季'}卡`
      const price = VipList.find(i => i.value === selectVip)?.price
      res.price = price || ''
    } else {
      const data: PayEnergyParams = {
        scores: selectEnergy,
        pay_type: type === 'WeChat'? 1: 2
      }
      res = await payEnergy(data)
      res.label = `算力${selectEnergy}点`
      const price = EnergyList.find(i => i.value === selectEnergy)?.price
      res.price = price || ''
    }
    QrCodeRef.current?.openDialog(res, type)
    setisOpen(false);
  } catch (error) {
      
  }
 }
  return (
  <Modal 
    className={Style.module}
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    width={730} footer={null} centered open={isOpen} onCancel={() => setisOpen(false)}>
    <div className='h-[530px] flex'>
      <Left showText={showText} />
      <div className='flex flex-col flex-1 relative'>
        <div className={`${lists.length===1?'px-[42px]':'px-[90px]'} mt-[47px]`}>
          <NavBar current={curTab} lists={lists} onChange={(val: string) => setCurTab(val)} />
        </div>
        <div className='flex-1'>
          {
            curTab === 'vip'?
            <Vip selectVip={selectVip} VipList={VipList} setData={(val) => {setSelectVip(val)}} /> : 
            <Energy selectEnergy={selectEnergy} EnergyList={EnergyList} setData={(val) => {setSelectEnergy(val)}}  />
          }
        </div>
        {
          REACT_APP_MODE === 'ali'?
          <div className='px-[60px] mb-[38px]'>
            <div className='text-[#ACACAC] text-[14px]'>内购功能暂时没有开通请点击下面<span className='text-[#121212]'>旺旺</span>或<span className='text-[#121212]'>钉钉</span></div>
            <div className='flex justify-between mt-[19px]'>
              <a 
                href="https://www.taobao.com/go/market/webww/ww.php?ver=3&touid=%E7%8E%A9%E8%BD%AC%E4%BA%92%E5%8A%A8&siteid=cntaobao&status=1&charset=utf-8" 
                target='_blank'
                className='bg-primary rounded-[8px] flex items-center justify-center !text-white w-[122px] h-[46px] text-[16px] font-medium' type='primary' rel="noreferrer">
                <div className='flex items-center'><AliwangwangOutlined  className='text-[26px] font-normal mr-[4px]' />联系旺旺</div>
              </a>
              <a 
                href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=1gv_8o2c9f5hdk" 
                target='_blank'
                className='bg-primary rounded-[8px] flex items-center justify-center !text-white w-[122px] h-[46px] text-[16px] font-medium' type='primary' rel="noreferrer">
                <div className='flex items-center'><DingtalkOutlined  className='text-[26px] font-normal mr-[4px]' />联系钉钉</div>
              </a>
            </div>
          </div>
          :null
        }
        {
          !REACT_APP_MODE?
          <div className='px-[60px] mb-[38px] flex items-center'>
            <Button onClick={() => {toPay('WeChat')}} type='primary' className='mr-[37px] w-[122px] h-[46px] text-[16px] font-medium !bg-[#15BA12] text-white'>
              <div className='flex items-center justify-center'>
                <img className='w-[23px] mr-[5px]' src={wxpay} alt="" />
                <div>微信支付</div>
              </div>
            </Button>
            <Button onClick={() => {toPay('Alipay')}} type='primary' className='w-[122px] h-[46px] text-[16px] font-medium !bg-[#6884FF] text-white'>
              <div className='flex items-center justify-center'>
                <AlipayCircleOutlined className='text-[19px] mr-[5px]' />
                <div>支付宝</div>
              </div>
            </Button>
          </div>
          : null
        }
      </div>
    </div>
    <QrCode ref={QrCodeRef} />
  </Modal>
  )
}
function Vip({selectVip, setData, VipList} : {selectVip: number, VipList:any[], setData: (val: 1 | 2) => void}) {

  const activeStyle = {
    backgroundColor: 'rgba(104, 132, 255, 0.20)',
    border: '2px solid #6884FF',
    borderRadius: '10px'
  }
  return (
    <div>
      <div className='mt-[24px] px-[49px]'>
        <Alert text="会员权益：每天获得50算力，当天随心所欲" />
      </div>
      <div className='mt-[27px] px-[23px]'>
        {
          VipList.map((i, index) =>  (
            <div key={index} className={` ${index===0?'border-b border-dashed border-[#D3D3D3] pb-[31px] mb-[28px]':''}`}>
              <div 
                onClick={() => { !REACT_APP_MODE && setData(i.value as any) }}
                style={i.value === selectVip && !REACT_APP_MODE?activeStyle:{}} 
                className='border-[2px] border-[transparent] px-[26px] cursor-pointer flex h-[63px] items-center'>
                <div className='flex items-end w-full'>
                  <Price item={i} />
                  <div className='ml-[14px] flex-1 text-[#ACACAC] text-[14px] line-through'>原价：{i.origin}</div>
                  <div className='text-[14px]'>{i.summary}</div>
                </div>
              </div>
            </div>
            )
          )
        }
      </div>
    </div>
  )
}
function getText(v1: string, v2: string) {
  return (
    <div className='text-[12px]'>最多生成<span className='text-primary'>{v1}</span>张，<span className='text-primary'>{v2}</span>元/张</div>
  )
}
function Energy({selectEnergy, setData, EnergyList} : {selectEnergy: number, EnergyList: any[], setData: (val: number) => void}) {
  
  
  const activeStyle = {
    backgroundColor: 'rgba(104, 132, 255, 0.20)',
    border: '2px solid #6884FF',
    borderRadius: '10px'
  }
  return (
    <div className=''>
      <div className='px-[49px] mt-[24px]'>
        <Alert text="算力包的使用期限为60天" />
      </div>
      <div className='px-[21px] mt-[27px]'>
        {
          EnergyList.map((i, index) =>  (
            <div 
            key={index} 
            className='mb-[18px] border-[2px] border-[transparent] cursor-pointer px-[16px]  h-[63px] flex items-center w-full'
            onClick={() => { !REACT_APP_MODE && setData(i.value) }}
            style={i.value === selectEnergy && !REACT_APP_MODE?activeStyle:{}} >
              <div className={`flex w-full items-end`}>
                <Price item={i} />
                <div className='flex-1 border-b border-dashed border-[#D3D3D3]'></div>
                <div className='text-[14px]'>{i.summary}</div>
              </div>
            </div>
            )
          )
        }
      </div>
    </div>
  )
}
function Alert({text}: {text: string}) {
  return (
    <div className='h-[30px] flex justify-center items-center px-[8px] bg-[#FFEEB9] border border-[#F3DD99] text-[#D1A82A]'>{text}</div>
  )
}

function Left({showText}:{showText:boolean}) {
  const text = [
    '赠送算力资源，每日发放算力',
    '专享GPU算力，更加稳定',
    '无需担心设计版权问题',
    '所有功能全部可用',
    '无限量AI主图文案算力',
    '客服人工服务，在线答疑',
  ]
  return (
    <div className='w-[328px] h-full bg-[rgba(104,132,255,0.1)]'>
      <div className='text-[#121212] pl-[64px]  text-[24px] font-medium'>
        <div className='flex items-center mt-[44px]'>
          <div>成为AIsoup</div>
          <div className='ml-[6px]'>
            <span className='text-white rounded-[5px] text-[16px] font-semibold px-[5px] py-[2px]' style={{
              boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.1)',
              background:'linear-gradient(297deg, #5F88FF 0%, #6278DA 100%)'
            }}>PRO</span>
          </div>
        </div>
        <div>提升产图能力</div>
      </div>
      <div className='text-[#121212] text-[14px] mt-[44px] pl-[57px]'>
        {
          text.map((i:string) => (
            <div key={i} className='mb-[14px] flex items-center'><CheckOutlined className='text-primary mr-[20px]' /> {i}</div>
          ))
        }
        {
          showText?
          <div className='mt-[50px] text-[16px] font-medium'>
            <div>算力已经用完，请支持我们呦，</div>
            <div>我们会越来越好~</div>
          </div>: null
        }
      </div>
    </div>
  )
}

function Price({ item }: any) {
  return (
    <div className='flex items-end text-[#121212]'>
      <div className='flex items-end'>
        <div className='text-[24px] leading-[1.1]'>￥</div>
        <div className='text-[42px] leading-[1] font-medium'>{item.price}</div>
      </div>
      <div className='text-[24px] leading-[1.7] mx-[2px] font-normal'>/</div>
      <div className='text-[16px] leading-[1.9] '>{item.unit}</div>
    </div>
  )
}
export default forwardRef(Recharge);