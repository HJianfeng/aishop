import { Select, Dropdown, Tooltip, ColorPicker, Switch, Radio  } from 'antd';
import { useMemo, useState } from 'react';
import Style from '../style.module.scss'
import AlignLeft from '@/assets/smear/align_left.png'
import AlignCenter from '@/assets/smear/align_center.png'
import AlignRight from '@/assets/smear/align_right.png'
import ToTop from '@/assets/smear/top.png'
import ColorIcon from '@/assets/smear/color.png'
import { fabric } from 'fabric'

interface IProps {
  setOptions: Function
  curSelectObj: fabric.Object
}
const TextOptions = ({ setOptions, curSelectObj } :IProps) => {
  const [flag, setFlag] = useState(false)

  const selectedText = useMemo(() => {
    console.log(curSelectObj);
    
    return {
      ...(curSelectObj as any).__dimensionAffectingProps,
      backgroundColor: curSelectObj.backgroundColor,
      fill: curSelectObj.fill
    }
  }, [curSelectObj, flag])
  
  const styleHtml: any = {
    'bold': (<div className='font-bold text-center cursor-pointer'>粗体</div>),
    'italic': (<div className='italic text-center cursor-pointer'>斜体</div>),
  }
  
  function handelOptions(data: { type: string, value: any }) {
    setOptions(data)
    setFlag(!flag)
  }
  const items = [
    { key: '', label: (
      <div onClick={() => {handelOptions({type:'fontStyle', value: ''})}} className={`${selectedText.fontStyle !== 'italic' && selectedText.fontWeight !== 'bold'?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>常规</div>
    ) },
    { key: 'bold', label: (
      <div onClick={() => {handelOptions({type:'fontWeight', value: 'bold'})}} className={`${['bold'].includes(selectedText.fontWeight)?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>{styleHtml['bold']}</div>
    ) },
    { key: 'italic', label: (
      <div onClick={() => {handelOptions({type:'fontStyle', value: 'italic'})}} className={`${['italic'].includes(selectedText.fontStyle)?'text-white bg-primary':''} rounded-[4px] text-center cursor-pointer`}>{styleHtml['italic']}</div>
    ) },
  ]
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
  const textColorList = [
    'rgba(255, 255, 255, 1)', 'rgba(193, 63, 254, 1)', 
    'rgba(251, 59, 59, 1)', 'rgba(255, 146, 32, 1)', 'rgba(92, 88, 255, 1)', 'rgba(193, 255, 44, 1)'
  ]
  return (
    <div>
      <div className='flex items-center bg-[#f5f5f5] h-[40px] rounded-[5px]'>
        <Select 
          className={`${Style.selectFont} flex items-center flex-1`}
          value={selectedText.fontFamily}
          onChange={(e) => {handelOptions({type:'fontFamily', value: e})}}
          options={fontList}
        />
        <div className='w-[1px] h-[26px] bg-[#DDDDDD]'></div>
        <Dropdown menu={{ items, className: Style.dropdown }} trigger={['click']}>
          <div className='font-semibold w-[64px] cursor-pointer text-center'>
            {styleHtml[selectedText.fontStyle] || styleHtml[selectedText.fontWeight] || '常规'}
          </div>
        </Dropdown>
      </div>
      <div className='flex items-center bg-[#f5f5f5] h-[40px] rounded-[5px] mt-[20px]'>
        <div className='flex items-center h-full flex-1'>
          <Tooltip title="左对齐" mouseEnterDelay={1}>
            <div onClick={() => {handelOptions({type:'textAlign', value: 'left'})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
              <img className='w-[17px]' src={AlignLeft} alt="" />
            </div>
          </Tooltip>
          <Tooltip title="居中" mouseEnterDelay={1}>
            <div onClick={() => {handelOptions({type:'textAlign', value: 'center'})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
              <img className='w-[17px]' src={AlignCenter} alt="" />
            </div>
          </Tooltip>
          <Tooltip title="右对齐" mouseEnterDelay={1}>
            <div onClick={() => {handelOptions({type:'textAlign', value: 'right'})}} className='w-[40px] flex-1 h-full flex items-center justify-center cursor-pointer'>
              <img className='w-[17px]' src={AlignRight} alt="" />
            </div>
          </Tooltip>
        </div>
        <div className='w-[1px] h-[26px] bg-[#DDDDDD]'></div>
        <div className='w-[64px] h-full'>
          <Tooltip title="置顶（图层置顶）" mouseEnterDelay={1}>
            <div onClick={() => {handelOptions({type:'toTop', value: ''})}} className='w-full h-full flex items-center justify-center cursor-pointer'>
              <img className='w-[17px]' src={ToTop} alt="" />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className='mt-[20px]'>
        <div className='text-[#ACACAC] text-[14px] mb-[11px]'>字体颜色</div>
        <div className='flex items-center'>
          {
            textColorList.map((color) => (
              <div onClick={() => {handelOptions({type:'fill', value: color})}} key={color} style={{backgroundColor: color}} className='rounded-[4px] mr-[15px] cursor-pointer w-[24px] h-[24px] border border-[rgba(18,18,18,0.2)]'></div>
            ))
          }
          <ColorPicker value={selectedText.fill} format="hex" onChange={(e: any) => {handelOptions({type:'fill', value: e.toRgbString()})}}>
            <div className='rounded-full cursor-pointer w-[24px] h-[24px]'  >
              <img src={ColorIcon} alt="" />
            </div>
          </ColorPicker>
        </div>
      </div>
      <div className='mt-[20px]'>
        <div className='text-[#ACACAC] flex items-center text-[14px] mb-[11px]'>
          <div className='flex-1'>背景颜色</div>
          <Switch checked={selectedText.backgroundColor} onChange={(e) => {
            if(!e) {
              handelOptions({type:'backgroundColor', value: ''})
            } else {
              handelOptions({type:'backgroundColor', value: '#ffffff'})
            }
          }} />
        </div>
        {
          selectedText.backgroundColor?
          <div>
            <div className='flex items-center'>
              {
                textColorList.map((color) => (
                  <div onClick={() => {handelOptions({type:'backgroundColor', value: color})}} key={color} style={{backgroundColor: color}} className='rounded-[4px] mr-[15px] cursor-pointer w-[24px] h-[24px] border border-[rgba(18,18,18,0.2)]'></div>
                ))
              }
              <ColorPicker value={selectedText.backgroundColor} format="rgb" onChange={(e: any) => {handelOptions({type:'backgroundColor', value: e.toRgbString()})}}>
                <div 
                  className='rounded-full cursor-pointer w-[24px] h-[24px]' 
                  ><img src={ColorIcon} alt="" />
                  </div>
              </ColorPicker>
            </div>
          </div>
          : null
        }
        <div className='flex mt-[20px] border-t border-[#F5F5F5] pt-[10px]'>
          <div onClick={() => {handelOptions({type:'copy', value: ''})}} className='hover:border-primary hover:text-primary mr-[5px] flex-1 cursor-pointer h-[36px] border border-[#D3D3D3] rounded-[5px] text-[#121212] font-semibold flex items-center justify-center'>复制</div>
          <div onClick={() => {handelOptions({type:'delete', value: ''})}} className='hover:border-primary hover:text-primary flex-1 cursor-pointer h-[36px] border border-[#D3D3D3] rounded-[5px] text-[#121212] font-semibold flex items-center justify-center'>删除</div>
        </div>
      </div>
    </div>
  )
}

export default TextOptions