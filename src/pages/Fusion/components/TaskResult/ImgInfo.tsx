import { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Modal } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import type { SdOptions } from '../DragImg/module/OptionsModule'
const ImgInfo = ({ imgInfoData }: { imgInfoData?: string }, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgInfoString, setImgInfoString] = useState(imgInfoData || '');

  function openDialog(imgInfo?: string) {
    if(imgInfo) {
      setImgInfoString(imgInfo)
    }
    setIsModalOpen(true)
  }
  const imgInfo: SdOptions = useMemo(() => {
    if(imgInfoString) {
      try {
        return JSON.parse(imgInfoString)
      } catch (error) {
        return {}
      }
    }
    return {}
  }, [imgInfoString])
  useImperativeHandle(ref, () => ({
    openDialog
  }))
  const map = ['填充', '原图', '噪声', '零数值']
  function isNotNill(val: any) {
    return val || val === 0
  }
  const InfoList = [
    { label: `模式${imgInfo.create_type || "A"}` },
    { label: isNotNill(imgInfo.inpainting_fill)?map[imgInfo.inpainting_fill] || '':'' },
    { label: isNotNill(imgInfo.cfg_scale)?`CFG：${imgInfo.cfg_scale}` : '' },
    { label: isNotNill(imgInfo.denoising_strength)?`重绘：${imgInfo.denoising_strength}` : '' },
    { label: isNotNill(imgInfo.steps)?`步数：${imgInfo.steps}` : '' },
    { label: isNotNill(imgInfo.sampler_name)?imgInfo.sampler_name : '' },
  ]
  return (
    <Modal 
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
      width={600}
      footer={null}>
      <div className="font-medium text-[16px]">图片信息</div>
      <div className="flex items-center mt-[20px] flex-wrap">
        {
          InfoList.map((i: any, index: number) => {
            return (
              i.label?  <div 
              className={`
                font-medium text-[14px] text-[#574F4F] border-[#979797] px-[10px]
                h-[31px] flex items-center ${index > 0?'border-l':''}
                ${index === 0?'pl-[0]':''}`
              } 
              key={i.label}>{i.label}</div> :null
            )
          })
        }
      </div>
      <div className="text-[14px] mt-[10px] text-[#574F4F]font-medium">
        模型：<span className="text-[#818181] font-normal">{imgInfo.sd_model_checkpoint}</span>
      </div>
      <div className="text-[14px] mt-[10px] text-[#574F4F]font-medium">
        提示词：<span className="text-[#818181] font-normal">{imgInfo.prompt}</span>
      </div>
      <div className="text-[14px] mt-[10px] text-[#574F4F]font-medium">
        反向词：<span className="text-[#818181] font-normal">{imgInfo.negative_prompt}</span>
      </div>
      <div className="flex mt-[10px]">
        <div className="text-[14px] mr-[14px] text-[#574F4F]font-medium">
          controlNet：<span className="text-[#818181] font-normal truncate">{imgInfo.cnargs_model || '--'}</span>
        </div>
        <div className="mr-[14px]">权重：{imgInfo.cnargs_weight}</div>
        <div className="mr-[14px]">start：{imgInfo.cnargs_guidance_start}</div>
        <div className="mr-[14px]">end：{imgInfo.cnargs_guidance_end}</div>
      </div>
  </Modal>
  )
}
export default forwardRef(ImgInfo)