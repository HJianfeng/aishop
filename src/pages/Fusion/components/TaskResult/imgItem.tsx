import { useRef, useState } from 'react'
import { Spin, Image, Button, message, Modal } from 'antd'
import { taskDetailDelete, taskDevDetailDelete, upscale, taskDetailLike } from '@/service';
import { LoadingOutlined, ZoomInOutlined, DownloadOutlined, CloseCircleFilled } from '@ant-design/icons';
import deleteIcon from '@/assets/delete.png'
import smear_img from '@/assets/smear_img.png'
import likeIcon from '@/assets/like.png'
import likeActiveIcon from '@/assets/like_active.png'
import notlikeActiveIcon from '@/assets/notlike_active.png'
import notlikeIcon from '@/assets/notlike.png'
import { onDownloadImg } from '@/utils'
import ImgInfo from './ImgInfo'

interface Props {
  item: any
  taskData: any
  getList: any
  setImgList: any
  toSmear: any
  createLoading: boolean
  isDevMode?: boolean
  isTemplate?: boolean
}
const ImgItem = ({item, taskData, getList, setImgList, toSmear, createLoading, isDevMode,isTemplate}: Props) => {
  const [showMaskModal, setShowMaskModal] = useState<any>({});
  const [loadImgLoading, setLoadImgLoading] = useState<any>({});
  const [progess, setProgess] = useState(0);
  const [imgvisible, setImgvisible] = useState(false);
  const imgInfoRef:any = useRef()
  

  const maskRender: any = (item: any) => {
    return (
      <div className='w-full h-full relative rounded-[5px]' onClick={() => {setImgvisible(true)}} key={item.id}>
        <div className='absolute left-1/2 top-1/2 m-[-10px]'><ZoomInOutlined className='text-[20px]' /></div>
        {
          !isDevMode && !isTemplate?
            <div className='group absolute w-[70px] h-[70px] right-[0px] top-[0px]'>
              <div onClick={(e) =>{e.stopPropagation();}}  className='absolute right-[10px] top-[10px]'>
                {/* 操作 */}
                <div className='hidden group-hover:flex w-[19px] h-[45px] rounded-full items-center flex-col justify-center bg-black/[0.8]'>
                  <div onClick={() => toLike(item, true)} className='w-[12px] mb-[12px]'><img src={item.favorite === 1?likeActiveIcon:likeIcon} alt="" /></div>
                  <div onClick={() => toLike(item, false)} className='w-[12px]'><img src={item.favorite === 2?notlikeActiveIcon:notlikeIcon} alt="" /></div>
                </div>
                {
                  item.favorite?
                  <div className='group-hover:hidden w-[19px] flex justify-center mt-[6px]'>
                    <img className='w-[12px]' src={item.favorite === 2?notlikeActiveIcon:likeActiveIcon} alt="" />
                  </div>
                  :
                  <div className='group-hover:hidden w-[19px] flex justify-center mt-[6px]'>
                    <img className='w-[12px]' src={likeIcon} alt="" />
                  </div>
                }
              </div>
            </div>
          : null
        }
        <div className='text-white text-[12px] absolute left-[10px] top-[12px]'>{item.img_info}</div>
        <div onClick={(e) =>{e.stopPropagation();}} className='absolute bottom-0 w-full h-[28px] px-[11px] flex justify-between'>
          <div className='flex'>
            {/* INF */}
            {
              isDevMode?
              <div onClick={(e) =>{imgInfoRef.current.openDialog()}} className='hover:bg-primary text-white flex items-center justify-center px-[5px] h-[21px] rounded-[5px] bg-black bg-opacity-80'>
                INF
              </div>: 
              !isTemplate?
                <div className='flex'>
                  <div onClick={() => {switchMask(item, 'hd')}} className='hover:bg-primary flex mr-[4px] items-center justify-center w-[21px] h-[21px] rounded-[5px] bg-black bg-opacity-80'>
                    <div className='scale-90 text-[12px]'>HD</div>
                  </div>
                  <div onClick={(e) =>{toSmear(item)}} className='hover:bg-primary flex items-center mr-[4px] justify-center w-[35px] h-[21px] rounded-[5px] bg-black bg-opacity-80'>
                    {/* <img className='w-[12px]' src={smear_img} alt="" /> */}
                    <div className='text-[12px]'>编辑</div>
                  </div>
                </div>
              : null
            }
          </div>

          <div className='flex' >
            {/* 下载 */}
            <div onClick={() => {downloadImg(item)}} className='hover:bg-primary flex mr-[4px] items-center justify-center w-[21px] h-[21px] rounded-[5px] bg-black bg-opacity-80'>
              <DownloadOutlined className="text-[12px]" />
            </div>
            {/* 删除 */}
            <div onClick={() => {
              if(!isTemplate) {
                switchMask(item, 'delete')
              } else {
                deleteItem(item)
              }
            }} className='hover:bg-primary flex items-center justify-center w-[21px] h-[21px] rounded-[5px] bg-black bg-opacity-80'>
              <img className='w-[12px]' src={deleteIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
 
  const maskConfirm:any = ({label, onCancel, onOk, summary, type}:{type: string, label: string, summary?:string, onCancel: () => void, onOk: () => void}) => {
    return (
      <div className='absolute z-50 left-0 top-0 w-full h-full bg-black bg-opacity-80' onClick={(e) =>{e.stopPropagation();}} >
        <div className='text-white text-center text-[16px] mt-[39px]'>{label}</div>
        {
          summary?
          <div className='text-[#787878] text-center text-[12px] mt-[8px]'>{summary}</div>
          :null
        }
        <div className='flex justify-center absolute bottom-[50px] w-full'>
          <Button onClick={onCancel} className='mr-[34px]'>取消</Button>
          <Button onClick={onOk} type='primary'>确定</Button>
        </div>
      </div>
    )
  }
  async function toLike(item:any, isLike:boolean) {
    const data:any = {
      id: item.id
    }
    if(isLike) {
      if(item.favorite === 1) {
        data.favorite = 'cancel'
      } else {
        data.favorite = 'true'
      }
    } else {
      if(item.favorite === 2) {
        data.favorite = 'cancel'
      } else {
        data.favorite = 'false'
      }
    }
    
    try {
      await taskDetailLike(data)
      setImgList((val: any) => {
        const cloneData = JSON.parse(JSON.stringify(val))
        cloneData.forEach((item: any) => {
          if(item.id === data.id) {
            if(data.favorite === 'cancel') {
              item.favorite = 0
            } else if(data.favorite === 'true') {
              item.favorite = 1
            } else if(data.favorite === 'false') {
              item.favorite = 2
            }
          }
        })
          
        return cloneData
      })
    } catch (error) {
      
    }
  }
  function deleteItem(item: any) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该图片吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const detailApi = isDevMode?taskDevDetailDelete:taskDetailDelete
        detailApi({ task_detail_id: item.id }).then(res => {
          if(taskData) getList({ task_id: taskData.id, reset: true });
          switchMask(item)
          message.success('删除成功')
        }).catch((error) => {
          message.error(error?.message || '服务异常')
        })
      },
      onCancel() {},
    })
  }
  function switchMask(item: any, type?: string) {
    if(createLoading) {
      message.warning('其他图片在处理中，请稍后')
      return;
    }
    if(showMaskModal[item.id] || !type) {
      const temp:any = {...setShowMaskModal}
      delete temp[item.id]
      setShowMaskModal(temp)
    } else {
      const maskData: any = {};
      let data: any = {
        item,
        type,
        onCancel: () => { switchMask(item) },
      }
      if(type === 'hd') {
        data = {
          ...data,
          label: '高清图片',
          summary: '高清图细节更加丰富',
          onOk: () => {
            onHdImgCreate(item)
          },
        }
      } else if(type === 'delete'){
        data = {
          ...data,
          label: '确定要删除该图片吗', 
          onOk: () => {
            const detailApi = isDevMode?taskDevDetailDelete:taskDetailDelete
            detailApi({ task_detail_id: item.id }).then(res => {
              if(taskData) getList({ task_id: taskData.id, reset: true });
              switchMask(item)
              message.success('删除成功')
            }).catch((error) => {
              message.error(error?.message || '服务异常')
            })
          },
        }
      }
      
      maskData[item.id] = data || true;
      setShowMaskModal(maskData)
    }
  }

  function downloadImg(item:any) {
    onHdImgCreate(item, true)
    // const downData: any = {
    //   url: item.img,
    //   task_id: taskData.id,
    //   task_detail_id: item.id
    // }
    // if(taskData.is_demo) {
    //   downData.is_demo = "true"
    // }
    // if(!isDevMode) {
    //   toDownload(downData)
    // }
    // onDownloadImg(item.img, {
    //   imgName: item.style_name
    // })
  }

  // hd 图片生成
  const onHdImgCreate = (item: any, isDownload?: boolean) => {
    loadImgLoading[item.id] = true
    const data = { ...loadImgLoading }
    setLoadImgLoading(() => {
      data[item.id] = true
      return data
    });
    setProgess(0)
    handleProgess()

    
    const params: any = {
      task_id: taskData.id,
      task_detail_id: item.id,
      upscale: isDownload?"2":"4"
    }
    if(taskData.is_demo) {
      params.is_demo = "true"
    }
    const prefix = 'aisoup'
    const imgKey = item.img.split(`/${prefix}/`)[1]
    params.img_file = `${prefix}/${imgKey}`
    upscale(params).then((res: any) => {
      switchMask(item)
      if(!isDownload) message.success('高清开始下载')

      onDownloadImg(res.img, {
        imgName: item.style_name
      })
    }).catch((error) => {
      message.error(error?.message || '服务异常');
    }).finally(() => {
      setProgess(100)
      if(timer) clearTimeout(timer)
      setTimeout(() => {
        delete loadImgLoading[item.id]
        setLoadImgLoading(loadImgLoading);
      }, 500)
    })
  }

  let timer: any = null;
  const handleProgess = () => {
    timer = setTimeout(() => {
      setProgess((data) => {
        if (data >= 98) {
          if(timer) clearTimeout(timer)
          return 98;
        } else {
          handleProgess();
        }
        return data + 2;
      });
    }, 800);
  }

 
  return (
    <div className='relative flex'>
      {
        loadImgLoading && loadImgLoading[item.id]?
        <div className='absolute left-0 z-50 top-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center'>
          <Spin indicator={<LoadingOutlined style={{margin: '-15px',color: '#fff', fontSize: 30 }} />} />
          <div className='mt-[40px] text-white'>处理中...{progess?progess+'%': ''}</div>
        </div>
        : 
        showMaskModal[item.id]?maskConfirm(showMaskModal[item.id]):null
      }
      <Image
        width={'100%'}
        src={item.tbn_img} 
        style={{borderRadius: '5px'}}
        preview={{
          visible: imgvisible,
          closeIcon:null,
          src: item.img,
          mask: maskRender(item),
          toolbarRender: () => null,
          onVisibleChange: (val) => {if(!val) setImgvisible(false)},
          imageRender: () => (
            <div onContextMenu={(e)=>  {e.preventDefault(); return false;}} className='relative '>
              <img src={item.img} alt="" />
              <CloseCircleFilled onClick={() => setImgvisible(false)} className='absolute cursor-pointer right-[-14px] top-[-14px] text-black text-[26px] bg-white rounded-full' />
            </div>
          )
        }}/>
        {
          isDevMode?
          <ImgInfo imgInfoData={item.img_info} ref={imgInfoRef} />
          :null
        }
    </div>
  )
}

export default ImgItem