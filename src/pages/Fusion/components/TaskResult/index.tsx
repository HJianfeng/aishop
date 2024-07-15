/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useMemo } from 'react'
import { Spin, Empty, Row, Col, message, Dropdown, Alert } from 'antd'
import { useLocation } from "react-router-dom";
import { getImgListInner, getImgList } from '@/service';
import { throttle } from '@/utils';
import { LoadingOutlined, DownOutlined } from '@ant-design/icons';
import emptyIcon from '@/assets/empty.png';
import NullIcon from '@/assets/empty.jpg';
import { ISelectItem } from '@/interface'
import { Scrollbars } from 'rc-scrollbars';
import style from '../../style.module.scss'
import ImgItem from './imgItem';
import SmearDialog from './smearDialog'
import { fabric } from 'fabric';

interface IProps {
  taskData?: ISelectItem | null // 当前选中的任务
  switchAllImg: (id?: any) => void
  isTemplate?: boolean
}
const TaskResult = ({ taskData,switchAllImg,isTemplate }: IProps) => {
  const pathname = useLocation().pathname
  const isDevMode = useMemo(() => {
    return pathname === '/model'
  }, [pathname])
  const api = isDevMode ? getImgListInner : getImgList

  const [isCreateAfter, setIsCreateAfter] = useState(false);
  const [currentSize, setCurrentSize] = useState('800 x 800');
  const [createLoading, setCreateLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [imgList, setImgList] = useState<any>([]);
  const [page_index, setPage] = useState<any>(1);
  const [page_size] = useState<any>(24);
  const [imgTotal, setTotal] = useState<any>(24);
  const smearDialogRef: any = useRef()
  const [progess, setProgess] = useState(0);
  

  const getList = (params: { task_id: string, reset?:boolean }) => {
    let page = page_index;
    if(params?.reset) {
      setPage(1)
      page = 1;
    }
    const data = {
      task_id: params.task_id.toString(),
      page_index: page.toString(),
      page_size: page_size.toString(),
    }
    api(data).then(res => {
      if(page === 1) {
        setImgList(res.items);
      } else {
        setImgList((val: any[]) => {
          const result = val.concat(res.items)
          return result
        })
      }
      setTotal(res.total)
      setCreateLoading(false);
      setFlag(false)
    }).catch(() => {
      setCreateLoading(false);
      setFlag(false)
    })
  }
 async function handleScroll(e:any) {
    if(!taskData) return;
    const container = e.srcElement;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if ((scrollHeight - 50) <= (scrollTop  + clientHeight) && !flag && imgList.length < imgTotal) {
      setFlag(true)
      setPage((val: number) => val + 1)
      
      // getList({task_id: taskData.id})
    }
  }

  useEffect(() => {
    if(taskData && page_index > 1 && flag) {
      getList({task_id: taskData.id})
    }
  }, [page_index, flag])
  useEffect(() => {
    return () => {
      setIsCreateAfter(false)
    }
  }, [])
  useEffect(() => {
    taskData && getList({ task_id: taskData.id, reset: true })
  }, [taskData])
  useEffect(() => {
    PubSub.subscribe('setLoading', (name, time?: number) => {
      setCreateLoading(true);
      setIsCreateAfter(false)
      setProgess(0)
      const steps = time?(100 / (time * 1000)) * 300: 2
      handleProgess(steps)
    })
    
    PubSub.subscribe('cancelSetLoading', () => {
      setCreateLoading(false);
      setProgess(100)
    })
    PubSub.subscribe('updateImgResultList', (name, params) => {
      console.log(name, params);
      setIsCreateAfter(true)
      getList(params);
    })
  }, [])
  let timer: any = null;
  const handleProgess = (steps?: number) => {
    timer = setTimeout(() => {
      setProgess((data) => {
        if (data >= 98) {
          if(timer) clearTimeout(timer)
          return 98;
        } else {
          handleProgess();
        }
        return data + (steps || 2);
      });
    }, 1000);
  }
  const toSmear = (item:any)=> {
    if(createLoading) {
      message.warning('其他图片在处理中，请稍后')
      return;
    }
    getOriginImg(item.img, ({width, height}: any) => {
      smearDialogRef.current.openDialog(item, taskData?.id, taskData, width, height)
    })
  }
  function getOriginImg(img: string, callback: Function) {
    fabric.Image.fromURL(img, (imgInfo: any) => {
      const width = imgInfo.width
      const height = imgInfo.height
      callback({width, height})
    })
  }
  function renderLoading() {
    return (
      [1,2,3,4].map((i:any) => (
        <Col key={i} span={12}  className='mb-[10px]'>
          <div className='bg-[#F5F5F5] rounded-[5px] relative h-full w-full flex flex-col justify-center items-center'>
            <div className='absolute h-full w-full flex flex-col justify-center items-center'>
              <Spin  indicator={<LoadingOutlined  style={{margin: '-25px',color: '#D3D3D3', fontSize: 50 }} spin />} />
              <div className='mt-[40px]'>拼命处理中…{ progess ? progess >= 98 ? 98 : Math.round(progess)+'%' :''}</div>
            </div>
            <img className='w-full invisible' src={NullIcon} alt="" />
          </div>
        </Col>
      )
      )
    )
  }
  const sizeList = [
    { key: '800 x 800', label: (
      <div className='whitespace-nowrap cursor-auto text-center'>800 x 800</div>
    ), }
  ];
  const onMenuClick: any= ({ key }: any) => {
    setCurrentSize(key)
  };
  return (
    <div className='flex flex-col w-full h-full relative'>
      {
        !isTemplate && (imgList?.length || createLoading)?
        <>
        <div className='border-dashed pb-[5px] mr-[12px] border-[#D3D3D3] border-b text-[#0E0E0E] font-semibold flex items-center text-[16px] mb-[12px]'>
          <span className='mr-[21px]'>生产结果</span>
          <Dropdown className='' arrow={{pointAtCenter: true}} placement="bottom" trigger={['click']} menu={{ items: sizeList, onClick: onMenuClick }}>
            <div className='text-[#ACACAC] cursor-pointer text-[14px] font-medium' onClick={(e) => e.preventDefault()}>
              {currentSize}
              <DownOutlined className='ml-[5px] text-[13px]  font-bold' />
            </div>
          </Dropdown>
          <div className='flex-1'></div>
          <div onClick={() => {switchAllImg(taskData?.id)}} className='text-[#ACACAC] text-[14px] cursor-pointer font-medium'>展开全部</div>
        </div>
        <div className='mb-[10px] pr-[12px]'>
          {
            !isDevMode && isCreateAfter && imgList && imgList.length?
              <Alert message="一起让AI更聪明，哪张不错，点击图片上的小爱心吧" type="warning" showIcon closable />
            : null
          }
        </div>
        </>:null
      }
        
      {
        imgList && imgList.length?
        <Scrollbars onScroll={throttle(handleScroll)} renderTrackHorizontal={({ style, ...props }) => (
            <div {...props} style={{ ...style, right: '-10px' }} />
          )}
            className='pr-[10px] overflow-x-hidden'>
            <div className='pr-[12px] '>
              <Row gutter={10} className={style.imgMask}>
                {
                  createLoading? renderLoading() : null
                }
                {
                  imgList.map((item: any) => (
                    <Col span={12} key={item.id} className='mb-[10px]'>
                      {/* <Image src={item.tbn_img} alt='' /> */}
                      <div><ImgItem isTemplate={isTemplate} createLoading={createLoading} isDevMode={isDevMode} item={item} toSmear={toSmear} taskData={taskData} getList={getList} setImgList={setImgList} /></div>
                    </Col>
                  ))
                }
              </Row>
            </div>
        </Scrollbars>
        : createLoading? 
              <Row gutter={10} className={style.imgMask}>
                {
                  renderLoading()
                }
                </Row>:
        <Empty 
          className='mt-[260px]'
          image={<div className='w-full flex justify-center'><img className='w-[100px]' src={emptyIcon} alt="" /></div>}
          description={<div className='text-[#9C9C9C] text-[16px]'>还没有融合记录</div>} />
      }
      <SmearDialog ref={smearDialogRef} />
    </div>
  )
}

export default TaskResult;