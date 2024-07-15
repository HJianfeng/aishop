import { fabric } from 'fabric'
import { Button, Modal } from 'antd'
import TextOptions from './textOptions'
import { useState, useRef } from 'react'
import AmbientImgList from './ambientImgList'
// import AmbientOptions from './AmbientOptions'
import AmbientOptions from './ambientObjectOptions'
import BackIcon from '@/assets/back.png'


interface IProps {
  canvas: fabric.Canvas | null
  canvasClass: any
  createText: () => void
  mergeImg: () => void
  backStepText: () => void
  textStateIndex: number
}
function AmbientConfig({ canvas, createText, canvasClass, mergeImg, backStepText, textStateIndex }: IProps) {
  const activeObjects: any = canvas?.getActiveObject()
  const AmbientImgListRef = useRef<any>(null)
  const [curTab, setCurTab] = useState(0)
  function handelOptions(data: { type: string, value: any }) {
    setOptions({ ...data, canvasClass })
    if(activeObjects) canvas?.setActiveObject(activeObjects)
  }

  const listTab = [
    { label: '模版样式', id: 0 },
    { label: '编辑样式', id: 1 },
  ]
  const objType= activeObjects?.type
  const isAmbient = (activeObjects as any)?.id?.startsWith('ambient')

  function reset() {
    if(!canvas) return
    Modal.confirm({
      title: '提示',
      content: '是否确定要重置？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if(AmbientImgListRef?.current) {
          AmbientImgListRef?.current?.setAmbient(null)
        } else {
          const objs = canvas.getObjects()
          objs.forEach((i:any) => {
            if(i?.id?.indexOf('ambient') >= 0 || i?.type === 'group') canvas.remove(i)
          })
          canvasClass.useAmbientId = null
        }
        canvasClass.clear(true)
      },
      onCancel() {},
    })
  }
  function backStep() {
    if(textStateIndex === 0) {
      canvasClass.useAmbientId = null
    }
    backStepText()
  }
  return (
  <div className='flex flex-col h-full'>
    <div className='flex relative items-center justify-between mx-[25px] pb-[8px] mb-[20px]'>
      {
        listTab.map(i => (
          <div className={`${i.id === curTab?'text-primary':'text-[#ACACAC]'} h-full flex w-[64px] justify-center items-center cursor-pointer text-[14px] font-medium`} key={i.id} onClick={() => {setCurTab(i.id)}}>
            {i.label}
          </div>
        ))
      }
      <div style={{left: curTab * 186 + 'px'}} className='absolute transition-all h-[4px] w-[64px] rounded-[3px] bg-primary bottom-0'></div>
    </div>
    {
      curTab === 0?
      <AmbientImgList ref={AmbientImgListRef} canvas={canvas} canvasClass={canvasClass} /> :
      
      <div className='flex-1 flex flex-col'> 
        {
        !activeObjects?
            <Button 
            onClick={createText} 
            className='w-full h-[36px] text-[14px] text-primary border-primary'>添加文字</Button>:
            isAmbient || objType !== 'textbox' ||['group','activeSelection'].includes(objType) ?
              <AmbientOptions canvas={canvas} />:
              <TextOptions setOptions={handelOptions}  curSelectObj={activeObjects} />
        }
      </div>
    }
    <div className='pt-[10px] flex border-[#ECECEC] border-t mt-[5px]'>
      <div onClick={backStep} className={
          `${textStateIndex < 0?'!cursor-not-allowed opacity-60':'' }
          pr-[20px] mr-[20px] border-r border-[#D3D3D3] flex items-center justify-center text-[#121212] text-[14px] font-semibold  cursor-pointer`
          }>
          <img className='w-[18px] flex-shrink-0 mr-[4px]' src={BackIcon} alt="" />
          上一步
      </div>
      <div onClick={mergeImg} className='w-[70px] h-[36px] flex items-center justify-center border-[D3D3D3] border rounded-[5px] cursor-pointer text-[#121212] font-bold'>
        保存
      </div>
      <div onClick={reset} className='ml-[10px] w-[70px] h-[36px] flex items-center justify-center border-[D3D3D3] border rounded-[5px] cursor-pointer text-[#121212] font-bold'>
        重置
      </div>
    </div>
  </div>)
}


export default AmbientConfig


function setOptions({ type, value, canvasClass }: { type: string, value: any, canvasClass: any }) {
  switch (type) {
    case 'toTop':
      canvasClass.bringToFront()
      break;
    case 'copy':
      canvasClass.copyText()
      break;
    case 'delete':
      canvasClass.removeText()
      break;
    case 'fontFamily':
      canvasClass.setFamily(value)
      break;
    case 'fontStyle':
    case 'fontWeight':
      const obj = {
        fontStyle: '',
        fontWeight: '',
        [type]: value,
      }
      canvasClass.setTextOptions(obj)
      break;
    default:
      canvasClass.setTextOptions({ [type]: value })
      break;
  }
}

