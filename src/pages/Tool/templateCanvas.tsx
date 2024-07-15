import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react'
import { fabric } from 'fabric';
import { boundaryLimit, initAligningGuidelines } from '@/utils'
import bgImg from '@/assets/bg.jpeg'
import style from './style.module.scss'
import type { FabricObject } from '@/utils/types'
import RightConfig from '@/pages/Tool/components/config';
import { TooltipContent } from '@/pages/Tool/components/options'
import Result from '@/pages/Fusion/components/TaskResult/index'

const CanvasWidth = 512
const CanvasHeight = 512
const TemplateCanvas = ({taskData} : {taskData: any}, ref: any) => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [curSelectObj, setSelectObj] = useState<FabricObject | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const canvasData: fabric.Canvas = new fabric.Canvas('template-canvas', {
      backgroundColor: '#e5e5e5',
      selection: true,
      width: CanvasWidth,
      height: CanvasHeight,
    });
    initAligningGuidelines(canvasData)
    fabric.Object.prototype.set({
      borderColor: '#5C7AFF',
      cornerColor: '#5C7AFF',
      cornerStrokeColor: '#5C7AFF',
      borderScaleFactor: 2.4,
      cornerStyle: 'circle',
      borderOpacityWhenMoving: 1,
      cornerSize: 12,
      transparentCorners: false
    })
    canvasData.on('object:moving', (event: any) => {
      // 阻止对象移动到画布之外
      const moveObj = event.target as FabricObject;
      boundaryLimit(moveObj, canvasData)
    });
    canvasData.on('selection:updated', (e: any) => {
      if(e?.e?.type === 'manualSet') {
        return
      }
      selectLimit(canvasData, e)
      setSelectObj(canvasData.getActiveObject())
    })
    canvasData.on('selection:created', (e: any) => {
      // 限制一次只能选中一个元素
      if(e?.e?.type === 'manualSet') {
        return
      }
      selectLimit(canvasData, e)
      setSelectObj(canvasData.getActiveObject())
    });
    canvasData.on('selection:cleared', (e) => {
      setSelectObj(null)
    });
    initImg(canvasData, taskData)
    const data: any = { source: bgImg, repeat: 'repeat' }
    canvasData.setBackgroundColor(data, canvasData.renderAll.bind(canvasData))
    setCanvas(canvasData)
  }, [])

 
  async function getResult() {
    if(!canvas) return
    try {
      const data = await exportPng(canvas)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.resolve('')
    }
  }
  useImperativeHandle(ref, () => ({
    getResult,
    canvas,
    switchTab
  }))

  const list = [
    {id: 0, name: '编辑样式'},
    {id: 1, name: '测试结果'},
  ]
  function switchTab(id: number) {
    setActiveTab(id)
  }
  return (
    <div className='flex'>
      <div className={`w-[${CanvasWidth}px] h-[${CanvasHeight}px] relative`}>
        <canvas id="template-canvas"></canvas>
        {
          canvas && curSelectObj && curSelectObj?.id !== 'main-img'?
          <TooltipContent canvas={canvas} curSelectObj={curSelectObj} />
          : null
        }
      </div>
      <div className=''>
        <div className='px-[25px] flex items-center justify-center mb-[10px]'>
          {
            list.map((item, index) => (
              <div key={item.id} onClick={() => {switchTab(item.id)}} className={`w-[70px]  text-[16px]  mx-[25px] hover:text-primary cursor-pointer flex items-center justify-center pb-[6px] ${activeTab === item.id?'text-primary '+ style.activeTab:''}`}>
                {item.name}
              </div>
            ))
          }
        </div>
        { activeTab === 0? <RightConfig canvas={canvas} curSelectObj={curSelectObj} />:
        <div className='pl-[16px] w-[310px]' style={{height: 'calc(100% - 40px)'}}>
          <Result isTemplate={true} taskData={taskData} switchAllImg={() => {}} /> 
        </div>
        }
      </div>
    </div>
  )
}

export default forwardRef(TemplateCanvas)



