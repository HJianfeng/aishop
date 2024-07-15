import { useEffect, useMemo, useState } from 'react'
import { Drawer, Input, Dropdown, Select, Radio, Button, message, Form, Col, Row, Empty, Alert } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import aiIcon from '@/assets/ai_icon.png'
import SideBarUp from '@/assets/sidebar_up.png'
import SideBarDown from '@/assets/sidebar_down.png'
import Style from './style.module.scss'
import type { SloganParams } from '@/service'
import { createSlogan, getSloganInfo, addBpoint } from '@/service'
import { copyToClip } from '@/utils'
import useLoginContext from '@/components/LoginContext/useLoginContext'
import PubSub from 'pubsub-js';

interface Prop {
  container: any
}
const Slogan = ({ container }: Prop) => {
  const { toCheckToken } = useLoginContext()
  const [visible, setVisible] = useState(false);
  const [tipShow, setTipShow] = useState(true);
  async function handleOpenChange(val: boolean) {
    try {
      if(val) await toCheckToken()
      setTipShow(false)
      setVisible(val)
    } catch (error) {
      
    }
  }
  function renderContent() {
    // bg-[#EFF1FB]
    return (
      <div className='bg-[#EFF1FB] relative overflow-hidden h-full'>
        <img onClick={() => handleOpenChange(false)} className='z-10 absolute w-[82px] cursor-pointer top-[-12px] left-1/2 -translate-x-1/2' src={SideBarDown} alt="" />
        { SloganContent() }
      </div>
    )
  }
  return (
    <div className='w-full'>
      <Drawer
        placement="bottom"
        open={visible}
        closable={false}
        mask={false}
        rootStyle={{height: '100%'}}
        bodyStyle={{padding: '0'}}
        rootClassName='absolute w-full top-0 outline-none'
        contentWrapperStyle={{height: '100%', top: 0, boxShadow: 'none'}}
        className='!bg-transparent'
        onClose={() => handleOpenChange(false)}
        getContainer={container.current}
      >
        {renderContent()}
      </Drawer>
      {
        tipShow?
        <div className='relative px-[12px] py-[8px] mx-[10px] mb-[32px] flex items-center bg-[#fffbe6] border border-[#ffe58f] rounded-[8px] text-[14px]'>
          <div className='flex-1 text-[#000]'>主图文案想不好？试试这个</div>
          <div onClick={() => setTipShow(false)} className='text-primary cursor-pointer'>知道啦</div>
          <div className='absolute left-1/2 bottom-[-8px] translate-x-[-50%]' style={{
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '8px solid #ffe58f',
          }}>
          </div>
        </div>:null
      }
      
      <div onClick={() => handleOpenChange(!visible)} 
          className={`${!visible?'border-t border-[#eee]':''} bg-white relative h-[56px] flex items-center justify-center cursor-pointer`}>
        {
          !visible?
            <img className='absolute cursor-pointer w-[82px] top-[-20px] left-1/2 -translate-x-1/2' src={SideBarUp} alt="" />
            :null
        }
        <img className='w-[32px]' src={aiIcon} alt="" />
        <div className='text-[16px] text-[#040404] font-semibold leading-[24px] ml-[5px]'>主图文案</div>
      </div>
    </div>
  )
}

