import { getAllstyle,getImgList } from '@/service'
import { useEffect,useState,useRef } from 'react';
import ImgItem from './TaskResult/imgItem';
import { Scrollbars } from 'rc-scrollbars';
import { throttle } from '@/utils';
import { Spin, Empty, Row, Col, message, Dropdown, Select } from 'antd'
import style from '../style.module.scss'
import { LoadingOutlined, DownOutlined } from '@ant-design/icons';
import emptyIcon from '@/assets/empty.png';
import NullIcon from '@/assets/empty.jpg';
import { fabric } from 'fabric';
import SmearDialog from './TaskResult/smearDialog'
import { ISelectItem } from '@/interface'

interface IProps {
  taskData: ISelectItem // 当前选中的任务
  switchAllImg: (id?: any) => void
}
const AllImg = ({ taskData,switchAllImg }:IProps) => {
  const [styleList, setStyleList] = useState<any>([]);
  const [page_index, setPage] = useState<number>(1);
  const [createLoading, setCreateLoading] = useState(false);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [imgTotal, setTotal] = useState<any>(24);
  const [curStyle, setCurStyle] = useState<any>('');
  const [imgList, setImgList] = useState<any>([]);
  const [flag, setFlag] = useState(false);
  const smearDialogRef: any = useRef()
  const [progess, setProgess] = useState(0);

  useEffect(() => {
    getStyle()
  }, [])
  useEffect(() => {
    getList()
  }, [page_index])

  const getList = (reset?:boolean, styleId?:string) => {
    let page = page_index;
    if(reset) {
      setPage(1)
      page = 1;
    }
    const style_id = styleId !== undefined?styleId:curStyle;
    const data = {
      task_id: taskData.id.toString(),
      page_index: page.toString(),
      page_size: '20',
      style_id: (style_id || 0).toString()
    }
    getImgList(data).then(res => {
      if(page === 1) {
        setImgList(res.items);
      } else {
        setImgList((val: any[]) => {
          const result = val.concat(res.items)
          return result
        })
      }
      setFlag(false)
      setTotal(res.total)
      setCreateLoading(false);
    }).catch(() => {
      setFlag(false)
      setCreateLoading(false);
    })
  }
  function getStyle() {
    getAllstyle({task_id: taskData.id.toString()}).then(res=> {
      setStyleList(res)
    }).catch(() => {

    })
  }
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
  async function handleScroll(e:any) {
    const container = e.srcElement;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if ((scrollHeight - 50) <= (scrollTop  + clientHeight) && !flag && imgList.length < imgTotal) {
      setFlag(true)
      setPage((val: number) => val + 1)
    }
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
  function handleChange(e:string){
    setCurStyle(e)
    getList(true, e)
  }
  return (
    <div className='pt-[20px] pr-[60px] flex h-[672px] w-full'>
      <div className="w-full flex flex-col border-[1px] border-[#EEEEEE] bg-white relative p-[20px] rounded-[10px]">
        <div className='mb-[20px] flex justify-between items-center'>
          <Select 
          className='w-[120px]'
            value={curStyle}
            onChange={handleChange}
            placeholder='全部风格'
            options={[{style_name: '全部风格',style_id: ''}, ...styleList]}
            fieldNames={{
              label: 'style_name',
              value: 'style_id',
            }}
          />
          <div className='text-[#6984FF] font-medium text-[14px] cursor-pointer' onClick={() => {switchAllImg(undefined)}}>收起全部</div>
        </div>
        <div className='flex-1'>
          {
            imgList && imgList.length?
            <Scrollbars onScroll={throttle(handleScroll)} renderTrackHorizontal={({ style, ...props }) => (
                <div {...props} style={{ ...style, right: '-10px', border: 'none' }} />
              )} className={`${style.scrollView} pr-[10px] overflow-x-hidden border-none bg-white`}>
                <div className='pr-[12px] '>
                  <Row gutter={10} className={style.imgMask}>
                    {
                      createLoading? renderLoading() : null
                    }
                    {
                      imgList.map((item: any) => (
                        <Col span={6} key={item.id} className='mb-[10px]'>
                          <div><ImgItem createLoading={createLoading} isDevMode={false} item={item} toSmear={toSmear} taskData={taskData} getList={() => {getList(true)}} setImgList={setImgList} /></div>
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
        </div>
        <SmearDialog ref={smearDialogRef} />
      </div>
    </div>
  )
}

export default AllImg;