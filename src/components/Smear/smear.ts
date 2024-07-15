import { fabric } from 'fabric'
import { SetTextOptions, fontList } from './helper'
import FontFaceObserver from 'fontfaceobserver'
import { debounce } from '@/utils'

interface SmearOptions {
  canvasWidth: number
  canvasHeight: number
  setCanvasStateIndex: any
  setCanvasTextStateIndex: any
  drawingBrushColor?: string
  drawingBrushShadowColor?: string
  drawingLineWidth?: number
  drawingShadowWidth?: number
  imgUrl?:string
  canvasMaskRef?: any
  cursorRef: any
  pathCreated: () => void
  /**
   * 文字区域
   */
  canvasTextRef: any
  handleSelectText: (data: fabric.Object | null) => void
}
export default class Smear {
  canvas: fabric.Canvas
  canvasImg: fabric.Canvas
  canvasText: fabric.Canvas
  options: SmearOptions

  canvasState: any[]
  isLoadCanvas: boolean
  stateIndex: number

  canvasTextState: any[]
  isLoadCanvasText: boolean
  canvasTextStateIndex: number


  bgImgCache: any
  cacheFont: string[]
  canavsElement: HTMLCanvasElement
  useAmbientId: number | null
  

  constructor(canavsElement: HTMLCanvasElement, options: SmearOptions) {
    this.canavsElement = canavsElement;
    this.useAmbientId = null
    this.options = options;
    this.cacheFont = []
    this.preLoadFont()
    options.drawingBrushColor = 'rgba(104,132,255,0.8)'
    this.bgImgCache = null;
    const canvas = new fabric.Canvas(canavsElement, {
      width: options.canvasWidth,
      height: options.canvasHeight,
      isDrawingMode: true
    });
    canvas.freeDrawingCursor = 'none'
    const cursorTarget = this.options.cursorRef;
    canvas.on("mouse:out", (e: any) => {
      cursorTarget.style.display = 'none'
     })
    canvas.on("mouse:over", (e: any) => {
    cursorTarget.style.display = 'block'
    })
    canvas.on("mouse:move", (e: any) => {
      const z = canvas.getZoom()
      const drawingLineWidth = options.drawingLineWidth || 35;
      const mouseY = e.e.offsetY;
      const mouseX = e.e.offsetX;
      cursorTarget.style.left = `${mouseX - drawingLineWidth / 2}px`;
      cursorTarget.style.top = `${mouseY - drawingLineWidth /2 }px`;
      cursorTarget.style.width = `${drawingLineWidth}px`;
      cursorTarget.style.height = `${drawingLineWidth}px`;
      cursorTarget.style.transform = `scale(${z})`
      
    })
    canvas.on("path:created", (e: any) => {
      options.pathCreated?.()
    })
    this.canvas = canvas;
    this.canvasImg = this.addMainCanvas()
    this.canvasText = this.addTextCanvas()

    fabric.Object.prototype.transparentCorners = false;
    this.setFreeDrawingBrush()
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = options.drawingBrushColor || '#000000';
      canvas.freeDrawingBrush.width = options.drawingLineWidth || 35;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: options.drawingShadowWidth || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: options.drawingBrushShadowColor || 'transparent',
      });
    }
    this.canvasState = [];
    this.canvasTextState = []
    this.canvas.on("object:modified", () => {this.updateCanvasState()});
    this.canvas.on("object:added", () => {this.updateCanvasState()});
    this.canvasText.on("object:modified", () => {
      this.updateCanvasState(true)
    });
    const updateCanvasState = debounce(() => {
      this.updateCanvasState(true)
      console.log(2);
    }, 500)
    this.canvasText.on("object:added", () => {this.updateCanvasState(true)});
    this.isLoadCanvas = false;
    this.isLoadCanvasText = false
    this.stateIndex = -1;
    this.canvasTextStateIndex = -1
    this.setStateIndex(-1)
  }
  preLoadFont() {
    fontList.forEach(i => {
      this.loadFont(i.value)
    })
  }
  resetCanvas(img: string) {
    this.clear()
    this.canvas.clear()
    this.canvasImg.clear()
    this.bgImgCache = null;
    this.options.imgUrl = img
    this.setBg(this.canvasImg)
  }
  addMainCanvas() {
    const canvasMain = new fabric.Canvas(this.options.canvasMaskRef, {
      width: this.options.canvasWidth,
      height: this.options.canvasHeight,
    });
    this.setBg(canvasMain)
    return canvasMain;
  }
  createCircle() {
    return new fabric.Circle({
      left: 0,
      top: 0,
      radius: 10,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
    })
  }
  setStateIndex(index: number) {
    this.options.setCanvasStateIndex(index)
    this.stateIndex = index;
  }
  setTextStateIndex(index: number) {
    this.options.setCanvasTextStateIndex(index)
    this.canvasTextStateIndex = index;
  }
  setBg(canvas: fabric.Canvas) {
    if(this.bgImgCache) {
      canvas.setBackgroundImage(this.bgImgCache, canvas.renderAll.bind(canvas))
    } else {
      fabric.Image.fromURL(this.options.imgUrl || '', (img: any) => {
        if(img.width > this.options.canvasWidth) {
          img.scale(this.options.canvasWidth / img.width);
        }
        this.bgImgCache = img;
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      }, {crossOrigin: 'anonymous'})
    }
  }
  setFreeDrawingBrush(freeDrawingBrush?: any) {
    try {
      const canvas = this.canvas;
      const options = this.options;
      
      if(freeDrawingBrush) {
        canvas.freeDrawingBrush = freeDrawingBrush;
      } else {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      if (canvas.freeDrawingBrush) {
        var brush = canvas.freeDrawingBrush;
        brush.color = options.drawingBrushColor || '#000';
        brush.width = options.drawingLineWidth || 35;
        brush.shadow = new fabric.Shadow({
            blur: options.drawingShadowWidth || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: options.drawingBrushShadowColor || 'transparent',
        });
      }
    } catch (error) {
      console.log(error);
      console.log(this.canvas);
    }
  }
  setDrawingBrushWidth(val: number) {
    this.options.drawingLineWidth = val;
    this.canvas.freeDrawingBrush.width = val || 1;
  }
  getMaskImg() {
    return new Promise((resolve) => {
      const canvas  = this.canvas;
     
      setTimeout(() => {
        const img = canvas.toDataURL({
          format: 'png'
        });
        const textImg = this.canvasText.toDataURL({
          format: 'png',
          // multiplier: 2
        });
        resolve({img, textImg})
      }, 500)
    })
  }
  setDrawingMode() {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode
  }

  setBrushColor(color: string) {
    this.canvas.freeDrawingBrush.color = color;
  }

  /**
   * 回退到第几步
   */
  backStep() {
    this.isLoadCanvas = true;
    const index = this.stateIndex - 1;
    if(index>=0) {
      const canvas = this.canvas
      this.canvas.loadFromJSON(this.canvasState[index], () => {
        canvas.renderAll.bind(canvas)
        this.setStateIndex(index)
      });
    } else {
      this.clear()
    }
  }
  canvasTextBackStep() {
    this.isLoadCanvasText = true;
    const index = this.canvasTextStateIndex - 1;
    if(index>=0) {
      const canvasText = this.canvasText
      this.canvasText.loadFromJSON(this.canvasTextState[index], () => {
        canvasText.renderAll.bind(canvasText)
        this.setTextStateIndex(index)
      });
    } else {
      this.clear(true)
    }
  }
  clear(isText?: boolean) {
    if(!isText) {
      this.canvas.clear()
      this.setStateIndex(-1)
      this.canvasState = [];
      this.isLoadCanvas = false;
      this.useAmbientId = null
    } else {
      this.canvasText.clear()
      this.setTextStateIndex(-1)
      this.canvasTextState = [];
      this.isLoadCanvasText = false;
    }
  }
  updateCanvasState(isText?: boolean) {
    if(isText) {
      if (!this.isLoadCanvasText) {
        const canvasAsJson = JSON.stringify(this.canvasText.toJSON());
        this.canvasTextState.splice(this.canvasTextStateIndex + 1);
        this.canvasTextState.push(canvasAsJson);
        this.setTextStateIndex(this.canvasTextState.length - 1)
      } else {
        this.isLoadCanvasText = false;
      }
    } else {
      if (!this.isLoadCanvas) {
        const canvasAsJson = JSON.stringify(this.canvas.toJSON());
        this.canvasState.splice(this.stateIndex + 1);
        this.canvasState.push(canvasAsJson);
        this.setStateIndex(this.canvasState.length - 1)
      } else {
        this.isLoadCanvas = false;
      }
    }
  }
  /**
   * 文字
   */
  addTextCanvas() {
    const canvasText = new fabric.Canvas(this.options.canvasTextRef, {
      width: this.options.canvasWidth,
      height: this.options.canvasHeight,
    });
    canvasText.on('selection:created', (e) => {
      if (e?.selected && e?.selected.length > 1) {
        // 禁止多选
        canvasText.discardActiveObject();
      } else if(e?.selected?.length){
        const selectTarget = e.selected[0];
        this.selectText(selectTarget)
      }
    });
    canvasText.on('selection:updated', (e) => {
      if (e?.selected && e?.selected.length > 1) {
        // 禁止多选
        canvasText.discardActiveObject();
      } else if(e?.selected?.length){
        const selectTarget = e.selected[0];
        this.selectText(selectTarget)
      }
    });
    canvasText.on('selection:cleared', (e) => {
      this.options.handleSelectText(null)
    });
    // object:selected' | 'object:added' | 'object:removed'
    return canvasText;
  }
  setTextOptions(options: SetTextOptions) {
    const canvasText = this.canvasText;
    const curText = canvasText.getActiveObject();
    if(curText) {
      curText.set(options)
      canvasText.renderAll()
    }
  }
  setFamily(fontStr: string) {
    const canvasText = this.canvasText;
    const curText = canvasText.getActiveObject();
    if(curText) {
      this.loadFont(fontStr, () => {
        this.setTextOptions({
          fontFamily: fontStr
        })
      })
    }
  }
  /**
   * 置顶
   */
  bringToFront() {
    const canvasText = this.canvasText;
    const curText = canvasText.getActiveObject();
    if(curText) {
      curText.bringToFront()
      canvasText.renderAll()
    }
  }
  removActiveObject() {
    this.canvasText.discardActiveObject().renderAll();
    this.options.handleSelectText(null)
  }
  selectText(selectTarget: fabric.Object) {
    this.canvasText.setActiveObject(selectTarget);
    this.options.handleSelectText(selectTarget)
  }
  loadFont(val: string, callback?: Function) {
    const font = new FontFaceObserver(val)
    if(!this.cacheFont.includes(val)) {
      font.load().then(() => {
        this.cacheFont.push(val)
        if(callback) callback()
      }).catch((err: any) => {
        console.log(err);
      })
    } else {
      if(callback) callback()
    }
  }
  addText(text?: string) {
    const font = fontList[0].value
    this.loadFont(font, () => {
      const iText = new fabric.Textbox(text || '输入文本', {
        fontFamily: font,
        fontSize: 32,
        strokeWidth: 10
      })
      this.canvasText.add(iText)
      this.canvasText.renderAll.bind(this.canvasText)
      this.canvasText.centerObject(iText)
      this.selectText(iText)
    })
  }
  copyText() {
    const canvasText = this.canvasText;
    const curText = canvasText.getActiveObject();
    if(curText) {
      curText.clone((select: any) => {
        select.set({  
          left: select.left + 20, // 调整粘贴后的位置  
          top: select.top + 20  
        });  
        canvasText.add(select)
        this.selectText(select)
      })
    }
  }
  removeText() {
    const curText = this.canvasText.getActiveObject();
    if(curText) {
      this.canvasText.remove(curText)
      this.options.handleSelectText(null)
    }
  }
}


// this.canvas.on("mouse:down", function (e) {
//   that.mousedown(e);
// });
// //鼠标抬起事件
// this.canvas.on("mouse:up", function (e) {
//   that.mouseup(e);
// });
// // 移动画布事件
// this.canvas.on("mouse:move", function (e) {
//   that.mousemove(e);
// });