interface sloganResultType  {
  gpt_list:string[], id: number
}
const SloganContent = () => {
  const initParams: SloganParams = {
    main1: '',   //产品
    main2: '',   //类目
    minor1: '',  //用途
    minor2: '',  //成份
    minor3: '',  //功能
    minor4: '',  //产地
    assist1: '', //辅助信息
    keypoint: '',  //侧重点 ，用途，成份，功能，产地 单项选择
    solgan_len: undefined,  //长、短 ，下拉选择
    tone: undefined  //文艺、活泼、幽默、专业  ，下拉选择
  }
  const [loading, setLoading] = useState(false);
  const [sloganResult, setSlogan] = useState<sloganResultType>();
  const [errorKey, setErrorKey] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [params, setParams] = useState<SloganParams>(initParams);
  const [minorKey1, setMinorKey1] = useState<'minor3'|'minor2'>('minor3')
  const [minorKey2, setMinorKey2] = useState<'minor1'|'minor4'>('minor1')
  const map = {
    minor3: '功能',
    minor2: '成份',
    minor1: '用途',
    minor4: '产地',
  }
  const placeholderText = {
    minor3: '产品的功能特点是什么',
    minor2: '产品的成份是什么',
    minor1: '产品的主要用途是什么',
    minor4: '产品的产地是什么',
  }
  useEffect(() => {
    PubSub.subscribe('freshSloganInfo', () => {
      getInfo()
    })
    getInfo()
  }, [])
  async function getInfo() {
    try {
      let res = await getSloganInfo()
      const paramsData = JSON.parse(res.param)
      const result = JSON.parse(res.result)
      if(paramsData) {
        setParams(paramsData)
        if(paramsData.minor2) {
          setMinorKey1('minor2')
        }
        if(paramsData.minor4) {
          setMinorKey2("minor4")
        }
      }
      if(result?.length) {
        setSlogan({id: res.id, gpt_list: result})
        setShowResult(true)
      }
    } catch (error) {
      console.log(error);
    }
  }
  function changeVal(key: string, val: any) {
    setErrorKey([])
    setParams((data: any) => {
      return {...data, [key]: val}
    })
  }
  function switchMinor(key: 'minor1' | 'minor2' | 'minor3' | 'minor4') {
    if(params.keypoint) {
      changeVal('keypoint', '')
    }
    if(key === 'minor3' || key === 'minor2') {
      changeVal(minorKey1, '')
      setMinorKey1(key)
    } else {
      changeVal(minorKey2, '')
      setMinorKey2(key)
    }
  }

  function renderLabel(key: 'minor1' | 'minor2' | 'minor3' | 'minor4', minorKey: any) {
    const isActive = minorKey === key;
    return (
      <div onClick={() => {switchMinor(key)}} className={`${isActive?'bg-primary text-white':''} p-[5px] rounded-[4px]`}>{map[key]}</div>
    )
  }
  const minor1List = [
    { key: '功能', label: renderLabel('minor3', minorKey1) },
    { key: '成分', label: renderLabel('minor2', minorKey1) }
  ]
  const minor2List = [
    { key: '用途', label: renderLabel('minor1', minorKey2) },
    { key: '产地', label: renderLabel('minor4', minorKey2) }
  ]

  const renderMinor = (list: any, minorKey: 'minor1' | 'minor2' | 'minor3' | 'minor4') => {
    return (
      <div>
        <div className='flex items-center'>
          <div className='flex-1'>
            <Dropdown 
              dropdownRender={(node) => (<div className='w-[120px]'>{node}</div>)}
              menu={{items: list, className: Style.dropdown }} 
              trigger={['click']}>
              <div className='flex items-center cursor-pointer h-[32px] text-[14px] text-[#121212]'>
                { map[minorKey] }
                <DownOutlined className='w-[9px] ml-[5px]' />
              </div>
            </Dropdown>
          </div>
          <Radio.Group value={params.keypoint}>
            <Radio 
              value={map[minorKey]}
              onClick={(e) => {changeVal('keypoint', params.keypoint === map[minorKey]?'':map[minorKey])}}
              >加强</Radio>
          </Radio.Group>
        </div>
        <Input
            value={params[minorKey]} 
            className={` ${errorKey.includes(minorKey)?'error-input':''} h-[42px] mb-[10px]`} 
            placeholder={placeholderText[minorKey]}
            onChange={(e) => changeVal(minorKey, e.target.value)}></Input>
      </div>
    )
  }

  function clearParams() {
    setErrorKey([])
    setParams(initParams)
  }
  
  async function submit() {
    try {
      const errorKey: string[] = [];
      let msg = '';
      if(!params.main1) {
        errorKey.push('main1')
        if(!msg) msg = '请填写产品'
      }
      if(!params[minorKey1]) {
        errorKey.push(minorKey1)
        if(!msg) msg = `请填写${map[minorKey1]}`
      }
      if(!params[minorKey2]) {
        errorKey.push(minorKey2)
        if(!msg) msg = `请填写${map[minorKey2]}`
      }
      
      if(!params.solgan_len) {
        errorKey.push('solgan_len')
        if(!msg) msg = '请选择文案长度'
      }
      setErrorKey(errorKey)
      if(errorKey.length) {
        message.error(msg)
        return
      }
      setLoading(true)
      const res = await createSlogan(params)
      setSlogan(res)
      setShowResult(true)
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  function handleBack() {
    setShowResult(false)
  }
  const paramsAnimate = useMemo(() => {
    return showResult?'translate-x-[-100%] opacity-0 invisible':'translate-x-0 opacity-1 visible'
  }, [showResult])
  const resultAnimate = useMemo(() => {
    return showResult?'translate-x-[-100%] opacity-1 visible':'translate-x-0 opacity-0 invisible'
  }, [showResult])
  return (
    <div className='flex overflow-hidden h-full'>
      <div className={`${paramsAnimate} ${Style.beautyScroll} overflow-y-auto px-[17px] pb-[20px] pt-[38px]  w-full flex-shrink-0 transition-all duration-[300ms]`}>
        <Form disabled={loading}>
          <Input 
            value={params.main1} 
            className={`${Style.centerInput} ${errorKey.includes('main1')?'error-input':''} h-[42px] !text-center mb-[10px]`} 
            prefix={<div className='text-[#121212] text-[14px] border-r border-[#D3D3D3] pr-[15px] mr-[11px]'>产品</div>}
            placeholder='产品是什么？'
            onChange={(e) => changeVal('main1', e.target.value)}></Input>
          <Input 
            value={params.main2} 
            className={`${Style.centerInput} h-[42px] !text-center mb-[10px]`} 
            prefix={<div className='text-[#121212] text-[14px] border-r border-[#D3D3D3] pr-[15px] mr-[11px]'>类目</div>}
            placeholder='产品在什么类目？'
            onChange={(e) => changeVal('main2', e.target.value)}></Input>
          {renderMinor(minor1List, minorKey1)}
          {renderMinor(minor2List, minorKey2)}
          <div>
            <div className='mb-[4px]'>辅助提示（可选）</div>
            <div className=''>
              <Input.TextArea 
                className={`${Style.showCount}`}
                value={params.assist1} 
                style={{resize: 'none'}}
                maxLength={50}
                showCount
                placeholder='可以添加一些产品描述、营销等文案，来辅助AI生产'
                onChange={(e) => changeVal('assist1', e.target.value)}
              />
            </div>
          </div>
          <Row className='mt-[10px]' gutter={14}>
            <Col span={12}>
              <Select
                className='w-full'
                value={params.tone}
                size='large'
                onChange={(e) => changeVal('tone', e)}
                placeholder="文案语气"
                options={[
                  { value: '专业', label: '专业' },
                  { value: '活泼', label: '活泼' },
                  { value: '文艺', label: '文艺' },
                ]}
              />
            </Col>
            <Col span={12}>
              <Select
                className={`w-full ${errorKey.includes('solgan_len')?'error-select':''}`}
                value={params.solgan_len}
                size='large'
                onChange={(e) => changeVal('solgan_len', e)}
                placeholder="文案长短"
                options={[
                  { value: '短', label: '短' },
                  { value: '长', label: '长' },
                ]}
              />
            </Col>
          </Row>
        </Form>
        <div className='flex mt-[20px]'>
          <Button disabled={loading} onClick={clearParams} className='!w-[75px] !h-[49px] !rounded-[5px]' size='large'>清空</Button>
          <Button loading={loading} onClick={submit} className='ml-[10px] flex-1 !h-[49px] !rounded-[5px]' type='primary' size='large'>{loading?'拼命计算...':'立即生成'}</Button>
        </div>
      </div>
      <div className={`${resultAnimate} px-[17px] pt-[38px]  w-full flex-shrink-0 transition-all duration-[300ms]`}>
        {Result(sloganResult, loading, submit, handleBack)}
      </div>
    </div>
  )
}

const Result = (sloganResult?: sloganResultType, loading?: boolean, submit?: Function, handleBack?: Function) => {
  async function copy(copyText: string) {
    try {
      if(copyText) {
        copyText = copyText.replace(/^\d\./, '')
      }
      await copyToClip(copyText.trim() || '')
      message.success('复制成功')
      if(sloganResult?.id) {
        try {
          await addBpoint({"action_type": "tool" , "action": "gpt_copy", "root": "", "task_detail_id": Number(sloganResult?.id)})
        } catch (error) {}
      }
    } catch (error) {
      
    }
  }
  return (
    <div className='h-full pb-[20px] '>
      <div  className='text-[#121212] text-[14px] font-semibold mb-[8px]'>文案生产结果</div>
      <Alert 
        message="点击文案可以直接复制" 
        showIcon={false}
        className='mb-[10px]'
        closeIcon={<div className='text-primary text-[14px]'>知道了</div>}
        type="warning" 
        closable 
      />
      <div style={{maxHeight: 'calc(100% - 90px - 50px)'}} className={`${Style.beautyScroll} bg-white px-[20px] rounded-[5px] border border-[#E6E9F9] overflow-y-scroll`}>
        {
          sloganResult?.gpt_list?.length?
          <div>
            {
              sloganResult.gpt_list.map((i, index) => (
                <div onClick={() => {copy(i)}} className={`${index > 0?'border-t':''} cursor-pointer border-dashed border-[#E6E9F9] py-[20px] text-[#121212] text-[14px]`} key={index}>{i}</div>
              ))
            }
          </div>
          : <div className='py-[50px]'><Empty description="暂无数据" /></div>
        }
      </div>
      <div className='flex mt-[20px]'>
        <Button disabled={loading} onClick={() => {handleBack?.()}} className='!w-[75px] !h-[49px] !rounded-[5px]' size='large'>返回</Button>
        <Button loading={loading} onClick={() => {submit?.()}} className='ml-[10px] flex-1 !h-[49px] !rounded-[5px]' type='primary' 
          size='large'>{loading?'拼命计算...':'再来一次'}</Button>
      </div>
    </div>
  )
}
export default Slogan