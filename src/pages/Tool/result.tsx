import { getImgList } from '@/service';
import { useEffect, useState } from 'react';
import emptyIcon from '@/assets/empty.png';
import { Empty, Row, Col, Image } from 'antd'
import { Scrollbars } from 'rc-scrollbars';
import { throttle } from '@/utils';
import { CloseCircleFilled } from '@ant-design/icons';

//废弃
const Result = ({taskData} : {taskData: any}) => {
  const [imgList, setImgList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [page_index, setPage] = useState<any>(1);
  const [page_size] = useState<any>(24);
  const [imgTotal, setTotal] = useState<any>(24);
  const [createLoading, setCreateLoading] = useState(false);
  const [imgvisible, setImgvisible] = useState(false);

  useEffect(() => {
    if(taskData && page_index > 1 && flag) {
      getList({task_id: taskData.id})
    }
  }, [page_index, flag])
  useEffect(() => {
    taskData && getList({ task_id: taskData.id, reset: true })
  }, [taskData])

  // 获取任务list
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
    getImgList(data).then(res => {
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
    }
  }
  return (
    <div>
      {
        imgList && imgList.length?
        <Scrollbars onScroll={throttle(handleScroll)} renderTrackHorizontal={({ style, ...props }) => (
            <div {...props} style={{ ...style, right: '-10px' }} />
          )}
            className='pr-[10px] overflow-x-hidden'>
            <div className='pr-[12px] '>
              <Row gutter={10} >
                {
                  imgList.map((item: any) => (
                    <Col span={12} key={item.id} className='mb-[10px]'>
                      <div>
                        <Image
                          width={'100%'}
                          src={item.tbn_img} 
                          style={{borderRadius: '5px'}}
                          />
                      </div>
                    </Col>
                  ))
                }
              </Row>
            </div>
        </Scrollbars>
        : 
        <Empty 
          className='mt-[260px]'
          image={<div className='w-full flex justify-center'><img className='w-[100px]' src={emptyIcon} alt="" /></div>}
          description={<div className='text-[#9C9C9C] text-[16px]'>还没有记录</div>} />
      }
    </div>
  )
}

export default Result