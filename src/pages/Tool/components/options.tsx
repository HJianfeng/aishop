
import { Select, Dropdown, Tooltip, ColorPicker, Switch, Radio, Slider, Modal  } from 'antd';
import Style from './style.module.scss'
import { fabric } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import ToTop from '@/assets/smear/top.png'
import AlignLeft from '@/assets/smear/align_left.png'
import AlignCenter from '@/assets/smear/align_center.png'
import AlignRight from '@/assets/smear/align_right.png'
import ColorIcon from '@/assets/smear/color.png'
import transparency from '@/assets/transparency.png'
import { FabricObject } from '@/utils/types';
import { throttle, isNotNill } from '@/utils';


interface FontOptions {
  onChange?: (opt: {type: string, value: any}) => void
  curSelectObj: fabric.Object
  canvas: fabric.Canvas
  className?: string
  label?: string
}
export function SelectFont({ onChange, curSelectObj, canvas }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selectedText = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      backgroundColor: curSelectObj.backgroundColor,
      fill: curSelectObj.fill
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }
  const styleHtml: any = {
    'bold': (<div className='font-bold text-center cursor-pointer'>粗体</div>),
    'italic': (<div className='italic text-center cursor-pointer'>斜体</div>),
  }
  const fontList = [
    { value: 'alibaba', label: (<div style={{fontFamily: 'alibaba'}}>阿里巴巴普惠体</div>) },
    { value: 'alimama', label:  (<div style={{fontFamily: 'alimama'}}>阿里妈妈方圆体</div>) },
    { value: 'zk', label: (<div style={{fontFamily: 'zk'}}>站酷文艺体</div>) },
    { value: 'md', label: (<div style={{fontFamily: 'md'}}>摩登小方体</div>) },
    { value: 'zh', label: (<div style={{fontFamily: 'zh'}}>字魂扁桃体</div>) },
    { value: 'fzhtjt', label: (<div style={{fontFamily: 'fzhtjt'}}>方正黑体简体</div>) },
    { value: 'rzcp', label: (<div style={{fontFamily: 'rzcp'}}>锐字潮牌</div>) },
    { value: 'yshst', label: (<div style={{fontFamily: 'yshst'}}>优设好身体</div>) },
  ]
  const items = [
    { key: '', label: (
      <div onClick={() => {setOptions({curSelectObj, type:'fontStyle', value: '', onChange: handleChange, canvas})}} 
        className={`${selectedText.fontStyle !== 'italic' && selectedText.fontWeight !== 'bold'?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>
          常规
      </div>
    ) },
    { key: 'bold', label: (
      <div onClick={() => {setOptions({curSelectObj, type:'fontWeight', value: 'bold', canvas, onChange: handleChange})}} 
          className={`${['bold'].includes(selectedText.fontWeight)?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>
          {styleHtml['bold']}
      </div>
    ) },
    { key: 'italic', label: (
      <div onClick={() => {setOptions({curSelectObj, type:'fontStyle', value: 'italic', canvas, onChange: handleChange})}} 
          className={`${['italic'].includes(selectedText.fontStyle)?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>
            {styleHtml['italic']}
      </div>
    ) },
  ]
  return (
    <div className='flex items-center bg-[#f5f5f5] h-[40px] rounded-[5px]'>
      <Select 
        className={`${Style.selectFont} flex items-center flex-1`}
        value={selectedText.fontFamily}
        onChange={(e) => {setOptions({curSelectObj, type:'fontFamily', value: e, canvas, onChange: handleChange});}}
        options={fontList}
      />
      <div className='w-[1px] h-[26px] bg-[#DDDDDD]'></div>
      <Dropdown menu={{ items, className: Style.dropdown }} trigger={['click']}>
        <div className='font-semibold w-[64px] cursor-pointer text-center'>
          {styleHtml[selectedText.fontStyle] || styleHtml[selectedText.fontWeight] || '常规'}
        </div>
      </Dropdown>
    </div>
  )
}

export function SelectAlign({ curSelectObj, canvas }: FontOptions) {

  return (
    <div className='flex items-center bg-[#f5f5f5] h-[40px] rounded-[5px] mt-[20px]'>
      <div className='flex items-center h-full flex-1'>
        <Tooltip title="左对齐" mouseEnterDelay={1}>
          <div onClick={() => {setOptions({type:'textAlign', value: 'left', curSelectObj, canvas})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
            <img className='w-[17px]' src={AlignLeft} alt="" />
          </div>
        </Tooltip>
        <Tooltip title="居中" mouseEnterDelay={1}>
          <div onClick={() => {setOptions({type:'textAlign', value: 'center', curSelectObj, canvas})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
            <img className='w-[17px]' src={AlignCenter} alt="" />
          </div>
        </Tooltip>
        <Tooltip title="右对齐" mouseEnterDelay={1}>
          <div onClick={() => {setOptions({type:'textAlign', value: 'right', curSelectObj, canvas})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
            <img className='w-[17px]' src={AlignRight} alt="" />
          </div>
        </Tooltip>
      </div>
      <div className='w-[1px] h-[26px] bg-[#DDDDDD]'></div>
      <div className='w-[64px] h-full'>
        <Tooltip title="置顶（图层置顶）" mouseEnterDelay={1}>
          <div onClick={() => {setOptions({type:'toTop', value: '', curSelectObj, canvas})}} className='w-full h-full flex items-center justify-center cursor-pointer'>
            <img className='w-[17px]' src={ToTop} alt="" />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
export function FontColor({ onChange, curSelectObj, canvas, className }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selectedText = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      backgroundColor: curSelectObj.backgroundColor,
      fill: curSelectObj.fill
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {type: string, value: any}) {
    setOptions({...opt, curSelectObj, canvas, onChange: handleChange})
  }
  return (
    <div className={`mt-[20px] flex justify-between items-center ${className || ''}`}>
      <div className='text-[#121212] text-[14px]'>字体颜色</div>
      <div className='flex items-center'>
        <ColorPicker value={selectedText.fill} format="hex" onChange={(e: any) => {handleOptions({type:'fill', value: e.toRgbString()})}}>
            {
            selectedText.fill?
            <div className='rounded-[4px] border border-[#e5e5e5]  cursor-pointer w-[24px] h-[24px]' style={{ backgroundColor: selectedText.fill }}  />
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
export function StrokeColor({ onChange, curSelectObj, canvas, className }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selectedText = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      backgroundColor: curSelectObj.backgroundColor,
      stroke: curSelectObj.stroke
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {type: string, value: any}) {
    setOptions({...opt, curSelectObj, canvas, onChange: handleChange})
  }
  return (
    <div className={`mt-[20px] flex justify-between items-center ${className || ''}`}>
      <div className='text-[#121212] text-[14px]'>描边颜色</div>
      <div className='flex items-center'>
        <ColorPicker value={selectedText.stroke} format="hex" onChange={(e: any) => {handleOptions({type:'stroke', value: e.toRgbString()})}}>
          {
            selectedText.stroke?
            <div className='rounded-[4px] border border-[#e5e5e5]  cursor-pointer w-[24px] h-[24px]' style={{ backgroundColor: selectedText.stroke }}  />
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

export function SetStroke({ onChange, curSelectObj, canvas }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selectedText = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      strokeWidth: curSelectObj.strokeWidth,
      stroke: curSelectObj.stroke
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {type: string, value: any}) {
    setOptions({...opt, curSelectObj, canvas, onChange: handleChange})
  }
  return (
    <div className='mt-[20px] flex  items-center'>
      <div className='flex flex-1 items-center'>
        <div className='text-[#121212] text-[14px] mr-[8px]'>描边</div>
        <Slider min={0} max={10} className='flex-1' defaultValue={selectedText.strokeWidth} 
            onChange={(e) => {handleOptions({type: 'strokeWidth', value: e})}} />
        <div className='flex ml-[10px] mr-[5px] items-center justify-center text-[14px] w-[24px] h-[24px] rounded-[3px] border border-[#979797]'>{selectedText.strokeWidth}</div>
      </div>
      <div className='flex items-center'>
        <ColorPicker value={selectedText.stroke} format="hex" onChange={(e: any) => {handleOptions({type:'stroke', value: e.toRgbString()})}}>
          <div className='border border-[#e5e5e5] rounded-[4px] cursor-pointer w-[24px] h-[24px]' style={{ backgroundColor: selectedText.stroke }}  />
        </ColorPicker>
      </div>
    </div>
  )
}

interface BgOptions {
  onChange?: (opt: {type: string, value: any}) => void
  curSelectObj: fabric.Object
  canvas: fabric.Canvas
  isFill: boolean // 是否填充背景
}
export function Setbackground({ onChange, curSelectObj, canvas, isFill }: BgOptions) {
  const [flag, setFlag] = useState(false)
  const selectedText = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      strokeWidth: curSelectObj.strokeWidth,
      stroke: curSelectObj.stroke
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {value: any}) {
    const data = {...opt, curSelectObj, canvas, onChange: handleChange, type: 'fill'}
    data.type = isFill?'fill': 'stroke'
    setOptions(data)
  }
  const textColorList = [
    'rgba(255, 255, 255, 1)', 'rgba(193, 63, 254, 1)', 
    'rgba(251, 59, 59, 1)', 'rgba(255, 146, 32, 1)', 'rgba(92, 88, 255, 1)', 'rgba(193, 255, 44, 1)'
  ]
  return (
    <div className='mt-[20px]'>
      <div>
        <div className='flex items-center justify-between'>
          {/* <div onClick={() => {handleOptions({value: ''})}} 
            style={{ background: `url(${transparency}) repeat`, backgroundSize: '100% 100%'}} 
            className='rounded-[4px] shrink-0 mr-[10px] cursor-pointer w-[24px] h-[24px] border border-[rgba(18,18,18,0.2)]' 
          /> */}
          {
            textColorList.map((color) => (
              <div onClick={() => {handleOptions({ value: color})}} key={color} style={{backgroundColor: color}} className='rounded-[4px] shrink-0 mr-[10px] cursor-pointer w-[24px] h-[24px] border border-[rgba(18,18,18,0.2)]'></div>
            ))
          }
          <div className='shrink-0'>
            <ColorPicker value={selectedText.backgroundColor} format="rgb" className='shrink-0' onChange={(e: any) => {handleOptions({value: e.toRgbString()})}}>
              <div 
                className='rounded-full cursor-pointer w-[24px] h-[24px]' 
                ><img src={ColorIcon} alt="" />
                </div>
            </ColorPicker>
          </div>
        </div>
      </div>
    </div>
  )
}
export function SetRadius({ onChange, curSelectObj, canvas }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selected = useMemo(() => {
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      rx: (curSelectObj as any).rx,
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {type: string, value: any}) {
    setOptions({...opt, curSelectObj, canvas, onChange: handleChange})
  }

  return (
    <div className='mt-[20px] flex items-center'>
      <Radio.Group onChange={(e: any) => {handleOptions({type: 'borderRadius', value: e.target.value})}} value={selected.rx}>
        <Radio value={0}>直角</Radio>
        <Radio value={10}>弧角</Radio>
        <Radio value={50}>圆角</Radio>
      </Radio.Group>
      {/* <Slider min={0} max={99} className='flex-1' defaultValue={selected.rx} 
      onChange={(e) => {handleOptions({type: 'borderRadius', value: e})}} />
      <div className='flex ml-[10px] items-center justify-center text-[14px] w-[24px] h-[24px] rounded-[3px] border border-[#979797]'>{selected.rx}</div> */}

    </div>
  )
}

export function SetOpacity({ onChange, curSelectObj, canvas, className, label }: FontOptions) {
  const [flag, setFlag] = useState(false)
  const selected = useMemo(() => {
    return {
      opacity: curSelectObj.opacity,
    }
  }, [curSelectObj, flag])
  function handleChange(opt: {type: string, value: any}) {
    onChange?.(opt)
    setFlag(!flag)
  }

  function handleOptions(opt: {type: string, value: any}) {
    setOptions({...opt, curSelectObj, canvas, onChange: handleChange})
  }

  return (
    <div className={`mt-[20px] flex items-center ${className || ''}`}>
      {
        label?
        <div>{label}</div>
          : null
      }
      <Slider min={0} step={0.01} max={1} className='flex-1' defaultValue={selected.opacity} 
      onChange={(e) => {handleOptions({type: 'opacity', value: e})}} />
      <div className='flex ml-[10px] items-center justify-center text-[14px] w-[43px] h-[24px] rounded-[3px] border border-[#979797]'>{selected.opacity}%</div>
    </div>
  )
}
export function TooltipContent({ canvas, curSelectObj }: { canvas: fabric.Canvas, curSelectObj: FabricObject }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  useEffect(() => {
    canvas.on('object:moving', function () {
      handleCoords()
    });
    canvas.on('object:scaling', function () {
      handleCoords()
    })
    handleCoords()
  }, [curSelectObj])
  function handleCoords() {
    const selectObj = canvas.getActiveObject()
    const element = elementRef.current;
    if(selectObj && isNotNill(selectObj?.left) && isNotNill(selectObj?.top) && isNotNill(selectObj.width) && isNotNill(selectObj.height) && element) {
      // const isMultiple = (selectObj as any)._objects?.length
      // const offsetLeft = isMultiple? (selectObj.width/2) : 0
      // const offsetTop = isMultiple? (selectObj.height/2) : 0

      const width = element.offsetWidth;
      const leftTemp = Math.floor((selectObj.left || 0) - width/2)
      const topTemp = Math.floor((selectObj.top || 0) + ((selectObj.height || 0) * (selectObj.scaleY || 1))/2 + 10)
      
      setLeft(leftTemp)
      setTop(topTemp)
    }
  }
  return (
    <div 
      ref={elementRef} 
      className='flex bg-white absolute z-[10] h-[32px] py-[4px] text-[#494949] text-[14px]' 
      style={{ left, top }}>
      <div 
        onClick={() => {setOptions({type:'delete', value: '', curSelectObj, canvas })}}
        className='border-[#D3D3D3] border-r h-full flex items-center px-[10px] cursor-pointer'>删除</div>
      <div 
        onClick={() => {setOptions({type:'copy', value: '', curSelectObj, canvas })}}
        className='border-[#D3D3D3] border-r h-full flex items-center px-[10px] cursor-pointer'>复制</div>
      <div 
        onClick={() => {setOptions({type:'toTop', value: '', curSelectObj, canvas})}}
        className=' h-full flex items-center px-[10px] cursor-pointer'>置顶</div>
    </div>
  )
}

interface SetOptions {
  onChange?: (opt: {type: string, value: any}) => void
  type: string
  value: any
  curSelectObj: fabric.Object | fabric.Textbox
  canvas: fabric.Canvas
}
function setOptions({ curSelectObj, type, value, onChange, canvas }: SetOptions) {
  onChange?.({type, value})
  switch (type) {
    case 'toTop':
      curSelectObj.bringToFront()
      break;
    case 'copy':
      curSelectObj.clone((select: any) => {
        select.set({  
          left: select.left + 20, // 调整粘贴后的位置  
          top: select.top + 20  
        });  
        canvas.add(select)
      })
      break;
    case 'delete':
      Modal.confirm({
        title: '提示',
        content: '是否确定删除？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          canvas.remove(curSelectObj)
        },
        onCancel() {},
      })
      break;
    case 'fontFamily':
      curSelectObj.set({
        fontFamily: value
      })
      break;
    case 'fontStyle':
    case 'fontWeight':
      curSelectObj.set({
        fontStyle: '',
        fontWeight: '',
        [type]: value,
      })
      break;
    case 'borderRadius':
      (curSelectObj as any).set({
        rx: value,
        ry: value,
      })
      break
    default:
      curSelectObj.set({ [type]: value })
      break;
  }
  canvas.renderAll()
}

export function loadFromJSON(canvas: fabric.Canvas, rectJSON: string) {
  canvas.loadFromJSON(rectJSON, canvas.renderAll.bind(canvas));
}

/**
 * 后台：组合类型中各种排列组合的属性设置
 * 0:文字+文字、1:元素+元素、2:图片+图片、3:文字+元素、4:文字+图片
 */
export const GROUP_OPTIONS = {
  '0': [
    { type: 'font', target: ['textbox'] },
    { type: 'layout', target: ['textbox'] },
    { type: 'fontColor', target: ['textbox'] },
    { type: 'stroke', target: ['textbox', 'rect', 'circle', 'triangle'] },
  ],
  '1': [],

}

export const PURE_GROUP_TYPE: any = {
  'textbox': '0',
  'shape': '1',
  'image': '2',
  'textbox,shape': '3',
  'textbox,image': '4',
}