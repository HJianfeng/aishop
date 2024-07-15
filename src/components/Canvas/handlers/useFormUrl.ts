  import { useEffect } from 'react';
import { fabric } from 'fabric'
import { useCanvasContext } from '@/components/Canvas/hooks';
import { ActionTypeEnums } from '@/constant/reducer';
import { getResultImgUrl } from '@/utils/location';
import bgImg from '@/assets/bg.jpeg'


interface IParams {
  url: string;
  width?: number;
  img_width: number;
  coordinate: string;
  img_angle: number;
}

function useFormUrl(params: IParams) {
  const { url, width = 180, img_width, coordinate = '0, 0', img_angle } = params;
  const URL = getResultImgUrl(url);
  const L = Number(coordinate.split(',')[0]);
  const T = Number(coordinate.split(',')[1]);
  
  const { state, dispatch, imageOffset } = useCanvasContext();
  const { canvas } = state;
  useEffect(() => {
    if (!canvas || !url) {
      return;
    }

    const drewPage: fabric.Image[] = [];
    dispatch({
      type: ActionTypeEnums.SET_CANVAS_IS_LOAD,
      payload: {
        loading: true
      }
    })
    fabric.Object.prototype.set({
      borderColor: '#5C7AFF',
      cornerColor: '#5C7AFF',
      cornerStrokeColor: '#5C7AFF'
    })
    fabric.Image.fromURL(URL, (img: any) => {
      dispatch({
        type: ActionTypeEnums.SET_CANVAS_IS_LOAD,
        payload: {
          loading: false
        }
      })

      
      drewPage.push(img)
      canvas.renderAll.bind(canvas);

      let newImageInfo: any = { width: img.width, height: img.height };
      // const scale = Number(img_width) > 0 ? Number(img_width) / newImageInfo.width :  newImageInfo.width / newImageInfo.width;
      let scale = 1;
      let canvasWidth = canvas?.width || 400
      let canvasHeight = canvas?.height || 400
      const INIT_IMGSCALE = 0.67
      if(Number(img_width) > 0) {
        scale = Number(img_width) / newImageInfo.width
      } else {
        if(newImageInfo.width >= newImageInfo.height) {
          if(newImageInfo.width > canvasWidth * INIT_IMGSCALE) {
            scale = (canvasWidth * INIT_IMGSCALE) / newImageInfo.width;
          }
        } else {
          if(newImageInfo.height > canvasHeight * INIT_IMGSCALE) {
            scale = (canvasHeight * INIT_IMGSCALE) / newImageInfo.height;
          }
        }
      }
      
      img.scale(scale);
      const left = L || (canvas?.width || 0 - img.width * scale) / 2;
      const top = T || (canvas?.height || 0 - img.height * scale) / 2;
      img.set({ left, top, angle: img_angle || 0, originX: 'center', originY: 'center'})
      imageOffset.current = {
        x: left,
        y: top,
        width: img_width || img.width * img.scaleX,
        angle: img_angle | 0
      }
      canvas.clear()
      const data: any = {
        source: bgImg,
        repeat: 'repeat'
      }
      canvas.setBackgroundColor(data, canvas.renderAll.bind(canvas))
      canvas.add(img) // 将图片加入到画布
      canvas.setActiveObject(img)
      if(!L && !T) {
        canvas.centerObject(img)
        if(canvas.height) img.set({top: canvas.height - (img.height * scale)/2 - 50})
        imageOffset.current.x = img.left;
        imageOffset.current.y = img.top;
      }
      // setControlsVisibility(optionsopt)：批量设置控制角可见性
    }, 
    { lockRotation: true, lockScalingFlip: true, lockSkewingX: true, lockSkewingY: true });

    return () => {
      drewPage.forEach(img => {
        canvas.remove(img);
      });
    };
  }, [canvas, url, URL, width, img_width, coordinate, img_angle, imageOffset, L, T, dispatch]);
}

export default useFormUrl;