function initImg(canvas: fabric.Canvas, taskData: any) {
  const imgUrl = taskData?.main_img
  if(!imgUrl) return
  fabric.Image.fromURL(imgUrl, (img: any) => {   
    let scale = 1;
    const canvasWidth = canvas.width || CanvasWidth
    const canvasHeight = canvas.height || CanvasHeight
    const newImageInfo: any = { width: img.width, height: img.height };
    const img_width = taskData.img_width
    const L = Number(taskData.coordinate.split(',')[0]);
    const T = Number(taskData.coordinate.split(',')[1]);
    const INIT_IMGSCALE = 0.67
    if(Number(img_width) > 0) {
      scale = Number(img_width) / newImageInfo.width
    } else {
      if(newImageInfo.width >= newImageInfo.height) {
        if(newImageInfo.width > canvasWidth * INIT_IMGSCALE) {
          scale = (canvasWidth * INIT_IMGSCALE) / newImageInfo.width;
        }
      } else {
        if(newImageInfo.height > canvasHeight * INIT_IMGSCALE) {
          scale = (canvasHeight * INIT_IMGSCALE) / newImageInfo.height;
        }
      }
    }
    
    img.scale(scale);
    const left = L || (canvas?.width || 0 - img.width * scale) / 2;
    const top = T || (canvas?.height || 0 - img.height * scale) / 2;
    img.set({ left, top, angle: taskData.img_angle || 0, originX: 'center', originY: 'center'})
    img.set('id', 'main-img')
    canvas.add(img) // 将图片加入到画布
    canvas.setActiveObject(img)
    if(!L && !T) {
      canvas.centerObject(img)
      if(canvas.height) img.set({top: canvas.height - (img.height * scale)/2 - 50})
    }

  },{
    crossOrigin: 'anonymous'
  })
}
function selectLimit(canvasData: fabric.Canvas, e: any) {
  /**
   * 1、图片只能和图片或文字组合
   * 2、文字 和 文字 组合只能两个
   * 3、组合有 文字+文字、元素+元素、图片+图片、文字+元素、文字+图片
   */
  const event = new Event('manualSet')
  if (e?.selected && e?.selected.length > 1) {
    const seletedType: string[] = []
    let textboxCount = 0;
    /**
     * 一次性选中多个时，如果包含产品图，则去除产品图
     */
    e.selected = e?.selected.filter((i: any) => {
      const isMain = i.id === 'main-img'
      if(isMain) return false
      if(i.type === 'textbox') textboxCount++
      // 如果第一个元素是图片，那么后面的元素只能是图片
      const isImage = seletedType[0] === 'image' && i.type !== 'image' && i.type !== 'textbox'
      const isNotImage = seletedType[0] && seletedType[0] !== 'image' && i.type === 'image'
      // 文字 和 文字 组合只能两个
      const textRepeat = textboxCount > 2 && i.type === 'textbox'

      if(isImage || textRepeat || isNotImage) {
        return false
      } 
      seletedType.push(i.type)
      return true
    })
    canvasData.discardActiveObject();
    const selectTarget = new fabric.ActiveSelection(e.selected, { 
      canvas: canvasData,
      originX: 'center', originY: 'center' 
    })
    canvasData.setActiveObject(selectTarget, event);
  } else if(e?.selected?.length){
    const selectTarget = e?.selected[0];
    canvasData.setActiveObject(selectTarget, event);
  }
  canvasData.renderAll()
}

function exportPng(canvas:fabric.Canvas) {
  // 遍历画布上的每个元素
  return new Promise((resolve) => {
    canvas.clone((cloneCanvas: fabric.Canvas) => {
      cloneCanvas.setBackgroundColor('transparent', cloneCanvas.renderAll.bind(cloneCanvas))
      const objs = cloneCanvas.getObjects()
      for (let i = 0; i < cloneCanvas.getObjects().length; i++) {
        const obj: any = objs[i];
        if (obj.id === 'main-img') {
          // 将非排除的元素添加到新的画布对象中
          cloneCanvas.remove(obj);
        }
      }
      
      const imageDataUrl = cloneCanvas.toDataURL({ format: 'png' });
      const JSONdata = cloneCanvas.toJSON(['id'])
      resolve({img: imageDataUrl, JSONdata})
    }, ['id'])
  })
}