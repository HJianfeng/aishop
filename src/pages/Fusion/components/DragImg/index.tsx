import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { MenuProps } from 'antd';
import { Dropdown, Button, message } from 'antd';
import { DownOutlined, UpOutlined} from '@ant-design/icons';
import { useCanvasContext } from '@/components/Canvas/hooks';
import CanvasArea from '../CanvasArea'
import SelectType from '../SelectType'
import PubSub from 'pubsub-js';
import { handleCoordinate } from '@/utils';
import { imgCreate,taskServerStatus } from '@/service';
import style from '../../style.module.scss'
import { ISceneItem } from '@/interface';
import axios from 'axios';
import { useSelector } from 'react-redux'
import ArrowIcon from '@/assets/arrow.png'
import { emitter } from '@/utils/eventBus'

interface Prop {
  taskData: any
}
let listCancelToken: any = null;
const DragImg = (prop: Prop, ref: any) => {
  const [currentSize, setCurrentSize] = useState('800 x 800');
  const [loading, setLoading] = useState(false);
  const { imageOffset, canvasInfo } = useCanvasContext();
  const selectType:any = useRef(null);
  const container:any = useRef(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [styleConfig, setStyleConfig] = useState<ISceneItem>();
  const [visible, setVisible] = useState(false);
  const fusionImgInfo = useSelector((state: any) => state.tool.fusionImgInfo)

  useEffect(() => {
    PubSub.subscribe('taskCurrentLoading', () => {
      setLoading(true);
    })
    PubSub.subscribe('taskCurrentCancelLoading', () => {
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
    return () => {
      cancelCreate()
    }
  }, [])
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    setCurrentSize(key)
  };
  const sizeList = [
    { key: '800 x 800', label: (
      <div className='whitespace-nowrap cursor-auto text-center'>800 x 800</div>
    ), }
  ];
  const onCreate = async () => {
    const status = await taskServerStatus()
    if (status==="false"){
      message.warning('目前使用的人较多，等待时间稍长哦~',10)
    }

    const x = parseInt(imageOffset.current.x + '');
    const y = parseInt(imageOffset.current.y + '')
    const width = parseInt(imageOffset.current.width + '')
    const angle = parseInt(imageOffset.current.angle + '')
    const result  = handleCoordinate({
      frontOpt: { width: canvasInfo.width, height: canvasInfo.height },
      resultInfo: fusionImgInfo,
      x, y, img_width: width
    })
    setLoading(true);
    const params = {
      task_id: prop.taskData?.id,
      style_id: styleConfig?.id || -1,
      coordinate: `${result.x},${result.y}`,
      img_angle: angle,
      style_name: styleConfig?.style_name || '随机风格',
      batch_number: 4,
      img_width: result.img_width,
    }
    
    PubSub.publish('setLoading', styleConfig?.cost_time || 20);
    const source = axios.CancelToken.source();
    listCancelToken = source
    imgCreate(params, source.token).then((res) => {
      listCancelToken = null
      PubSub.publish('updateImgResultList', { task_id: prop.taskData?.id });
      emitter.emit('updateTask', {
        id: prop.taskData?.id,
        opt: {
          img_angle: params.img_angle,
          coordinate: params.coordinate,
          img_width: imageOffset.current.width
        }
      })
      setLoading(false);
    }).catch((error) => {
      if(error.message !== 'cancel') {
        message.error(error.message || '连接图片服务器失败');
      }
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
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
        <div className='text-[#323232] mb-[12px] justify-between pl-[15px] text-[16px] font-semibold flex items-center h-[52px]'>
          <div onClick={() => {setActiveTab(0)}} className={`w-[80px] mr-[10px] hover:text-primary cursor-pointer flex items-center justify-center h-full ${activeTab === 0?'text-primary text-[20px] ' + style.activeTab:''}`}>常规</div>
          {/* <div onClick={() => {setActiveTab(1)}} className={`w-[80px] hover:text-primary cursor-pointer flex items-center justify-center  h-full ${activeTab === 1?'text-primary text-[20px] ' + style.activeTab:''}`}>高级</div> */}
          <div className='mr-[5px]'>
            <Dropdown arrow={{pointAtCenter: true}} placement="bottom" trigger={['click']} menu={{ items: sizeList, onClick: onMenuClick }}>
              <div className='text-[#ACACAC] cursor-pointer text-[14px] font-medium' onClick={(e) => e.preventDefault()}>
                {currentSize}
                <DownOutlined className='ml-[5px] text-[13px]  font-bold' />
              </div>
            </Dropdown>
          </div>
        </div>
        <CanvasArea data={prop.taskData} />
        <SelectType 
            visible={visible}
            styleConfig={styleConfig}
            setStyle={setStyle}
            handleOpenChange={handleOpenChange} 
            container={container} ref={selectType} /> 
      </div>
      <div className='p-[5px] mt-[10px] items-center h-[80px] border border-[#EFEFEF] rounded-[5px]'>
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