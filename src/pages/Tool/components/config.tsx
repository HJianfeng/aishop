import { Button, Row, Col, Upload, message, Radio } from 'antd'
import { fabric } from 'fabric'
import type { FabricObject } from '@/utils/types'
import { uploadLimit } from '@/utils'
import { templateUpload } from '@/service';
import { merge, optionsList, addImg, addCircle, addText, addLine, addRect, addTriangle } from './helper'
import { ReactElement, useEffect, useState } from 'react';
import style from '../style.module.scss'
import triangleIcon from '@/assets/triangle.png'
import { Scrollbars } from 'rc-scrollbars';
import GroupConfig from './groupConfig'
import { SelectFont, SelectAlign, FontColor, SetStroke, Setbackground, SetRadius, SetOpacity } from './options'

function RightConfig({ canvas, curSelectObj } :{canvas?: fabric.Canvas , curSelectObj?: FabricObject|null}) {
  const objects = canvas?.getActiveObjects() || []

  const objType = curSelectObj?.get('type')
  // 不是组合，但是选中了多个
  const isSelectMultiple = objects.length > 1
  // 是否组合
  const isGroup = objType === 'group'
  if(!canvas) {
    return (<></>)
  }
  return (
    <div className="w-[310px]" style={{ height: 'calc(100% - 40px)'}}>
      {
        (isSelectMultiple && canvas)?
        <div className='px-[25px]'>
          <Button onClick={() => {merge(canvas)}} type='primary' className='w-full h-[36px] text-[14px]'>
            成组
          </Button>
        </div>
        :
        <>
          { curSelectObj && curSelectObj.id !== 'main-img'?
              !isGroup?
              <div className='px-[25px]'>
              <FabricOptions canvas={canvas} curSelectObj={curSelectObj} />
              </div>
              :
              <div className='h-full'>
                <Scrollbars autoHide={true} style={{height: 'calc(100% - 42px)'}}>
                  <div className='px-[25px]'>
                    {/* <GroupConfig canvas={canvas} curSelectObj={curSelectObj} /> */}
                    {
                      curSelectObj?._objects?.map((i, index) => (
                        <div key={index} className='border-b border-[#ccc] mb-[16px] last:border-none'>
                          <FabricOptions canvas={canvas}  curSelectObj={i} />
                        </div>
                      ))
                    }
                  </div>
                </Scrollbars>
                <div className='h-[42px] flex items-center px-[25px]'>
                  <Button onClick={() => {merge(canvas, true)}} type='primary' className='w-full h-[36px] text-[14px]'>
                    解组
                  </Button>
                </div>
              </div>
            :
            (
              <div className='px-[25px]'>
                <AddObject canvas={canvas} />
              </div>
            )
          }
        </>
      }
      
    </div>
  )
}


export default RightConfig;

function AddObject({canvas}:{ canvas: fabric.Canvas}) {
  return (
    <div>
      <Row gutter={12}>
        <Col span={12} className='mb-[12px]'>
          <Button 
            onClick={() => {addText(canvas)}}
            className='w-full h-[36px] text-[14px] text-primary bg-white border-primary'>
            文字
          </Button>
        </Col>
        <Col span={12} className='mb-[12px]'>
          <UploadImg 
            renderChild={() => (
              <Button 
                className='w-full h-[36px] text-[14px] text-primary bg-white border-primary'>
                图片
              </Button>
            )}
            callback={(url: string) => {addImg(canvas, url)}} />
        </Col>
        <Col span={12}>
          <UploadImg 
            renderChild={() => (
              <Button 
                className='w-full h-[36px] text-[14px] text-primary bg-white border-primary'>
                氛围
              </Button>
            )}
            callback={(url: string) => {addImg(canvas, url, true)}} />
        </Col>
      </Row>
      <div className='text-[#999] mt-[12px] mb-[6px]'>元素</div>
      <Row gutter={8}>
        <Col span={8}>
          <div onClick={() => {addRect(canvas)}} className='w-[70px] h-[70px] p-[10px] hover:bg-[#eee] flex items-center justify-center cursor-pointer'>
            <div className='w-full h-full border-[2px] border-[#000]'></div>
          </div>
        </Col>
        <Col span={8}>
          <div onClick={() => {addCircle(canvas)}}  className='w-[70px] h-[70px] p-[10px] hover:bg-[#eee] flex items-center justify-center cursor-pointer'>
            <div className='w-full h-full border-[2px] rounded-full border-[#000]'></div>
          </div>
        </Col>
        <Col span={8}>
          <div onClick={() => {addLine(canvas, true)}}  className='w-[70px] h-[70px] p-[10px] hover:bg-[#eee] flex items-center justify-center cursor-pointer'>
            <div className='w-full h-[2px] bg-[#000]'></div>
          </div>
        </Col>
        <Col span={8} className='mt-[5px]'>
          <div onClick={() => {addLine(canvas)}}  className='w-[70px] h-[70px] p-[10px] hover:bg-[#eee] flex items-center justify-center cursor-pointer'>
            <div className='w-[2px] h-full bg-[#000]'></div>
          </div>
        </Col>
        <Col span={8} className='mt-[5px]'>
          <div onClick={() => {addTriangle(canvas)}}  className='w-[70px] h-[70px] p-[10px] hover:bg-[#eee] flex items-center justify-center cursor-pointer'>
              <img className='w-full h-full' src={triangleIcon} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  )
}
function UploadImg({ callback, renderChild }: { 
  callback:(url: string) => void, 
  renderChild: () => ReactElement }, 
  ) {
  async function customRequest(option: any) {
    const fileType = option.file.type
    if(!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(fileType)) {
      message.error('暂时不支持此类图片格式哦~')
      return
    }
    try {
      await uploadLimit(option.file);
      let formdata = new FormData() as any;
      formdata.append("file", option.file);
      templateUpload(formdata).then((res: string) => {
        callback(res)
      }).catch((error) => {
        message.error(error.message || '图片上传失败');
      }).finally(() => {
      })
    } catch (error) {
        
    }
  }
  return (
    <Upload
      name='file'
      accept='image/*'
      showUploadList={false}
      className={`w-full flex ${style.upload}`}
      style={{width: '100%'}}
      maxCount={1}
      customRequest={customRequest}
    >
      {renderChild()}
    </Upload>
  )
}

