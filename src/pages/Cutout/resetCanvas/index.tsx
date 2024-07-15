import { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react'
import { CloseCircleFilled,DownOutlined } from '@ant-design/icons'
import { Modal,Dropdown, ColorPicker, Button, message } from 'antd'
import type { MenuProps } from 'antd';
import BgIcon from '@/assets/bg.jpeg'
import transparencyIcon from '@/assets/transparency.png'
import ColorIcon from '@/assets/smear/color.png'
import { cutoutmerge } from '@/service'
import { onDownloadImg } from '@/utils'
import { fabric } from 'fabric';

const ResetCanvas = (props: any, ref: any) => {
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [bgColor, setColor] = useState('#ffffff');
  const [canvasContext, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasImg, setCanvasImg] = useState<any>(null);
  const [currentSize, setSize] = useState('512 x 512');

 
  const sizeList = [
    { key: '512 x 512', label: renderLabel('512 x 512') },
    { key: '600 x 800', label: renderLabel('600 x 800') },
  ]
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    setSize(key)
    
  };
  function renderLabel(str: string) {
    return (
      <div className='whitespace-nowrap text-center cursor-pointer'>{str}</div>
    )
  }
  function openDialog(url: string) {
    setImgUrl(url)
    setOpen(true);
  }
  useEffect(() => {
    try {
      canvasContext?.setWidth(Number(sizeData.width))
      canvasContext?.setHeight(Number(sizeData.height))

      if(canvasContext) {
        if(canvasImg?.width && canvasImg?.height && (canvasImg.width >= (sizeData.width * 0.6) || canvasImg.height >= (sizeData.height * 0.6))) {
          canvasImg.scale((sizeData.width * 0.6)/canvasImg.width);
        }
        canvasContext.centerObject(canvasImg)
      }
      canvasContext?.renderAll()
    } catch (error) {
    }
  }, [currentSize])
  const sizeData = useMemo(() => {
    if(!currentSize) {
      return {
        width: 512,
        height: 512,
        originWidth: 512,
        originHeight: 512
      }
    }
    try {
      const arr  = currentSize.split('x')
      let width = Number(arr[0])
      let height = Number(arr[1])
      const rate =width/height
      if(width > 512 || height > 512) {
        if(width >= height) {
          width = 512
          height = width / rate
        } else {
          height = 512
          width = height * rate
        }
      }
      
      return {
        width,
        height,
        originWidth: Number(arr[0]),
        originHeight: Number(arr[1])
      }
    } catch (error) {
      return {
        width: 512,
        height: 512,
        originWidth: 512,
        originHeight: 512
      }
    }
  }, [currentSize])
 
  useImperativeHandle(ref, () => {
    return { openDialog }
  })
  function handleDownload() {
    const left = parseInt(canvasImg.left)
    const top = parseInt(canvasImg.top)
    const width = parseInt(canvasImg.width * canvasImg.scaleX + '')
    const height = parseInt(canvasImg.height * canvasImg.scaleY + '')
    let bg_color = (!bgColor || bgColor === 'transparent') ? '#-1' : bgColor
    const data =  {
      "img_url": imgUrl, //抠图后的地址
      "bg_color": bg_color,
      "canvas":`${sizeData?.originWidth},${sizeData?.originHeight}`, //原来的画布大小
      "origin_canvas":`${canvasContext?.width},${canvasContext?.height}`, //等比例压缩后的画布大小
      "img_coord":`${left},${top}`, //产品图位置
      "img_size":`${width},${height}`,//产品图宽高
    }
    setLoading(true)
    cutoutmerge(data).then((res) => {
      setLoading(false)
      dowmloadImg(res)
    }).catch((error) => {
      message.error(error.message || '图片上传失败');
      setLoading(false)
    })
  }


  function dowmloadImg(url: string) {
		onDownloadImg(url)
	}
  function closeDialog() {
    setOpen(false);
    setImgUrl('')
    setSize('512 x 512')
    setColor('#ffffff')
    try {
      if(canvasContext?.dispose) {
        canvasContext?.dispose()
        setCanvas(null)
      }  
    } catch (error) {
      
    }
  }
  useEffect(() => {
    if(imgUrl && sizeData) {
      fabric.Object.prototype.transparentCorners = false
      fabric.Object.prototype.borderColor = '#5C7AFF'
      fabric.Object.prototype.cornerColor = '#5C7AFF'
      fabric.Object.prototype.borderScaleFactor = 2.4
      fabric.Object.prototype.cornerStyle = 'circle'
      fabric.Object.prototype.cornerStrokeColor = '#5C7AFF'
      fabric.Object.prototype.borderOpacityWhenMoving = 1
      fabric.Object.prototype.cornerSize = 12

      const canvas: fabric.Canvas = new fabric.Canvas('cutout-canvas', {
        selection: true,
        width: sizeData.width,
        height: sizeData.height
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
      setCanvas(canvas)
      fabric.Image.fromURL(imgUrl, (img: any) => {
        setCanvasImg(img)
        if(img?.width && img?.height && (img.width >= (512 * 0.6) || img.height >= (512 * 0.6))) {
          img.scale((512 * 0.6)/img.width);
        }
        canvas.centerObject(img)
        canvas.add(img) // 将图片加入到画布
        canvas.setActiveObject(img)
      }, { lockRotation: true, lockScalingFlip: true, lockSkewingX: true, lockSkewingY: true })
    }
  }, [imgUrl])
 
  return (
  <Modal 
    width={'auto'}
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    okText="确定" footer={null} maskClosable={false} 
    cancelText="取消" centered open={isOpen} onCancel={() => closeDialog()}>
    <div className='mb-[4px]'>
      <div className='mb-[10px] flex items-center'>
        <div className='mr-[10px]'>
          <Dropdown arrow={{pointAtCenter: true}} placement="bottom" trigger={['click']} 
              menu={{ items: sizeList, onClick: onMenuClick }}>
            <div className='text-[#ACACAC] cursor-pointer text-[14px] font-medium' onClick={(e) => e.preventDefault()}>
              {currentSize}
              <DownOutlined className='ml-[5px] text-[13px]  font-bold' />
            </div>
          </Dropdown>
        </div>
        <div onClick={() => {setColor('')}} className={`mr-[10px] overflow-hidden w-[28px] h-[28px] hover:border-primary rounded-[4px] cursor-pointer border-2 ${!bgColor?'border-primary':'border-[#eee]'}`} 
          >
          <img src={transparencyIcon} alt="" />
        </div>
        <div onClick={() => {setColor('#ffffff')}} className={`mr-[10px] w-[28px] h-[28px] hover:border-primary hover:border-2 rounded-[4px] cursor-pointer border bg-white ${bgColor === '#ffffff'?'border-primary border-2':'border-[#eee]'}`}></div>
        <ColorPicker value={bgColor} disabledAlpha format='hex' onChange={(e: any) => {setColor(e.toHexString())}}>
          <div 
            className='rounded-full cursor-pointer w-[24px] h-[24px]' 
            >
              <img src={ColorIcon} alt="" />
          </div>
        </ColorPicker>
        <div className='flex-1'></div>
        <Button loading={loading} onClick={handleDownload} type='primary'>下载</Button>
      </div>
      <div className='rounded-[5px] border border-[#F2F2F2]' style={{
          width: `${sizeData.width}px`,
          height: `${sizeData.height}px`,
          background:(!bgColor || bgColor === 'transprent')?`url(${BgIcon}) repeat`:bgColor
        }}>
          {
            isOpen?
            <canvas id="cutout-canvas"></canvas>
            :null
          }
      </div>
    </div>
  </Modal>
  )
}

export default forwardRef(ResetCanvas)