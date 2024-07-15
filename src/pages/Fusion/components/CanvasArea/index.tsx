import React from 'react';
import Canvas from "@/components/Canvas";
import { useCanvasContext } from '@/components/Canvas/hooks';
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

interface Prop {
  data: {
    img_width: number,
    main_img: string,
    coordinate: string
    img_angle: number
  }
}
function CanvasArea(props: Prop) {
  const { state } = useCanvasContext();
  const { loading } = state;
  
  return (
    <div className="canvasarea relative">
      {
        loading?
        <div className='absolute flex items-center justify-center top-0 left-0 w-full h-full'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
        </div> :null
      }
      <Canvas img_angle={props?.data?.img_angle || 0} img_width={props?.data?.img_width} url={props?.data?.main_img} coordinate={props?.data?.coordinate || ''} />
    </div>
  )
}

export default CanvasArea