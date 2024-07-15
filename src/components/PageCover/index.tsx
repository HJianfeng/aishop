import { Button, Space, Upload } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import MainImg from '@/assets/cover.png'
import { DemoItem } from '@/interface'
import BgIcon from '@/assets/bg.jpeg'
import Style from './style.module.scss'
import useLoginContext from '@/components/LoginContext/useLoginContext'
import { useMemo } from 'react'

interface Prop {
  title: string
  summary: string
  recommendList?: DemoItem[]
  toUpload?: () => void
  subElement?: any
  uploadButton?: any
  createDemo?: (item: DemoItem) => void
  cover?:string
  demoTitle?:string
  type?:string
  showRecommend?: boolean
  customRequest?: (data: any) => void
}
const { Dragger } = Upload;
const PageCover = ({ title, summary, recommendList, toUpload, customRequest, uploadButton, subElement, createDemo, cover, demoTitle, type, showRecommend }: Prop) => {
  const { toCheckToken } = useLoginContext()
  async function beforeUpload(e: any) {
    const a = e.target as HTMLElement
    if(a.tagName.toLowerCase() !== 'input') {
      try {
        await toCheckToken()
      } catch (error) {
        e.stopPropagation();
      }
    }
  }
  const recommendShow =useMemo(() => {
    return recommendList && recommendList?.length > 0 && showRecommend
  }, [showRecommend, recommendList])
  return (
    <div className={`px-[20px] ${recommendShow?'h-[calc(100vh-67px)] flex flex-col':''}`}>
      <div className="text-center text-[#040404] mb-[5px] text-[32px] font-semibold">{title}</div>
      <div className="text-center text-[#121212] text-[20px]">{summary}</div>
      {
        title === '背景融合'?
        <div className='flex mt-[10px] justify-center'>
          <div className='py-[8px] w-[340px] justify-center flex items-center bg-[#ffe58f] rounded-[4px] text-[14px] text-[#121212] '>
            适用于快消品、美妆等小物件产品
          </div>
        </div>
        :null
      }
      <div className={`${recommendShow?'flex-1 h-0 max-h-[320px]':''}  flex mt-[20px] justify-center`}>
        {
          customRequest?
          <Dragger
            name='file'
            accept='image/*'
            showUploadList={false}
            className={`${Style.upload} relative`}
            maxCount={1}
            customRequest={customRequest}
          >
            <img onClick={(e) => {e.stopPropagation()}} src={cover || MainImg} className='cursor-default w-[600px]' alt="" />
            <div 
              onClick={(e) => {e.stopPropagation()}} 
              className='hidden mask-upload 
              border-[2px] border-dashed border-primary rounded-[10px]
              absolute w-full h-full left-0 top-0 bg-white/80 '>
              <div className='flex h-full items-center justify-center flex-col'>
                <CloudUploadOutlined className='text-[50px] text-primary' />
                <div className='text-[18px] mt-[10px] text-primary'>将图片拖拽到这里上传</div>
              </div>
            </div>
          </Dragger>
        : 
        <img src={cover || MainImg} className={`object-contain ${recommendShow?'h-full':'w-[600px]'}`} alt="" />
        }
      
      </div>
      {
        subElement?<div className='text-center my-[38px]'>{subElement}</div>:null
      }
      <div onClickCapture={beforeUpload} className='flex mt-[30px] justify-center'>
        {
          uploadButton?
          uploadButton:
          <Button onClick={toUpload} className='w-[155px] h-[51px] text-[22px] flex items-center' type='primary'><CloudUploadOutlined /> 上传图片</Button>
        }
      </div>
      {
        recommendShow?
        <div className='min-h-[196px] flex mb-[30px] justify-center flex-col items-center'>
          <div className='h-[1px] w-[294px] bg-[#D3D3D3] my-[18px]'></div>
          <div className='text-[#ACACAC] text-[16px]'>{demoTitle || '你也可以试试这些商品图片进行融合哟~'}</div>
          <Space className='mt-[15px]' size={20}>
            {
              recommendList?.map((item, index) => (
                <div
                  style={type === 'cutout' ?{background: `url(${BgIcon}) repeat`}:{}}
                  onClick={async () => {
                    try {
                      await toCheckToken()
                      createDemo && createDemo(item)
                    } catch (error) {}
                  }} 
                  key={index} className='bg-[#D3D3D3] cursor-pointer rounded-[4px] w-[120px] h-[120px]'>
                  <img src={item.DemoImg} alt="" />
                </div>
              ))
            }
          </Space>
        </div>
        :
        null
      }
      
    </div>
  )
}

export default PageCover