import { ColorPicker } from 'antd';
import { fabric } from 'fabric'
import { SelectFont, FontColor, StrokeColor, SetOpacity } from '@/pages/Tool/components/options'
import { Scrollbars } from 'rc-scrollbars';


interface IProp {
  canvas: fabric.Canvas | null
  onChange?: Function
}
function AmbientOptions({canvas}: IProp) {
  const activeObjects: any = canvas?.getActiveObject()
  const isGroup = activeObjects?.type === 'activeSelection' || activeObjects?.type === 'group'
  if(!activeObjects || !canvas) return (<></>)
  return (
    <div className='flex-1 h-0'>
      {
        isGroup?
        <GroupOptions canvas={canvas} />
        : 
        <ObjectOptions canvas={canvas}/>
      }
    </div>
  )
}
function ObjectOptions({ canvas }: IProp) {
  const activeObjects: any = canvas?.getActiveObject()
  if(!activeObjects || !canvas) return (<></>)
  const objType: string = activeObjects.type || '';
  const isShape = ['rect','circle','triangle'].includes(objType)

  const selectedText = {
    ...(activeObjects as any).__dimensionAffectingProps,
    backgroundColor: activeObjects.backgroundColor,
    fill: activeObjects.fill,
    stroke: activeObjects.stroke,
    isFill: !activeObjects.stroke
  }
  function changeBg(e: string) {
    // 描边模式
    if(!selectedText.isFill) {
      activeObjects.set({
        stroke: e,
      })
    } else {
      // 背景模式
      activeObjects.set({
        fill: e,
      })
    }
    canvas?.renderAll()
  }
  return (
    <div>
      { objType === 'textbox'? 
      <TextboxOptions canvas={canvas} activeObjects={activeObjects}  />
      : null }
      { isShape? 
        <>
          <ColorSelect defaultValue={selectedText.isFill?selectedText.backgroundColor:selectedText.stroke} onChange={(e: string) => {changeBg(e)}} label={selectedText.isFill?'背景颜色':'描边颜色'}  />
        </>
      : null }
      {
        objType === 'image'?<SetOpacity label="背景图片透明度" className='!mt-0' canvas={canvas} curSelectObj={activeObjects} /> :null 
      }
    </div>
  )
}
function GroupOptions({ canvas }: IProp) {
  const activeObjects: any = canvas?.getActiveObject()
  if(!activeObjects || !canvas) return (<></>)
  const textObjs = activeObjects?._objects?.filter((i:fabric.Object) => i.type === 'textbox')
  const shapeObjs = activeObjects?._objects?.filter((i:fabric.Object) => ['rect','circle','triangle'].includes(i.type || ''))
  const imageObjs = activeObjects?._objects?.filter((i:fabric.Object) => i.type === 'image')

  const shapeSelect = shapeObjs?.length?{
    ...(shapeObjs[0] as any).__dimensionAffectingProps,
    backgroundColor: shapeObjs[0].backgroundColor,
    fill: shapeObjs[0].fill,
    stroke: shapeObjs[0].stroke,
    isFill: !shapeObjs[0].stroke
  }:{}

  function changeBg(e: string) {
    shapeObjs.forEach((i: fabric.Object) => {
      const params: any = {}
      if(shapeSelect.isFill) {
        params.fill = e
      } else {
        params.stroke = e
      }
      i.set(params)
    })
    canvas?.renderAll()
  }
  function changeImage(e: any) {
    imageObjs.forEach((i: fabric.Object) => {
      i.set({
        opacity: e.value
      })
    })
    canvas?.renderAll()
  }
  function renderSlot(index: number) {
    if(index > 0 || !canvas) return
    const text = shapeSelect.isFill?'背景颜色':`${textObjs?.length?'元素':''}描边颜色`
    return (
      <>
      {
        //  && (!textObjs?.length || (textObjs?.length && selectedText.isFill))
        shapeObjs?.length?
        <ColorSelect className={`!px-[10px] ${imageObjs?.length?'':'!mb-[10px]'}`}
          defaultValue={shapeSelect.isFill?shapeSelect.backgroundColor:shapeSelect.stroke}
          onChange={(e: string) => {changeBg(e)}}
          label={text}  />
        :null
      }
      {
       imageObjs?.length?
        <SetOpacity className='px-[10px] !mt-[10px] mb-[10px]' 
          label="背景图片透明度" 
          canvas={canvas} onChange={(e) => {changeImage(e)}}
          curSelectObj={imageObjs[0]} />
        : null
      }
      </>
    )
  }
  return (
    <Scrollbars className='h-full'>
      <div className='px-[10px]'>
        {
          textObjs?.length? textObjs.map((i:fabric.Object, index: number) => 
            <div key={index} className='mb-[20px]'>
              <TextboxOptions canvas={canvas} activeObjects={i} renderSlot={() => renderSlot(index)} />
            </div>
          ) : renderSlot(0)
        }
      </div>
    </Scrollbars>
  )
}

function TextboxOptions({canvas, activeObjects, renderSlot, onChange }: {canvas:fabric.Canvas, activeObjects: any, onChange?: Function, renderSlot?: Function}) {
  if(!activeObjects) return (<></>)
  function handleChange(opt: any) {
    onChange?.(opt)
  }
  return (
    <div>
      <Text text={activeObjects.text} />
      <div className='border-[#F5F5F5] border rounded-[5px]'>
        <SelectFont canvas={canvas} curSelectObj={activeObjects} />
        <FontColor onChange={(e) => {handleChange(e)}} className='!mt-[14px] px-[10px]' canvas={canvas} curSelectObj={activeObjects} />
        <StrokeColor onChange={(e) => {handleChange(e)}} className='!mt-[14px] !mb-[14px] px-[10px]' canvas={canvas} curSelectObj={activeObjects} />
        {
          renderSlot? renderSlot() : null
        }
      </div>
    </div>
  )
}
function Text({text}: {text: string}) {
  return (<div className='mb-[10px] w-full px-[14px] h-[40px] flex items-center truncate border border-[#D4DCFF] bg-[#EFF2FF] text-[16px] rounded-[5px]'>{text}</div>)
}

function ColorSelect({ defaultValue, className, onChange, label }:{defaultValue: string,className?:string, onChange?:Function, label?: string}) {
  function handleOptions(opt: any) {
    onChange?.(opt.value)
  }
  return (
    <div className={`flex justify-between items-center ${className || ''}`}>
      <div className='text-[#121212] text-[14px]'>{label || '颜色'}</div>
      <div className='flex items-center'>
        <ColorPicker value={defaultValue} format="hex" onChange={(e: any) => {handleOptions({type:'fill', value: e.toRgbString()})}}>
            {
            defaultValue?
            <div className='rounded-[4px] border border-[#e5e5e5]  cursor-pointer w-[24px] h-[24px]' style={{ backgroundColor: defaultValue }}  />
            :
            <div className='rounded-[4px] overflow-hidden flex items-center justify-center border border-[#e5e5e5]  cursor-pointer w-[24px] h-[24px] bg-white'>
              <div className='bg-[#F42222] w-[2px] h-[30px] rotate-45'></div>
            </div>
            }
        </ColorPicker>
      </div>
    </div>
  )
}

export default AmbientOptions