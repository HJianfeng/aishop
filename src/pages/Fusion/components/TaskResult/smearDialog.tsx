import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import SmearCanvas from '@/components/Smear/smearCanvas'
import { useDispatch } from 'react-redux'
import { setSmearDialog } from '@/store/toolSlice'


const SmearDialog = (props: any, ref: any) => {
  const [isOpen, setiIsOpen] = useState(false);
  const [isSmear, setiIsSmear] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [taskId, setTaskId] = useState<any>(null);
  const [taskData, setTaskData] = useState<any>(null);
  const [canvasSize, setCanvasSize] = useState<any>({width: 400, height: 400});
  const SmearCanvasRef = useRef<any>(null);
  
  const dispatch = useDispatch()

  function openDialog(item:any, taskId: string, taskData: any, width?: number, height?: number) {
    if(width && height) {
      setCanvasSize({width, height})
    }
    
    setTaskData(taskData)
    setTaskId(taskId)
    setItem(JSON.parse(JSON.stringify(item)))
    setiIsOpen(true)
    setiIsSmear(false)
    dispatch(setSmearDialog(true))
  }
  function closeDialog() {
    Modal.confirm({
      title: '提示',
      content: '关闭正在编辑的任务？',
      okText: '确定',
      centered: true,
      cancelText: '取消',
      onOk() {
        setItem(null)
        setTimeout(() => {
          setiIsOpen(false)
          dispatch(setSmearDialog(false))
        })
      },
      onCancel() {},
    })
  }

  function afterSmear(img: string) {
    setiIsSmear(true)
    item.img = img
    setItem(item)
    setTimeout(() => {
      resetCanvas()
    })
  }
  function resetCanvas() {
    SmearCanvasRef.current?.resetCanvas()
  }
  useImperativeHandle(ref, ()=> ({
    openDialog
  }))
  const sideBarHtml: HTMLElement | false  = document.getElementById('side-bar') || false
  return (
     <Modal
      getContainer={sideBarHtml}
      closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
      width={'auto'} okText="确定" footer={null}
      cancelText="取消" centered open={isOpen} onCancel={closeDialog}>
        {/* <div className='border-b border-[#D3D3D3] pb-[11px] mb-[14px] font-semibold text-[#3D3D3D] text-[22px]'>涂抹消除</div>
        <div className='text-[#ACACAC] text-[16px] mb-[25px]'>擦除图像中不需要或多余的物，只需要在图片中涂一涂</div> */}
          {
            item && isOpen?
              <SmearCanvas
              ref={SmearCanvasRef}
              item={item}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
              afterSmear={afterSmear}
              isSmear={isSmear}
              styleMode={1}
              taskId={taskId}
              taskData={taskData}
              imgUrl={item.img} />
            :<div  style={{width: `${canvasSize.width}px`, height: `${canvasSize.height}px`}}></div>
          }
    </Modal>
  )
}

export default forwardRef(SmearDialog);