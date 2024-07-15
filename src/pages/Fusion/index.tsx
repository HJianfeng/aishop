/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import { Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import PageCover from '@/components/PageCover'
import CreateTask from '@/components/CreateTask'
import { ISelectItem, DemoItem } from '@/interface'
import { getTaskList, getDevTaskList, taskCreate, getdemolist } from '@/service'
import TaskList from './components/TaskList'
import { handleCoordinate } from '@/utils';
import { useCanvasContext } from '@/components/Canvas/hooks';
import fusionCover from '@/assets/fusionCover.png'
import { useSelector } from 'react-redux'
import { emitter } from '@/utils/eventBus'

const INIT_PAGESIZE = 30;
const BgFusion = ({ isDevMode }: { isDevMode?:boolean }) => {
  const createTaskRef: React.MutableRefObject<any> = useRef(null);
  const taskListRef: React.MutableRefObject<any> = useRef(null);
  const [taskList, setTaskList] = useState<ISelectItem[]>([]);
  const [isInit, setIsInit] = useState(true);
  const [freshTask, setFreshTask] = useState<any>();
  const [freshTaskFlag, setFreshTaskFlag] = useState(false);
  const [pageFlag, setPageFlag] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [page_index, setPageIndex] = useState(1);
  const [page_size, setPageSize] = useState(INIT_PAGESIZE);
  const [taskTotal, setTaskTotal] = useState<any>(0);
  
  const [falg, setFlag] = useState(false);
  const [demoList, setDemoList] = useState<DemoItem[]>([]);
  const { canvasInfo }:any = useCanvasContext();

  const fusionImgInfo = useSelector((state: any) => state.tool.fusionImgInfo)

  if(isDevMode) {
    canvasInfo.width = 210
    canvasInfo.height = 210
  }
  
  useEffect(() => {
    getDemo()
    
    const evt: any = emitter.on('updateTask', updateTask)
    return () => {
      emitter.removeListener(evt, updateTask);
    };
  }, []);
  useEffect(() => {
    getList(freshTask);
  }, [freshTask, freshTaskFlag]);

  async function getDemo() {
    try {
      const res = await getdemolist()
      const data = res.filter((i:any) => i.Type === 'create_img')
      
      setDemoList(data)
    } catch (error) {
      
    }
  }
  function toUpload() {
    createTaskRef.current.showModal(taskList)
  }
  async function createDemo(item: DemoItem) {
    console.log(item)
    try {
      const data = {
        task_name: item.TaskName,
        task_en_name: item.TaskEnName,
        tbn_main_img: item.TbnImgKey,
        main_img: item.MainImgKey,
        is_demo: 'true'
      }
      const res = await taskCreate(data)
      freshTaskList(res)
    } catch (error: any) {
      message.error(error.message)
    }
  }
  
  function getList(id?: any) {
    setLoading(true)
    const data = {
      page_index: page_index.toString(),
      page_size: page_size.toString(),
    }
    const apiTaskList = isDevMode ? getDevTaskList : getTaskList
    apiTaskList(data).then((res: { items: ISelectItem[], total: number }) => {
      setTaskTotal(res.total)
      if(res?.items?.length) {
        res.items.forEach(i => {
          handleTaskItem(i)
        })
      }
      let allList = res.items || [];
      if(data.page_index === '1') {
        setTaskList(res.items || []);
      } else {
        setTaskList((val: any[]) => {
          const ids = val.map(i => i.id)
          const temp = res.items.filter(i => !ids.includes(i.id))
          const result = val.concat(temp)
          allList = result
          return result
        })
      }
      if(res?.items?.length) {
        setFlag(true)
        const isSetId = id && allList.some(i => i.id === id)
        if(isSetId) {
          setCurrentTask(id)
        } else {
          setCurrentTask(res.items[0].id)
        }
        setFlag(false)
      }
     
    }).catch((error: any) => {
      console.log(error);
    }).finally(() => {
      setLoading(false)
      setIsInit(false)
      setPageFlag(false)
    })
  }

  function handleTaskItem(data: ISelectItem) {
    const x = Number(data.coordinate.split(',')[0] || 0);
    const y = Number(data.coordinate.split(',')[1] || 0);
    
    const result  = handleCoordinate({
      frontOpt: { width: canvasInfo.width, height: canvasInfo.height },
      resultInfo: fusionImgInfo,
      x, y,
      img_width: Number(data.img_width || 0),
      reverse: true
    })
    data.coordinate = `${result.x},${result.y}`
    data.img_width = result.img_width
  }
  function setCurrentTask(id:any) {
    taskListRef?.current?.setActiveId(id)
  }
  
  function freshTaskList(id: any) {
    setPageIndex(1)
    setPageSize(taskList.length < INIT_PAGESIZE ? INIT_PAGESIZE : taskList.length || INIT_PAGESIZE)
    setFreshTask(id)
    setFreshTaskFlag(!freshTaskFlag)
  }
  function goToNextPage(id: any) {
    if(!pageFlag && taskList.length < taskTotal) {
      setPageFlag(true)
      setPageIndex(page_index+1)
      setFreshTask(id)
      setFreshTaskFlag(!freshTaskFlag)
    }
  }
  function updateTask(data: {id: any, opt: Record<string, any>}) {
    const {id, opt} = data
    if(id && opt) {
      setTaskList((val: any[]) => {
        val.forEach(i => {
          if(i.id === id) {
            Object.assign(i, opt)
          }
        })
        return val
      })
    }
  }
  return (
    <div className='relative w-full'>
      <Spin spinning={loading} className='min-h-[100vh]' indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} >
        <div className='w-full'>
          {
            !falg?
              !isInit?
              (taskList && taskList.length) || isDevMode?
              <TaskList 
                ref={taskListRef} 
                freshTaskList={freshTaskList} 
                goToNextPage={goToNextPage}
                taskList={taskList || []} 
                toUpload={toUpload} />
              :
              <PageCover showRecommend cover={fusionCover} createDemo={createDemo} toUpload={toUpload} recommendList={demoList} title="背景融合" summary='自动去除背景，进行风格背景进行融合，赶紧试试呦' />
              : null
            : null
          }
        </div>
      </Spin>
      <CreateTask isDevMode={isDevMode} ref={createTaskRef} onClose={() => {}} onOk={(id) => {freshTaskList(id)}} />
    </div>
  )
}
export default BgFusion