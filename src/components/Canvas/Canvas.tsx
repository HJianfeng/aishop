import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '@/components/Canvas/hooks';
import { ActionTypeEnums } from '@/constant/reducer';
import bgImg from '@/assets/bg.jpeg'
import {
  useFormUrl,
  useEventHandlers,
  useCustomizationHandler,
} from '@/components/Canvas/handlers';

interface ICanvas {
  coordinate: string;
  img_width: number;
  url: string;
  img_angle: number;
}

function Canvas(props: ICanvas) {
  const { url, img_width, coordinate, img_angle } = props;

  const { dispatch, canvasInfo } = useCanvasContext();
  useFormUrl({ url, img_width, coordinate, img_angle });
  useEventHandlers();
  useCustomizationHandler();
  
  useEffect(() => {
    const canvas: fabric.Canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#e5e5e5',
      selection: false,
      width: canvasInfo.width,
      height: canvasInfo.height
    });
    canvas.on('object:moving', (event: any) => {
      // console.log('canvas object:moving event', event);
      // 阻止对象移动到画布之外
      let moveObj = event.target as fabric.Object;
      moveObj.setCoords();
      if (moveObj.left !== undefined) {
        if (moveObj.getBoundingRect().left < 0) {
          // moveObj.left = 0
          moveObj.left = Math.max(moveObj.left, moveObj.left - moveObj.getBoundingRect().left);
        } else if (moveObj.getBoundingRect().left + moveObj.getBoundingRect().width > canvas.getWidth()) {
          // moveObj.left = canvas.getWidth() - 200;
          moveObj.left = Math.min(
            moveObj.left,
            canvas.getWidth() - moveObj.getBoundingRect().width + moveObj.left - moveObj.getBoundingRect().left,
          );
        }
      }

      if (moveObj.top !== undefined) {
        if (moveObj.getBoundingRect().top < 0) {
          // moveObj.top = 0;
          moveObj.top = Math.max(moveObj.top, moveObj.top - moveObj.getBoundingRect().top);
        } else if (moveObj.getBoundingRect().top + moveObj.getBoundingRect().height > canvas.getHeight()) {
          // moveObj.top = canvas.getHeight() - 200;
          moveObj.top = Math.min(
            moveObj.top,
            canvas.getHeight() - moveObj.getBoundingRect().height + moveObj.top - moveObj.getBoundingRect().top,
          );
        }
      }
    });
    dispatch({ type: ActionTypeEnums.SET_CANVAS, payload: { canvas } });
    const data: any = {
      source: bgImg,
      repeat: 'repeat'
    }
    canvas.setBackgroundColor(data, canvas.renderAll.bind(canvas))
  }, []);

  return (
    <div className="editor-canvas flex">
      <canvas id="canvas"></canvas>
    </div>
  );
}

export default Canvas;
