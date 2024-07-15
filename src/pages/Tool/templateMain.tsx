import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button, message } from 'antd';
import TemplateCanvas from './templateCanvas'
import SelectType from '@/pages/Fusion/components/SelectType'
import PubSub from 'pubsub-js';
import { handleCoordinate } from '@/utils';
import { imgTempCreate, templateSave } from '@/service';
import { ISceneItem } from '@/interface';
import axios from 'axios';
import ArrowIcon from '@/assets/arrow.png'

interface Prop {
  taskData: any
  setPageLoading: (val: boolean) => void
}
let listCancelToken: any = null;
const DragImg = (prop: Prop, ref: any) => {
  const [loading, setLoading] = useState(false);
  const selectType:any = useRef(null);
  const container:any = useRef(null);
  const TemplateCanvasRef:any = useRef(null)
  const [styleConfig, setStyleConfig] = useState<ISceneItem>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // PubSub.subscribe('taskCurrentLoading', () => {
    //   setLoading(true);
    // })
    // PubSub.subscribe('taskCurrentCancelLoading', () => {
    //   PubSub.publish('cancelSetLoading');
    //   setLoading(false);
    // })
    return () => {
      cancelCreate()
    }
  }, [])
 
  
  const onCreate = async () => {
    if(!TemplateCanvasRef || !TemplateCanvasRef.current) {
      return
    }
    setVisible(false)
    const canvas = TemplateCanvasRef.current.canvas
    const objs = canvas.getObjects()
    const mainObj = objs.find((i:any) => i.id === 'main-img')
    const x = parseInt(mainObj?.left || 0 + '');
    const y = parseInt(mainObj?.top || 0 + '')
    const width = parseInt((mainObj?.width || 0) * (mainObj?.scaleX || 1) + '')
    const height = parseInt((mainObj?.height || 0) * (mainObj?.scaleY || 1) + '')
    const angle = parseInt(mainObj?.angle || 0 + '')
    const result  = handleCoordinate({
      frontOpt: { width: canvas.width, height: canvas.height },
      resultInfo: { width: 512, height: 512 },
      x, y, 
      img_width: width,
      img_height: height,
    })
    try {
      
   
    const {img, JSONdata} = await TemplateCanvasRef.current.getResult()
    const maskImg = img.replace('data:image/png;base64,', '')
    const params = {
      task_id: prop.taskData?.id.toString(),
      style_id: (styleConfig?.id || -1).toString(),
      coordinate: `${result.x},${result.y}`,
      img_angle: angle,
      style_name: styleConfig?.style_name || '随机风格',
      batch_number: '4',
      img_width: result.img_width.toString(),
      img_height: result.img_height.toString(),
      img: maskImg
    }
    templateSave({
      "t_config":JSON.stringify(JSONdata),
      "img":maskImg, //模板列表显示的图片，b64格式
      "t_name":`${new Date().valueOf}_${Math.ceil(Math.random() * 99999)}`,  //模板名称
      "t_type":"氛围图", //类型
      "canvas":"512,512" //大小
    }).then((res) => {}).catch(() => {})

    setLoading(true);
    prop.setPageLoading(true)
    PubSub.publish('setLoading', styleConfig?.cost_time || 20);
    const source = axios.CancelToken.source();
    listCancelToken = source
    imgTempCreate(params, source.token).then((res) => {
      listCancelToken = null
      PubSub.publish('updateImgResultList', { task_id: prop.taskData?.id });
      prop.setPageLoading(false)
      setLoading(false);
      TemplateCanvasRef?.current?.switchTab(1)
    }).catch((error) => {
      if(error.message !== 'cancel') {
        message.error(error.message || '连接图片服务器失败');
      }
      prop.setPageLoading(false)
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
    } catch (error) {
      console.log(error);
    }
  }
  
  function setStyle(data: ISceneItem) {
    setStyleConfig(data)
  }
  const handleOpenChange = (newOpen: boolean, e?: any) => {
    setVisible(newOpen);
    e?.stopPropagation()
  };
  useImperativeHandle(ref, () => ({
    cancelCreate
  }))
  function cancelCreate() {
    if(listCancelToken) listCancelToken.cancel('cancel');
  }
  return (
    <div className='px-[5px] pb-[10px]' >
      <div ref={container} className="relative overflow-hidden">
        <div className='text-[#323232] my-[12px] justify-between pl-[15px] text-[16px] font-semibold flex items-center h-[32px]'>
          <div className={`w-[80px] mr-[10px] text-primary flex items-center justify-center h-full`}>模版工具台</div>
        </div>
        <TemplateCanvas ref={TemplateCanvasRef} taskData={prop.taskData} />
        <SelectType 
          visible={visible}
          containerWidth="512px"
          itemWidth="110px"
          styleConfig={styleConfig}
          setStyle={setStyle}
          handleOpenChange={handleOpenChange} 
          container={container} ref={selectType} /> 
      </div>
      <div className='p-[5px] w-[512px] mt-[10px] items-center h-[80px] border border-[#EFEFEF] rounded-[5px]'>
        {/* FOOTER */}
        <div className='flex h-full'>
          <div onClick={(e: any) => {handleOpenChange(visible?false:true, e)}} className="flex flex-1 cursor-pointer h-full">
            <div className='w-[36px] flex items-center justify-center'>
              {
                visible?
                <img src={ArrowIcon} className='w-[14px] rotate-[180deg]' alt="" />:
                <img src={ArrowIcon} className='w-[14px]' alt="" />
              }
            </div>
            <img key={styleConfig?.id} className='h-full w-[70px]' src={styleConfig?.style_img ? styleConfig?.style_img : 'https://web-1304948377.cos.ap-shanghai.myqcloud.com/ai-web/random-style-f6f6537e.png'} alt="" />
            <div className='ml-[12px] flex-1 w-[0] mt-[5px]'>
              <div className='text-[#9D9D9D] text-[14px]'>场景/风格</div>
              <div className='text-[121212] truncate text-[16px] font-semibold mt-[7px]'>{styleConfig?.style_name || '随机变变变'}</div>
            </div>
          </div>
          <Button loading={loading} onClick={(e) => {e.stopPropagation();onCreate();}} className='!h-full !w-[100px] !rounded-[5px]' type='primary' size='large'>GO!</Button>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(DragImg)

