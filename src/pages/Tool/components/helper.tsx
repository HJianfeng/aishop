import { fabric } from 'fabric'
import { fontList } from '@/components/Smear/helper'

export const optionsList = [
  { label: '字体', id: 'font', use: ['textbox'] },
  { label: '图层', id: 'layout', use: ['textbox'] },
  { label: '字体颜色', id: 'fontColor', use: ['textbox'] },
  { label: '描边', id: 'stroke', use: ['textbox', 'line'] },
  
  { label: '背景颜色', id: 'background', use: ['rect', 'circle', 'line', 'triangle'] },
  { label: '圆角', id: 'borderRadius', use: ['rect'] },

  { label: '透明度', id: 'opacity', use: ['image'] },
]
/**
 * 
 * @param canvas 
 * @param dissolve 是否解组
 */
export function merge(canvas: fabric.Canvas, dissolve?:boolean) {
  if(!dissolve) {
    // 组合
    
    const selected = canvas.getActiveObjects()
    deleteObj(canvas)
    if(selected && selected.length) {
      let allObjects: fabric.Object[] = [];
      selected.forEach((activeObject: any)=> {
        // 避免嵌套成组
        if(activeObject && activeObject.type === "group"){
          const objects = activeObject._objects;
          activeObject._restoreObjectsState()
          allObjects = allObjects.concat(objects)
        } else {
          allObjects.push(activeObject)
        }
      })
      const group = new fabric.Group(allObjects, {originX: 'center', originY: 'center' })
      canvas.add(group)
      canvas.discardActiveObject();
      canvas.setActiveObject(group);
      canvas.renderAll()
    }
  } else {
    // 解组
    const activeObject: any = canvas.getActiveObject();
    if(activeObject && activeObject.type === "group"){
      const items = activeObject._objects;
      activeObject._restoreObjectsState()
      canvas.remove(activeObject);
      for(var i = 0; i < items.length; i++) {
        canvas.add(items[i]);
      }
      canvas.renderAll();
    }
  }
}

export function deleteObj(canvas: fabric.Canvas) {
  const data = canvas.getActiveObjects();
  data.forEach(i => {
    canvas.remove(i);  // 删除当前选中的对象
  })
  canvas.discardActiveObject();
  canvas.renderAll()
}

export function addRect(canvasData: fabric.Canvas) {
  const rectOptions: fabric.IRectOptions = {
      width: 200, // 宽度
      height: 100, // 高度
      fill: 'transparent',
      stroke: '#000000', // 边框颜色
      strokeWidth: 3,
      originX: 'center', originY: 'center'
      // originX: 'center',
      // originY: 'center'
  };
  // 创建并添加矩形到画布上
  var rectangle: any = new fabric.Rect(rectOptions);
  rectangle.set('id', 'ambientRect')
  canvasData.add(rectangle);
  canvasData.setActiveObject(rectangle)
  canvasData.centerObject(rectangle)
  canvasData.renderAll.bind(canvasData)
}
export function addCircle(canvasData: fabric.Canvas) {
  const myCircle: any = new fabric.Circle({
    radius: 50, fill: 'transparent', strokeWidth: 3, stroke: '#000000',
    originX: 'center', originY: 'center'
  });
  myCircle.set('id', 'ambientCircle')
  canvasData.add(myCircle);
  canvasData.setActiveObject(myCircle)
  canvasData.centerObject(myCircle)
  canvasData.renderAll.bind(canvasData)
}
export function addLine(canvasData: fabric.Canvas, isRow?: boolean) {
  const line: any = new fabric.Line(
    isRow?[100,0 , 200, 0]:[0, 100, 0, 200], 
    { 
      strokeWidth: 3, stroke: '#000000',
      originX: 'center', originY: 'center'
    }
  );
  line.set('id', 'ambientLine')
  canvasData.add(line);
  canvasData.centerObject(line)
  canvasData.setActiveObject(line)
  canvasData.renderAll.bind(canvasData)
}
export function addTriangle(canvasData: fabric.Canvas) {
  // 创建路径对象
  const triangle: any = new fabric.Triangle({
    width: 100,
    height: 90,
    strokeWidth: 3, 
    stroke: '#000000',
    fill: 'transparent',
    originX: 'center', originY: 'center'
  });
  triangle.set('id', 'ambientTriangle')
  canvasData.add(triangle);
  canvasData.centerObject(triangle)
  canvasData.setActiveObject(triangle)
  canvasData.renderAll.bind(canvasData)
}
/**
 * 添加图片
 * @param canvasData 
 * @param imgUrl 
 * @param isAmbientImg 是否氛围图
 */
export function addImg(canvasData: fabric.Canvas, imgUrl: string, isAmbientImg?: boolean) {
  fabric.Image.fromURL(imgUrl, (img: any) => {
    let scale = 1;
    const canvasWidth = canvasData.width || 512
    const canvasHeight = canvasData.height || 512
    const newImageInfo: any = { width: img.width, height: img.height };
    let INIT_IMGSCALE = 0.67

    img.id = isAmbientImg?'ambientImg':'ambientNormalImg'
    if(isAmbientImg) {
      INIT_IMGSCALE = 1
    }
    if(newImageInfo.width >= newImageInfo.height) {
      if(newImageInfo.width > canvasWidth * INIT_IMGSCALE) {
        scale = (canvasWidth * INIT_IMGSCALE) / newImageInfo.width;
      }
    } else {
      if(newImageInfo.height > canvasHeight * INIT_IMGSCALE) {
        scale = (canvasHeight * INIT_IMGSCALE) / newImageInfo.height;
      }
    }
    
    img.scale(scale);

    img.set({ originX: 'center', originY: 'center' })
    canvasData.add(img) // 将图片加入到画布
    canvasData.setActiveObject(img)
    canvasData.centerObject(img)
    canvasData.renderAll.bind(canvasData)
  },{
    crossOrigin: 'anonymous'
  })
}

export function addText(canvasData: fabric.Canvas, text?: string) {
  const iText: any = new fabric.Textbox(text || '输入文本', {
    fontFamily: fontList[0].value,
    fontSize: 32,
    strokeWidth: 1,
    originX: 'center', originY: 'center',
  })
  iText.set('id', 'ambientText')
  canvasData.add(iText)
  canvasData.setActiveObject(iText)
  canvasData.centerObject(iText)
  canvasData.renderAll.bind(canvasData)
}