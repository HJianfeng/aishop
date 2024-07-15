import { templateList } from '@/service'
import { Empty } from 'antd'
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Scrollbars } from 'rc-scrollbars';
import { throttle } from '@/utils';
import removeIcon from '@/assets/remove.png'

interface IProps {
  canvas: fabric.Canvas | null
  canvasClass: any
}
function AmbientImgList({ canvas, canvasClass }: IProps, ref: any) {
  const [curUseId, setCurUseId] = useState<number|null>(null);
  const [page_index, setPage] = useState<number>(1);
  const [page_size] = useState<number>(24);
  const [listTotal, setTotal] = useState<number>(24);
  const [flag, setFlag] = useState(false);
  const [imgList, setImgList] = useState<any>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getList()
  }, [])
  useEffect(() => {
    if(page_index > 1 && flag) {
      getList()
    }
  }, [page_index, flag])

  function getList() {
    const data = {
      page_index: page_index.toString(),
      page_size: page_size.toString(),
      t_type: '氛围图',
    }
    setLoading(true)
    templateList(data).then(res => {
      if(page_index === 1) {
        setImgList(res.items);
      } else {
        setImgList((val: any[]) => {
          const result = val.concat(res.items)
          return result
        })
      }
      setTotal(res.total)
      setLoading(false);
      setFlag(false)
    }).catch(() => {
      setLoading(false);
      setFlag(false)
    })
  }
  async function handleScroll(e:any) {
    const container = e.srcElement;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if ((scrollHeight - 50) <= (scrollTop  + clientHeight) && !flag && imgList.length < listTotal) {
      setFlag(true)
      setPage((val: number) => val + 1)
    }
  }
  function setAmbient(item: any) {
    setCurUseId(item?.id || null)
    canvasClass.useAmbientId = item?.id || null
    addImg(canvas, item)
  }
  useImperativeHandle(ref, () => ({
    setAmbient
  }))
  return (
    <div className='flex-1 h-0'>
      {
        imgList && imgList.length?
        <Scrollbars onScroll={throttle(handleScroll)} renderTrackHorizontal={({ style, ...props }) => (
            <div {...props} style={{ ...style, right: '-10px' }} />
          )}
            className='pr-[10px] h-full overflow-x-hidden'>
            <div className='flex flex-wrap'>
              <div onClick={() => {setAmbient(null)}} 
                className={`${!canvasClass.useAmbientId?'border-primary':'border-transparent'}  rounded-[4px] border-[3px] mr-[8px] mb-[8px] w-[90px] h-[90px] p-[2px] cursor-pointer`}>
                <div className='border-[#D7D7D7] border rounded-[4px]  w-full h-full flex flex-col items-center justify-center'>
                  <img src={removeIcon} className='w-[30px] h-[30px] object-cover' alt="" />
                  <div className='text-[16px] mt-[8px] text-[#5D5D5D]'>无</div>
                </div>
              </div>
              {
                imgList.map((item: any) => (
                  <div 
                    key={item.id} onClick={() => {setAmbient(item)}} 
                    className={`${canvasClass.useAmbientId  === item.id?'border-primary':'border-transparent'}
                     rounded-[4px] border-[3px] mr-[8px] mb-[8px] w-[90px] h-[90px] p-[2px] cursor-pointer`}>
                    <div className='border-[#D7D7D7] border rounded-[4px]'>
                      <img src={item.img_url} className='w-full h-full object-cover' alt="" />
                    </div>
                  </div>
                ))
              }
            </div>
         </Scrollbars>
        : 
        <Empty className='mt-[60px]'  description={<div className='text-[#9C9C9C] text-[16px]'>还没有数据</div>} />
      }
    </div>
  )
}

function addImg(canvas: fabric.Canvas | null, item: any) {
  if(!canvas) {
    return;
  }
  const objects = canvas.getObjects().filter((i: any) => {
    return (!i.id || i.id.indexOf('ambient') < 0) && i.type !== 'group'
  })
  
  if(item?.t_config) {
    canvas.loadFromJSON(item.t_config, canvas.renderAll.bind(canvas));
    objects.forEach((i:fabric.Object) => {
      canvas.add(i)
    })
    canvas.renderAll.bind(canvas)
  } else {
    const objs = canvas.getObjects()
    objs.forEach((i:any) => {
      if(i?.id?.indexOf('ambient') >= 0 || i?.type === 'group') canvas.remove(i)
    })
  }
}
export default forwardRef(AmbientImgList)