export function FabricOptions({ curSelectObj, canvas }: { curSelectObj: FabricObject, canvas: fabric.Canvas }) {
  let objType: string = curSelectObj.get('type') || ''
  if(objType === 'activeSelection' && curSelectObj._objects?.length === 1) {
    objType = curSelectObj._objects[0].get('type') || ''
  }
  const [isFill, setIsFill] = useState(false)
  // const isImage = objType === 'image'
  // const isText = objType === 'textbox'
  // const isLine = objType === 'line'
  const isRect = objType === 'rect'
  const isCircle = objType === 'circle'
  const isTriangle = objType === 'triangle'
  
  useEffect(() => {
    if(isRect || isCircle || isTriangle) {
      if(curSelectObj.stroke) {
        setIsFill(false)
      } else {
        setIsFill(true)
      }
    }
  }, [])
  const isShape = isRect || isCircle || isTriangle
  const textMap: any = {
    'rect': '矩形',
    'circle': '圆形',
    'triangle': '三角形',
  }
  function changeType(val: boolean) {
    setIsFill(val)
    if(val) {
      curSelectObj.set({
        stroke: '',
        fill: '#ffffff'
      })
    } else {
      curSelectObj.set({
        fill: '',
        stroke: '#000000',
      })
    }
    canvas.renderAll()
  }
  return (
    <div className='mb-[10px]'>
      {
        (isRect || isCircle || isTriangle)?
        <div className='flex items-center'>
          <div className='mr-[20px] text-[14px]'>{textMap[objType]}</div>
          <Radio.Group value={isFill} onChange={(e: any) => {changeType(e.target.value)}}>
            <Radio value={false}>描边</Radio>
            <Radio value={true}>填充</Radio>
          </Radio.Group>
        </div>
        : null
      }
      {
        optionsList.map(i => {
          if(i.use.includes(objType || '')) {
            return (
              <div key={i.id}>
                { i.id === 'font'? <SelectFont canvas={canvas} curSelectObj={curSelectObj} /> : null }
                { i.id === 'layout'? <SelectAlign canvas={canvas} curSelectObj={curSelectObj} /> : null }
                { i.id === 'fontColor'? <FontColor canvas={canvas} curSelectObj={curSelectObj} /> : null }
                { i.id === 'borderRadius'? <SetRadius canvas={canvas} curSelectObj={curSelectObj} /> : null }
                { i.id === 'opacity'? <SetOpacity canvas={canvas} curSelectObj={curSelectObj} /> : null }

                { (i.id === 'stroke' && (!isShape || (isShape && !isFill)))? 
                  <SetStroke canvas={canvas} curSelectObj={curSelectObj} /> : null 
                }
                { i.id === 'background'? <Setbackground isFill={isFill} canvas={canvas} curSelectObj={curSelectObj} /> : null }
              </div> 
            )
          }
          return null
         }
        )
      }
    </div>
  )
}