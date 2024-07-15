import React from 'react';
import Canvas from "@/components/Canvas";

function CanvasArea(props: any) {
  return (
    <div className="canvasarea">
      <Canvas img_angle={props?.data?.img_angle} img_width={props?.data?.img_width} url={props?.data?.main_img} coordinate={props?.data?.coordinate || ''} />
    </div>
  )
}

export default CanvasArea