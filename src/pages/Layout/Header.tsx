import { useRef, useState, useEffect } from 'react'
import {  Modal, message, Popover, Rate, Input, Space, Button } from 'antd'
import useLoginContext from '@/components/LoginContext/useLoginContext'
import { CloseCircleFilled ,AliwangwangOutlined} from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import {  feedBackSubmit } from '@/service'
import {  getLocalStorage } from '@/utils'
import FeedBackCom from '@/components/FeedBack'
import RechargeScore from '@/components/RechargeScore'
import Recharge from '@/components/RechargeScore/recharge'
import UserInfo from './UserInfo'
import { emitter } from '@/utils/eventBus'
import PubSub from 'pubsub-js';
import StarIcon from '@/assets/star.png'
import chat from '@/assets/chat.png'
import avatar from '@/assets/avatar.png'
import codeIcon from '@/assets/code.png'

const REACT_APP_MODE = process.env.REACT_APP_MODE
export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setiIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [headerData, setHeaderData] = useState<any>()
  const [userInfo, setUserInfo] = useState<any>()
  const [feedBack, setFeedBack] = useState<string>('')
  const [rateNum, setRateNum] = useState<number>(0)
  const feedbackRef: React.MutableRefObject<any> = useRef(null);
  const rechargeScoreRef: React.MutableRefObject<any> = useRef(null);
  const rechargeRef: React.MutableRefObject<any> = useRef(null);
  const { toLogin } = useLoginContext()
  
  useEffect(() => {
    PubSub.subscribe('freshUserScores', () => {
      setUserInfo(getLocalStorage('user') || null)
    })
    PubSub.subscribe('openRecharge', () => {
      openRecharge()
    })
    const evt: any = emitter.on('headerData', (data) => {
      setHeaderData(data)
    })
    setUserInfo(getLocalStorage('user') || null)
    return () => {
      emitter.removeListener(evt, (data) => {
        setHeaderData(data)
      });
    };
  }, []);
  function openRecharge() {
    rechargeRef.current?.openDialog(true)
  }
  function renderFeedback() {
    return (
      <div className='w-[270px]'>
        <div className='pb-[9px] mb-[9px] font-semibold flex items-center text-[16px] border-b border-[#F5F5F5]'>
          <div className='text-[#121212] flex-1'>我的算力：<span className='text-primary'>{userInfo?.scores || 0}</span></div>
          {
            REACT_APP_MODE === 'channel'  ?null:
            <Button onClick={() => {rechargeRef.current?.openDialog();setPopoverOpen(false)}} className='!border-primary text-primary'>充值</Button>
          }
        </div>
        {
          (REACT_APP_MODE === 'channel' || (!userInfo?.daily_scores))?null:
          <div className='mb-[10px]'>
            <div className='flex mb-[10px] items-center text-[14px] text-[#121212] font-medium'>
              <div className='bg-primary rounded-full w-[9px] h-[9px] mr-[13px]' />
              日更算力
              <div className='ml-[4px] bg-primary text-white font-medium rounded-[12px] px-[8px]'>会员享受</div>
            </div>
            <div className='text-[#121212] text-[14px] ml-[22px]'>每日0点将更新{userInfo?.daily_scores || 0}点,当日可用</div>
          </div>
        }
       
        <div>
          <div className='flex mb-[10px] items-center text-[14px] text-[#121212] font-medium'>
            <div className='bg-primary rounded-full w-[9px] h-[9px] mr-[13px]' />
            消耗规则
          </div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>背景融合<span className='mx-[20px]'>消耗</span>10点</div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>一键抠图<span className='mx-[20px]'>消耗</span>5点</div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>高清修复<span className='mx-[20px]'>消耗</span>5点</div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>涂抹消除<span className='mx-[20px]'>消耗</span>5点</div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>无损放大<span className='mx-[20px]'>消耗</span>5点</div>
          <div className='text-[#121212] text-[14px] ml-[22px]'>主图文案<span className='mx-[20px]'>限免</span></div>
        </div>
        <div onClick={switchDialog} className='flex border mb-[4px] border-[#f5f5f5] hover:border-primary hover:text-primary text-[#121212]  mt-[22px] justify-center bg-[#f5f5f5] items-center rounded-[5px] h-[45px] w-full cursor-pointer'>
          <span className='text-[14px]'>意见反馈</span>
        </div>
      </div>
    )
  }
  function switchDialog(e?: any) {
    e?.stopPropagation()
    setPopoverOpen(false)
    setiIsOpen(!isOpen)
  }
  async function submit() {
    const data = {
      content: feedBack,
      score: rateNum.toString()
    }
    try {
      await feedBackSubmit(data)
      message.success('提交成功')
      switchDialog()
      setFeedBack('')
      setRateNum(0)
    } catch (error: any) {
      message.error(error.message || '')
    }
  }

  function setFeedBackOpen() {
    feedbackRef.current?.openDialog()
  }

  function setRecharge() {
    rechargeScoreRef.current?.openDialog()
  }
  function toNewPage(url: any) {
    const w: any=window.open('about:blank');
    w.location.href=url
  }
  return (
    <div className="h-[67px] pl-[20px] pr-[30px] flex items-center">
      <div className='flex-1 flex w-[0]'>
        {
          headerData && headerData.title?
          <>
            <div className='text-[#040404] shrink-0 text-[16px] font-semibold'>{headerData.title}</div>
            <div className='text-[#ACACAC] truncate text-[16px] font-semibold ml-[10px]'>{headerData.summary}</div>
          </> : null
        }
      </div>
      {
      userInfo?
      <>
        <div className={`flex items-center`} >
          {
            userInfo?.user_type === 8?
              <>
              <Popover  trigger={['click']} content={() => (
                <div className='whitespace-nowrap text-center px-[10px]'>
                  <div onClick={() => {navigate('/admin')}} className='text-primary mb-[10px] cursor-pointer'>数据看板</div>
                  <div onClick={() => {navigate('/model/template')}} className='text-primary mb-[10px] cursor-pointer'>模版工具</div>
                  <div onClick={() => {setFeedBackOpen()}} className='text-primary mb-[10px] cursor-pointer'>反馈列表</div>
                  <div onClick={() => {setRecharge()}} className='text-primary mb-[10px] cursor-pointer'>充积分</div>
                  <div onClick={() => {navigate('/admin/collection')}} className='text-primary mb-[10px] cursor-pointer'>风格收集列表</div>
                </div>
              )}>
              <div className="cursor-pointer w-[81px] justify-center rounded-full border-[2px] border-[#EAECF6] h-[44px] px-[10px] flex items-center mr-[10px] text-[14px]">
                {/* <img className='w-[20px] mr-[9px]' src={chat} alt="" /> */}
                <span className='text-[14px] text-[#121212] font-semibold'>管理</span>
              </div>
              </Popover>
              </>
              : null
          }
          {
            userInfo?.user_type === 2 || userInfo?.user_type === 8?
              <div onClick={() => { toNewPage('/model') }} className="cursor-pointer  justify-center rounded-full border-[2px] border-[#EAECF6] h-[44px] px-[20px] flex items-center mr-[10px] text-[14px]">
                <span className='text-[14px] text-[#121212] font-semibold'>制作风格</span>
              </div>
              : null
          }
          <div onClick={() => switchDialog()} className="cursor-pointer w-[81px] justify-center rounded-full border-[2px] border-[#EAECF6] h-[44px] px-[10px] flex items-center mr-[10px] text-[14px]">
            <img className='w-[20px] mr-[9px]' src={chat} alt="" />
            <span className='text-[14px] text-[#121212] font-semibold'>反馈</span>
          </div>
          <Popover open={popoverOpen} onOpenChange={(val) => setPopoverOpen(val)} trigger={['click']} content={renderFeedback()}>
            <div className="cursor-pointer min-w-[80px] justify-center rounded-full border-[2px] border-[#EAECF6] h-[44px] px-[10px] flex items-center mr-[10px] text-[14px]">
              <img className='w-[18px] h-[18px] mr-[12px]' src={StarIcon} alt="" />
              <span className='text-[14px] text-[#121212] font-semibold'>{userInfo?.scores || 0}</span>
            </div>
          </Popover>
          
          <UserInfo />
        </div>
        <Modal 
          closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
          width={448} okText="确定" footer={null}
          cancelText="取消" centered open={isOpen} onCancel={() => switchDialog()}>
            <div className='flex items-center'>
              <div className={` text-[#121212] text-left flex-1 text-[22px] font-medium relative`}>意见留言板</div>
              {
                REACT_APP_MODE === 'ali'?
                <div className='flex items-center text-[13px]'>
                  <div>在线反馈：</div>
                  <a 
                    href="https://www.taobao.com/go/market/webww/ww.php?ver=3&touid=%E7%8E%A9%E8%BD%AC%E4%BA%92%E5%8A%A8&siteid=cntaobao&status=1&charset=utf-8" 
                    target='_blank'
                    className='bg-primary rounded-[3px] flex items-center justify-center !text-white w-[103px] h-[25px] text-[16px] font-medium' type='primary' rel="noreferrer">
                    <div className='flex items-center'><AliwangwangOutlined className='text-[16px] font-normal mr-[2px]' />联系旺旺</div>
                  </a>
                </div>
                :
                <div className='w-[70px] absolute right-[24px] top-[10px]'>
                  <div className='w-full flex justify-center'>
                    <img className='w-full' src={codeIcon} alt="" />
                  </div>
                  <div className='bg-primary w-[70px] text-white flex items-center justify-center'>
                    <div className='w-0 h-0 border-[3px] border-transparent mr-[4px] top-[-1px] relative' style={{borderBottomColor: '#fff'}}></div>  
                    <div className='text-[12px]'>联系我们</div>
                  </div>
                </div>
              }
              
            </div>
            <div className='flex items-center h-[35px]'>
              <div className='mr-[10px] leading-[35px] text-[#121212] text-[16px] font-semibold'>使用评分</div>
              <Rate className='h-full' value={rateNum} onChange={setRateNum} allowHalf />
            </div>
            <div className='mt-[25px]'>
              <Input.TextArea 
                value={feedBack} 
                placeholder='说出你使用后的想法，对于我们这个ai小团队很有用哦~'
                style={{ height: 300, resize: 'none' }}
                onChange={(e) => setFeedBack(e.target.value)}
              />
            </div>
            <div className='flex justify-center mt-[20px]'>
              <Space size={20}>
                <Button className='!text-[22px] !text-[#121212] w-[111px] !h-[50px] !rounded-[5px]' size='large' onClick={switchDialog}>取消</Button>
                <Button className='!text-[22px]  w-[111px] !h-[50px] !rounded-[5px]' size='large' onClick={submit} type="primary">确定</Button>
              </Space>
            </div>
        </Modal>
        <FeedBackCom ref={feedbackRef} />
        <RechargeScore ref={rechargeScoreRef}/>
        <Recharge ref={rechargeRef} />
      </>: 
      <div onClick={toLogin} className='rounded-full w-[44px] h-[44px] flex justify-center items-center border-[2px] cursor-pointer border-[#EAECF6]'>
        <img className='w-[28px] h-[26px]' src={avatar} alt="" />
      </div>
      }
    </div>
)
}