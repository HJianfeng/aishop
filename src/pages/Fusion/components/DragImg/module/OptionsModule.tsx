import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Radio, Select, InputNumber, Input, message } from 'antd';
import { copyToClip } from '@/utils'
import { getModel } from '@/service'
import CanvasArea from '../../CanvasArea'

export interface SdOptions {
  create_type?: string
  lora: string
  sd_model_checkpoint: string
  prompt: string
  negative_prompt: string
  inpainting_fill: number
  sampler_name: string
  steps: number
  cfg_scale: number
  denoising_strength: number

  cnargs_module: string, // 预处理
  cnargs_model: string, // 模型
  cnargs_weight?: number,
  cnargs_guidance_start?: number,
  cnargs_guidance_end?: number
}
const Options = forwardRef((prop:any, ref: any) => {
  const [params, setParams] = useState<SdOptions>({
    sd_model_checkpoint: '',
    prompt: '',
    negative_prompt: '',
    inpainting_fill: 0,
    sampler_name: '',
    steps: 25,
    cfg_scale: 7,
    denoising_strength: 1,
    lora: '',
    // controlNet
    cnargs_module: '', // 预处理
    cnargs_model: '', // 模型
    cnargs_weight: undefined,
    cnargs_guidance_start: undefined,
    cnargs_guidance_end: undefined
  })

  const [modelList, setModelList] = useState<any>([])
  const [loraList, setLoraList] = useState<any>([])
  const [cnModelList, setCnModelList] = useState<any>([])
  const [samplerList, setSamplerList] = useState<any>([])

  useState(() => {
    getAllModel()
  })
  async function getAllModel() {
    try {
      const res = await getModel({ model_type: '' })
      const model: any = [];
      const lora: any = [];
      const sample: any = [];
      const cn_model: any = [];
      if(res && res.length) {
        res.forEach((i: any) => {
          if(i.model_type === 'model') { model.push(i) }
          if(i.model_type === 'lora') { lora.push(i) }
          if(i.model_type === 'sample') { sample.push(i) }
          if(i.model_type === 'cn_model') { 
            i.cnargs_model = i.key
            delete i.key
            cn_model.push(i) 
          }
        })
      }
      setModelList(model)
      setLoraList(lora)
      setSamplerList(sample)
      setCnModelList(cn_model)
      
    } catch (error) {
      
    }
  }
  useImperativeHandle(ref, () => ({
    params, fillData
  }))
  function changeParams(val: any, key: string) {
    setParams((data: any) => {
      return {...data, [key]: val}
    })
  }
  async function changeLora(val: any) {
    changeParams(val, 'lora')
    await copyToClip(`<lora:${val}:1>`)
    message.success('复制lora成功')
  }
  function copyLora(val: string) {
    setParams((data: any) => {
      const prompt = data.prompt +  ` <lora:${val}:1>`
      return {...data, prompt}
    })
  }
  function changeCnModel(val: any) {
    const item = cnModelList.find((i: any) => i.model_name === val)
    changeParams(val, 'cnargs_module')
    if(item) changeParams(item.cnargs_model, 'cnargs_model')
  }
  function fillData(data?: any) {
    if(!data) {
      data = {
        sd_model_checkpoint: '',
        prompt: '',
        negative_prompt: '',
        inpainting_fill: 0,
        sampler_name: '',
        steps: 25,
        cfg_scale: 7,
        denoising_strength: 1,
        lora: '',
        // controlNet
        cnargs_module: '', // 预处理
        cnargs_model: '', // 模型
        cnargs_weight: undefined,
        cnargs_guidance_start: undefined,
        cnargs_guidance_end: undefined
      }
    };
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        changeParams(data[key], key)
      }
    }
  }
  const disabled = useMemo(() => {
    return prop.disabled
  }, [prop.disabled])
  return ( 
   <div className='w-full'>
      <div className='flex'>
        <CanvasComponents taskData={prop.taskData} />
        <div className='flex-1 ml-[5px]'>
          <div className='flex items-center'>
            <div className='text-[#818181] text-[14px] mr-[10px] shrink-0'>模型</div>
            <div className='flex-1 w-0'>
              <Select
                className='w-full'
                fieldNames={{ label: 'model_name', value: 'key' }}
                value={params.sd_model_checkpoint}
                disabled={disabled}
                onChange={(e) => changeParams(e, 'sd_model_checkpoint')}
                options={modelList}
              />
            </div>
          </div>
          <div className='flex items-center mt-[10px]'>
            <div className='text-[#818181] text-[14px] mr-[10px] shrink-0'>Lora</div>
            <div className='flex-1 w-[288px]'>
                {/* fieldNames={{ label: 'model_name', value: 'key' }} */}
              <Select
                className='w-full'
                value={params.lora}
                disabled={disabled}
                onChange={changeLora}
                optionLabelProp="value"
              >
                {
                  loraList.map((i: any, index: number) => (
                    <Select.Option key={i.key + index} value={i.key}>
                      <div className='flex items-center'>
                        <div className='flex-1 w-0 truncate'>{i.model_name}</div>
                        <div className='cursor-pointer text-primary' onClick={(e) => {e.stopPropagation();copyLora(i.key)}}>复制</div>
                      </div>
                    </Select.Option>
                  ))
                }
            </Select>
            </div>
          </div>
          <div className='flex items-center mt-[10px]'>
            <div className='w-[28px] mr-[10px]'></div>
            <Radio.Group disabled={disabled} onChange={(e: any) => changeParams(e.target.value, 'inpainting_fill')} value={params.inpainting_fill}>
              <Radio value={0} className='text-[#818181] text-[14px]'>填充</Radio>
              <Radio value={1} className='text-[#818181] text-[14px]'>原图</Radio>
              <Radio value={2} className='text-[#818181] text-[14px]'>噪声</Radio>
              <Radio value={3} className='text-[#818181] text-[14px]'>零数值</Radio>
            </Radio.Group>
          </div>
          <div className='flex items-center mt-[10px]'>
            <div className='flex flex-1 shrink-0 items-center'>
              <div className='text-[#818181] text-[14px] mr-[10px] shrink-0'>采样</div>
              <div className='flex-1 w-0'>
                <Select
                  className='w-full'
                  fieldNames={{ label: 'model_name', value: 'key' }}
                  value={params.sampler_name}
                  disabled={disabled}
                  onChange={(e) => changeParams(e, 'sampler_name')}
                  options={samplerList}
                />
              </div>
            </div>
            <div className='flex items-center ml-[5px]'>
              <div className='text-[#818181] text-[14px] mr-[10px] shrink-0'>步数</div>
              <div className='flex-1'>
                <InputNumber value={params.steps} disabled={disabled} onChange={(e: any) => {changeParams(e, 'steps')}} controls={false} />
              </div>
            </div>
          </div>
          <div className='flex items-center mt-[10px]'>
            <div className='flex items-center'>
              <div className='text-[#818181] text-[14px] mr-[10px] shrink-0'>CFG</div>
              <div className='flex-1'>
                <InputNumber value={params.cfg_scale} disabled={disabled} onChange={(e: any) => {changeParams(e, 'cfg_scale')}} controls={false} />
              </div>
            </div>
            <div className='flex items-center ml-[5px]'>
              <div className='text-[#818181] text-[14px] mr-[10px]'>重绘幅度</div>
              <div className='flex-1'>
                <InputNumber value={params.denoising_strength} disabled={disabled} onChange={(e: any) => {changeParams(e, 'denoising_strength')}} controls={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-[12px] pt-[8px] rounded-[5px] relative'>
        {/* <span className='text-[#818181] mb-[3px] text-[14px] font-medium'>提示词：</span> */}
        <Input.TextArea 
          value={params.prompt} 
          placeholder='这里填写提示词哦'
          disabled={disabled}
          style={{ height: 80, resize: 'none' }}
          onChange={(e) => changeParams(e.target.value, 'prompt')}
        />
      </div>
      <div className='mt-[10px] pt-[8px] rounded-[5px] relative'>
        {/* <div className='text-[#818181] mb-[3px] text-[14px] font-medium'>反向词：</div> */}
        <Input.TextArea 
          value={params.negative_prompt} 
          placeholder='不要忘记这里还有反向词哦'
          disabled={disabled}
          style={{ height: 80, resize: 'none' }}
          onChange={(e) => changeParams(e.target.value, 'negative_prompt')}
        />
      </div>
      <div className='text-[#D3D3D3] text-[14px] mt-[12px] mb-[10px]'>controlNet</div>
      <div className='flex'>
        <div className='flex mr-[5px] mb-[10px]'>
          <div className='text-[#818181] px-[11px] leading-[30px] text-[14px] font-medium'>处理模型 </div>
          <div className='flex-1  w-[190px]'>
            <Select
              className='w-full'
              fieldNames={{ label: 'model_name', value: 'model_name'}}
              value={params.cnargs_module}
              disabled={disabled}
              onChange={changeCnModel}
              options={cnModelList}
            />
          </div>
        </div>
        <div className='flex mr-[5px] mb-[10px]'>
          <div className='text-[#818181] px-[11px] leading-[30px] whitespace-nowrap text-[14px] font-medium'>权重 </div>
          <div className='flex-1'>
            <InputNumber
              value={params.cnargs_weight}
              className='w-[40px]'
              disabled={disabled}
              onChange={(e) => changeParams(e, 'cnargs_weight')}
              controls={false} />
          </div>
        </div>
        <div className='flex mr-[5px] mb-[10px] '>
          <div className='text-[#818181] px-[11px] leading-[30px] text-[14px] font-medium'>start</div>
          <div className='flex-1'>
            <InputNumber
              value={params.cnargs_guidance_start}
              className='w-[40px]'
              disabled={disabled}
              onChange={(e) => changeParams(e, 'cnargs_guidance_start')}
              controls={false} />
          </div>
        </div>
        <div className='flex mr-[5px] mb-[10px]'>
          <div className='text-[#818181] px-[11px] leading-[30px] text-[14px] font-medium'>end</div>
          <div className='flex-1'>
            <InputNumber
              value={params.cnargs_guidance_end}
              className='w-[40px]'
              disabled={disabled}
              onChange={(e) => changeParams(e, 'cnargs_guidance_end')}
              controls={false} />
          </div>
        </div>
      </div>
    </div>
  )
})

const CanvasComponents = forwardRef(({ taskData }: any, ref: any) => {
  return (
    <div className='w-[210px] h-[210px]'>
      <CanvasArea data={taskData}></CanvasArea>
    </div>
  )
})

export default Options