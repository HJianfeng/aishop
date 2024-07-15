/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, forwardRef, useImperativeHandle,MutableRefObject, useMemo } from 'react'
import { message, Slider, Button, Modal, Spin, Checkbox, Alert } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Smear from './smear'
import BackIcon from '@/assets/back.png'
import Drag from '@/assets/drag.png'
import Brush from '@/assets/brush.png'
import DragNormal from '@/assets/drag_normal.png'
import BrushNormal from '@/assets/brush_normal.png'
import downloadIcon from '@/assets/download.png'
import { upscale, upscaleZoomin, toInpaintTool, toInpaintImg, toMergeImg, toDownload, addBpoint } from '@/service';
import { onDownloadImg } from '@/utils'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import { hideTooltip } from '@/store/toolSlice'
import BgIcon from '@/assets/bg.jpeg'
import AmbientConfig from './components/ambientConfig'

interface IProps {
  imgUrl: string
  canvasWidth?: number
  canvasHeight?: number
  item?:any  // 从图片结果进入
  imgKey?: string // 从首页工具栏进入
  imgRatio?: number // 宽/高
  taskId?:string
  taskData?: any
  isSmear:boolean
  uploadButton?: any
  styleMode?: 0 | 1 // 样式类型 0:旧 1:新
  afterSmear?: (img: string) => void
}
const SmearCanvas = (props: IProps, ref: any) => {
  const dispatch = useDispatch()
  const [canvasWidth] = useState<number>(props.canvasWidth || 512);
  const [canvasHeight] = useState(props.canvasHeight || 512);
  const dragBox: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const dragWarp:any = useRef(null)
  const [canvas, setCanvas] = useState<any>();
  const [stateIndex, setCanvasStateIndex] = useState<number>(-1);
  const [textStateIndex, setCanvasTextStateIndex] = useState<number>(-1);
  
  const [resultLoading, setResultLoading] = useState<string|null>(null);
  const [progess, setProgess] = useState(0);
  const [lineWidth, setLineWidth] = useState(24);
  const minZoom = props.item?Number((435/canvasWidth).toFixed(2)):1
  const [zoom, setZoom] = useState(minZoom);
  const [curTab, setCurTab] = useState(0);
  const [isHd, setIsHd] = useState(false);
  const [selectedText, setSelectedText] = useState<any>(null);


  const isInnerSmear = useMemo(() => {
    return !!props.item
  }, [props.item])
  const isDrag = useRef(false)
  const canvasRef:any = useRef(null)
  const canvasMaskRef:any = useRef(null)
  const canvasTextRef: any = useRef(null)
  const cursorRef: any = useRef(null)
  const [smearSlideTabIndex,setSmearSlideTabIndex] =  useState<number>(1)
  useEffect(() => {
    
    if (canvasRef.current) {    
      const canvas = new Smear(canvasRef.current, { 
        canvasMaskRef: canvasMaskRef.current, 
        canvasTextRef: canvasTextRef.current,
        canvasWidth, canvasHeight, 
        setCanvasStateIndex, 
        setCanvasTextStateIndex,
        handleSelectText,
        drawingLineWidth: lineWidth,
        cursorRef: cursorRef.current,
        pathCreated,
        imgUrl: props.imgUrl });
      setCanvas(canvas)
    }
  }, []);
  function resetCanvas(img?: string) {
    canvas.resetCanvas(img || props.item.img)
  }
  function pathCreated() {
    if(props.item && props.taskId) {
      addBpoint({
        action_type: "fusion" ,
        action: "paint", 
        root: "",
        url: "", 
        task_id: props.taskId,
        task_detail_id: props.item.id
      })
    } else {
      // 埋点
      addBpoint({"action_type": "tool" , "action": "paint", "root": ""})
    }
  }
  useImperativeHandle(ref, () => ({
    resetCanvas
  }))

  function backStep() {
    if(stateIndex < 0) return;
    const canvasState = canvas.canvasState;
    if(canvasState.length) {
      canvas.backStep()
    }
  }
  function backStepText() {
    if(textStateIndex < 0) return;
    const canvasTextState = canvas.canvasTextState;
    if(canvasTextState.length) {
      canvas.canvasTextBackStep()
    }
  }

  // hd 图片生成
  const onHdImgCreate = () => {
    Modal.confirm({
      title: '高清图片',
      content: '高清图细节更加丰富',
      okText: '确定',
      centered: true,
      cancelText: '取消',
      onOk() {
        if(!props.item) {
          hdTool()
        } else {
          hdInner()
        }
      },
      onCancel() {},
    })
  }
  const hdTool = () => {
    setResultLoading('高清');
    setProgess(0)
    handleProgess()
    const params:any = {
      img: props.imgKey,
      upscale: 1,
      origin: 'inpaint'
    }
    if(props.isSmear) {
      params.root = 'inpaint'
    }
    upscaleZoomin(params).then((res: any) => {
      message.success('高清开始下载')
      onDownloadImg(res.img)
    }).catch((error) => {
      message.error(error?.message || '服务异常');
    }).finally(() => {
      setProgess(100)
      if(timer) clearTimeout(timer)
      setTimeout(() => {
        setResultLoading(null);
      }, 500)
    })
  }
  const hdInner = (isDownload?: boolean) => {
    if(!props.item) return;
    setResultLoading('高清');
    setProgess(0)
    handleProgess()
    const data: any = {
      task_id: props.taskId,
      task_detail_id: props.item.id,
      upscale: isDownload?'2':'4'
    }
    if(props.taskData.is_demo) {
      data.is_demo = 'true'
    }
    if(props.isSmear) {
      data.root = 'inpaint'
    }
    const prefix = 'aisoup'
    const imgKey = props.imgUrl.split(`/${prefix}/`)[1]
    data.img_file = `${prefix}/${imgKey}`
    upscale(data).then((res: any) => {
      if(!isDownload) message.success('高清开始下载')
      onDownloadImg(res.img)
    }).catch((error) => {
      message.error(error?.message || '服务异常');
    }).finally(() => {
      setProgess(100)
      if(timer) clearTimeout(timer)
      setTimeout(() => {
        setResultLoading(null);
      }, 500)
    })
  }
  function downloadImg(img:any) {
    const downData: any = {
      url: img
    }
    if(props.item) {
      downData.task_id =  props.taskId
      downData.task_detail_id =  props.item.id
      if(props.taskData.is_demo) {
        downData.is_demo = 'true'
      }
    } else {
      downData.action_type = 'tool'
    }
    if(props.isSmear) {
      downData.root = 'inpaint'
    }
    if(img.indexOf('http') >= 0) {
      toDownload(downData)
    }
    onDownloadImg(img)
  }
  let timer: any = null;
  const handleProgess = () => {
    timer = setTimeout(() => {
      setProgess((data) => {
        if (data >= 98) {
          if(timer) clearTimeout(timer)
          return 98;
        } else {
          handleProgess();
        }
        return data + 2;
      });
    }, 900);
  }
  function lineWidthChange(val: number) {
    setLineWidth(val)
    canvas.setDrawingBrushWidth(val)
  }
  function scaleChange(val: number) {
    setZoom(val)

    if(isInnerSmear) {
      // 放大再缩小后位置超出计算
      const dragBoxTranslate = getComputedTranslate(dragBox.current!)
      let box = dragWarp.current.getBoundingClientRect()
      let obj = dragBox.current!.getBoundingClientRect()
      let distanceX = parseFloat(dragBox.current!.style.left)
      let distanceY = parseFloat(dragBox.current!.style.top)
      const left =dragBoxTranslate.left * val
      const top =dragBoxTranslate.left * val
      const dragBoxWidth = obj.width * val
      const dragBoxHeight = obj.height * val
      // left
      let resetPos = false;
      if(distanceX >= left) {
        distanceX = left
        resetPos = true
      }
      // top
      if(distanceY >= top) {
        distanceY = top
        resetPos = true
      }
      // right
      if((distanceX + dragBoxWidth) <= (left + box.width)) {
        distanceX = (left + box.width - dragBoxWidth)
        resetPos = true
      }
      // bottom
      if((distanceY + dragBoxHeight) <= (top + box.height)) {
        distanceY = (top + box.height - dragBoxHeight)
        resetPos = true
      }
      if(resetPos) {
        dragBox.current!.style.left = distanceX+'px'
        dragBox.current!.style.top =distanceY+'px'
      }
    }
  }
  async function submit() {
    const prefix = 'aisoup'
    const { img } = await canvas.getMaskImg()
    const api = props.item? toInpaintImg: toInpaintTool
    const data: any = {
      mask_b64: img
    }
    if(!props.item) {
      data.img_file = props.imgKey
    } else {
      const imgKey = props.imgUrl.split(`/${prefix}/`)[1]
      data.img_file = `${prefix}/${imgKey}`
      data.task_id = props.taskId
      data.task_detail_id = props.item.id
      if(props.taskData.is_demo) {
        data.is_demo = 'true'
      }
    }
    setResultLoading('涂抹')
    setProgess(0)
    handleProgess()
    api(data).then(res => {
      if(props.afterSmear) {
        props.afterSmear(res.img)
      } else {
        message.success('开始下载图片')
        downloadImg(res)
      }
    }).catch((error) => { 
      message.error(error.message || '')
    }).finally(() => {
      setProgess(100)
      if(timer) clearTimeout(timer)
      setTimeout(() => {
        setResultLoading(null);
      }, 500)
    })
  }
  async function downloadWithHd(notDownload?: boolean) {
    try {
      const { textImg } = await canvas.getMaskImg()
      const data = {
        img_b64: textImg.replace('data:image/png;base64,', ''),
        is_hd: isHd?'true':'false',
        img_url: props.item.img,
        task_id: String(props.taskId),
        task_detail_id: String(props.item.id)
      }
      if(!props.item) {
        data.img_url = props.imgKey
      } else {
        data.img_url = props.item.img
      }
      setResultLoading(notDownload?'图片':'下载')
      setProgess(0)
      handleProgess()
      const res = await toMergeImg(data)
      if(!notDownload) {
        onDownloadImg(res.img, {
          afterDownload: () => {
            setProgess(100)
            if(timer) clearTimeout(timer)
            setTimeout(() => {
              setResultLoading(null);
            }, 500)
          }
        })
      } else {
        setProgess(100)
        if(timer) clearTimeout(timer)
        setTimeout(() => {
          setResultLoading(null);
        }, 500)
      }

      dispatch(hideTooltip('smear'))
    } catch (error) {
      setProgess(100)
      if(timer) clearTimeout(timer)
      setTimeout(() => {
        setResultLoading(null);
      }, 500)
    }
  }


  function createText() {
    // 埋点
    addBpoint({
      task_id: props.taskId,
      task_detail_id: props.item.id,
      "action_type":"fusion" ,"action":"merge", "root":"","url":"" })
    canvas.addText()
  }
  function handleSelectText(data: any) {
    
    setSelectedText(data? {
      ...data.__dimensionAffectingProps,
      backgroundColor: data.backgroundColor,
      fill: data.fill
    }:null)
  }
  function switchTab(val: number) {
    canvas.removActiveObject()
    setCurTab(val)
    setSmearSlideTabIndex(1)
  }
  /**
   * Inner
   */
  function renderDialogSmear() {
    const activeTabClass = `text-[#6884FF] text-[20px] ${style.activeTab}`;
    const defaultTabClass = 'text-[#000000] text-[16px]';
    return (
      <div>
        <div className='flex pb-[15px] border-b border-[#F5F5F5]'>
          <div className='flex flex-1 items-center h-[50px]'>
            <div onClick={() => {if(!resultLoading) switchTab(0)}} 
                className={`${curTab === 0?activeTabClass:defaultTabClass} h-full flex items-center font-medium cursor-pointer mr-[60px]`}>涂抹消除</div>
            <div onClick={() => {if(!resultLoading) switchTab(1)}} 
              className={`${curTab === 1?activeTabClass:defaultTabClass} h-full flex items-center font-medium cursor-pointer`}>氛围图</div>
          </div>
          <Alert 
            message="高清2倍下载可以勾选这里" 
            showIcon={false}
            className='h-[40px] mr-[10px]'
            closeIcon={<div className='text-primary text-[14px]'>知道了</div>}
            type="warning" 
            closable 
          />
          <div className='flex h-[40px] items-center px-[20px] py-[9px] bg-primary rounded-[4px]'>
            <Checkbox checked={isHd}  className={`${style.checkboxWhite} text-white text-[20px]`} onChange={(e) => setIsHd(e.target.checked)} >HD</Checkbox>
            <div className='h-full w-[1px] bg-white mr-[15px] ml-[7px]'></div>
            <div onClick={() => {downloadWithHd()}} className='text-white text-[20px] cursor-pointer'>下载</div>
          </div>
        </div>
        <div className='flex mt-[20px] h-[435px]'>
          {/* left */}
          <div style={{background: `url(${BgIcon}) repeat`}} className='w-[435px]  mr-[20px] overflow-hidden'>

        
            {renaderCanvasDraggableBox()}
          </div>
          {/* right */}
          <div className='flex-1 w-[294px]'>
            {curTab === 0 ?
              renderSmearSlide():
              <AmbientConfig 
                mergeImg={() => {downloadWithHd()}} backStepText={backStepText} 
                textStateIndex={textStateIndex} canvas={canvas.canvasText} 
                canvasClass={canvas} createText={createText}  />
            }
          </div>
        </div>
      </div>
    )
  }
  

  

  function renderSmearSlide() {
    return (
      <div className="relative  smear-slide">
        <div className='flex items-center justify-center tab'>
          <div 
            style={smearSlideTabIndex===1?{background: 'rgba(239, 241, 251, 1)'}: {background: 'rgba(239, 241, 251, 0.3)'}}
            className={`${smearSlideTabIndex===1?'text-[#5F74D4]':'text-[#333]'} text-[16px] font-medium flex items-center justify-center  text-center cursor-pointer w-[124px] h-[40px]  mr-[8px] rounded-[2px]`}
            onClick={() => { setSmearSlideTabIndex(1) }}>
            <img className='w-[14px] mr-[8px]' src={smearSlideTabIndex===1?Brush:BrushNormal} alt="" />
            笔刷
          </div>
          <div 
            style={smearSlideTabIndex===2?{background: 'rgba(239, 241, 251, 1)'}: {background: 'rgba(239, 241, 251, 0.3)'}}
            className={`${smearSlideTabIndex===2?'text-[#5F74D4]':'text-[#333]'} text-[16px] font-medium flex items-center justify-center text-center cursor-pointer w-[124px] h-[40px]  mr-[8px] rounded-[2px]`}
            onClick={() => { setSmearSlideTabIndex(2) }} >
            <img className='w-[14px] mr-[8px]' src={smearSlideTabIndex===2?Drag:DragNormal} alt="" />
            画布
          </div>
        </div>
        <div className='mt-[23px] pl-[8px]'>
          {smearSlideTabIndex === 1 ? 
              <div className='flex items-center'>
                <div className='text-[#121212] mr-[8px] text-[14px] font-semibold'>画笔大小</div>
                <Slider 
                  className={`w-[110px] ${style.slider}` }
                  trackStyle={{background: '#D8D8D8', height: '4px'}}
                  railStyle={{background: '#D8D8D8', height: '4px' }}
                  value={lineWidth} step={1} min={10} max={80} onChange={lineWidthChange} />
              </div>:
            <div className='flex items-center'>
              <div className='text-[#121212] mr-[8px] text-[14px] font-semibold'>画布尺寸</div>
              <Slider 
                className={`w-[110px] ${style.slider}` }
                trackStyle={{background: '#D8D8D8', height: '4px'}}
                railStyle={{background: '#D8D8D8', height: '4px' }}
                value={zoom} step={0.1} min={minZoom} max={3} onChange={scaleChange} />
            </div>
          
          }
        </div>
        <div className='mt-[18px] flex justify-center items-center'>
          <div className=' w-[100px] '>
          {
            smearSlideTabIndex === 1?
            <div onClick={backStep} className={
                `${stateIndex < 0?'!cursor-not-allowed opacity-60':'' }
                flex items-center justify-center text-[#121212] text-[14px] font-semibold  cursor-pointer`
                }>
                <img className='w-[18px] flex-shrink-0 mr-[4px]' src={BackIcon} alt="" />
                上一步
            </div>
            :null
          }
          </div>
          <div className='w-[1px] h-[31px] bg-[#D3D3D3] ml-[18px] mr-[8px]'></div>
          <Button loading={!!resultLoading} onClick={submit} className='w-[118px] h-[40px] text-[16px] ml-[10px] font-medium' type='primary'>开始消除</Button>
        </div>
      </div>
    )
  }
  /**
   * Tool
   */
  function renderToolSmear() {
    return (
      <>
        <div  style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 20px 0px'}} className='absolute  h-[170px] bg-white  rounded-[8px] right-[30px] z-50 px-[15px] pt-[11px] pb-[19px]'>
          {
            renderSmearSlide()
          }
        </div>
        <div className='absolute left-1/2 -translate-x-1/2 inline-flex justify-center bottom-[90px] z-50  items-center'>
         { props.uploadButton || null }
          <Button onClick={() => {downloadImg(props.imgUrl);dispatch(hideTooltip('smear'))}} className='w-[120px] h-[50px] text-[18px] ml-[10px] font-medium' type='primary'>下载图片</Button>
        </div>
        { renaderCanvasDraggableBox() }
      </>
    )
  }

  /**
   * 涂抹区域
   */
  useEffect(() => {
   const canvasEl = document.querySelectorAll('canvas')
   if(canvasEl && canvasEl.length) {
    canvasEl.forEach(i => {
      i.oncontextmenu = function (e: any) {
        e.preventDefault();
      };
    })
   }
  }, [])

  /**
   * 鼠标/触控板 事件
  */
  function handleDraggable(e: any) { 
    if(props.item) return
    let deltaX = e.deltaX
    let deltaY = e.deltaY
    
    if (e.ctrlKey) {
      let newZoom = zoom * 0.95 ** deltaY
      if (newZoom > 3) {
        return
      }
      if (newZoom < 1) {
        return
      }
      setZoom(newZoom)
    } else {
      let left =dragBox.current?.style.left.replace('px','')
      let top = dragBox.current?.style.top.replace('px', '')
      dragBox.current!.style.left = Number(left) - deltaX*1.5+'px'
      dragBox.current!.style.top =Number(top)- deltaY*1.5+'px'
    }
    e.stopPropagation()
  }

  function onMouseDown(e: any) {
    if (smearSlideTabIndex === 1) return
    const el = e.target;
    el.style['cursor'] = 'grabbing';
    const originalPointerEvents = el.style['pointer-events'];
    const offsetLeft = dragBox.current!.offsetLeft
    const offsetTop = dragBox.current!.offsetTop
    const disX = e.clientX - offsetLeft; // 鼠标点击位置距离左边的距离
    const disY = e.clientY - offsetTop; // 鼠标点击位置距离浏览器顶部的距离

    const dragBoxTranslate = getComputedTranslate(dragBox.current!)
    document.onmousemove = function(event: any) {
      event.preventDefault();
      let distanceX = event.clientX - disX;
      let distanceY = event.clientY - disY;
      let box = dragWarp.current.getBoundingClientRect()
      let obj = dragBox.current!.getBoundingClientRect()
      
      if(isInnerSmear) {
        const left =dragBoxTranslate.left * zoom
        const top =dragBoxTranslate.left * zoom
        const dragBoxWidth = obj.width * zoom
        const dragBoxHeight = obj.height * zoom
        // left
        if(distanceX >= left) {
          distanceX = left
        }
        // left-top
        if(distanceY >= top) {
          distanceY = top
        }
        // right
        if((distanceX + dragBoxWidth) <= (left + box.width)) {
          distanceX = (left + box.width - dragBoxWidth)
        }
        // right-bottom
        if((distanceY + dragBoxHeight) <= (top + box.height)) {
          distanceY = (top + box.height - dragBoxHeight)
        }
      }
      // 这里的判断是，一次拖动只能拖出容器最多 80%
      if (!isInnerSmear && (obj.top < box.top - canvasHeight * 0.8 || obj.left < box.left - canvasWidth * 0.8 || obj.bottom > box.bottom + canvasHeight * 0.8 || obj.right > box.right + canvasWidth * 0.8)) {
        if (!isDrag.current) {
          dragBox.current!.style.left = distanceX+'px'
          dragBox.current!.style.top =distanceY+'px'
        }
      } else {
        isDrag.current =true
          dragBox.current!.style.left = distanceX+'px'
          dragBox.current!.style.top =distanceY+'px'
      }

      // 在鼠标拖动的时候将点击事件屏蔽掉
      el.style['pointer-events'] = 'none';
      document.body.style['cursor'] = 'grabbing';
      canvas.canvas.freeDrawingCursor = 'grabbing'
    };
    document.onmouseup = function() {
      // 解绑事件和手势恢复
      document.onmousemove = null;
      document.onmouseup = null;
      isDrag.current= false
      el.style['pointer-events'] = originalPointerEvents;
      // el.style['cursor'] = 'auto';
      el.style['cursor'] = 'grab';
      document.body.style['cursor'] = 'auto';
      canvas.canvas.freeDrawingCursor = 'none'
    };
  }



  function renaderCanvasDraggableBox() {
    return (
      <div className='relative h-full w-full' ref={dragWarp} onWheel={(e) => handleDraggable(e)}  >
        {
          resultLoading?
          <div className='absolute left-0 z-50 top-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{margin: '-15px',color: '#fff', fontSize: 30 }} />} />
            <div className='mt-[40px] text-white'>{resultLoading}处理中...{progess?progess+'%': ''}</div>
          </div>
          : null
        }
        {smearSlideTabIndex === 2 ?  <div  className='absolute z-40 left-0 top-0 w-full h-full' onMouseDown={(e)=>onMouseDown(e)}></div>:null}
        {/* <div className="absolute h-full w-full left-[50%] top-[50%]" > */}
          <div 
            ref={dragBox}  className="absolute left-[50%] top-[50%]"
            style={{transform:'translate(-50%, -50%)', width: `${canvasWidth}px`, height: `${canvasHeight}px`}}>
            <div className='relative w-full h-full' style={{ transform:`translateZ(0) scale(${zoom})` }}>
              {renderCanvasArea()}
            </div>
          </div>
        {/* </div> */}
      </div>
    )
  }

  function renderCanvasArea() {
    return (
      <div className="relative w-full h-full" >
        {/* 主图 */}
        <div className='absolute left-0 top-0 w-full h-full z-0 rounded-[4px] '>
          <canvas className='absolute left-0 top-0 w-full h-full z-0' ref={canvasMaskRef} ></canvas>
        </div>
        {/* 涂抹区域 */}
        <div className='absolute left-0 top-0 w-full h-full z-10 rounded-[4px] '>
          <canvas ref={canvasRef}  ></canvas>
          <div ref={cursorRef} style={{pointerEvents: 'none',  backgroundColor: 'rgba(104,132,255,0.5)', display: 'none'}} className={`${smearSlideTabIndex === 2?'!hidden':''} absolute left-0 top-0 border border-[#6884FF] bg-transparent rounded-full`}></div>
        </div>
        {/* 文字区域 */}
        <div className={`${curTab === 1?'z-20':'z-[1]'} absolute left-0 top-0 w-full h-full rounded-[4px]`}>
          <canvas ref={canvasTextRef} ></canvas>
        </div>
      </div>
    )
  }
  return (
    <div className='w-full h-full ' style={{overflow:'hidden'}}>
      {
        props.styleMode === 1 ? renderDialogSmear() : renderToolSmear()
        // renaderCanvasDraggableBox()
      }
    </div>
  )
}

export default forwardRef(SmearCanvas);

function getComputedTranslate(el: Element) {
    if(!window.getComputedStyle) return {left: 0, top: 0};
    const transform = window.getComputedStyle(el).getPropertyValue('transform')
      
    let mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? {
      left: Math.abs(parseFloat(mat[1].split(', ')[4])),
      top:  Math.abs(parseFloat(mat[1].split(', ')[5])),
    } : {left: 0, top: 0};
}