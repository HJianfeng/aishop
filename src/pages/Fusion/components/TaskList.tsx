/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons'
import { useLocation } from "react-router-dom";
import type { MenuProps } from 'antd';
import { Dropdown, Tooltip, message, Input, Modal, Button } from 'antd';
import { ISelectItem } from '@/interface'
import { emitter } from '@/utils/eventBus'
import { getResultImgUrl } from '@/utils/location';
import { deleteTask, updateName, updateDevName, taskCurrent } from '@/service';
import { throttle } from '@/utils';
import DragImg from './DragImg'
import StyleParameter from './DragImg/StyleParameter'
import TaskResult from './TaskResult'
import { Scrollbars } from 'rc-scrollbars';
import fusionLineIcon from '@/assets/fusion_line.png'
import PubSub from 'pubsub-js';
import AllImg from './AllImg';

interface IProps {
  // 上传文件
  toUpload: () => void
  // 获取任务列表
  taskList: ISelectItem[]
  // 更新任务列表
  freshTaskList: (id?: any) => void
  goToNextPage: (id?: any) => void
}
let timer: any;
const TaskDataList = ({ toUpload, taskList, freshTaskList, goToNextPage }: IProps, ref: any) => {
  const [activeId, setActiveId] = useState<any>('');
  const [rename, setRename] = useState<any>('');
  const [curTaskId, setCurTaskId] = useState<any>('');
  const [isOpenRename, setIsOpenRename] = useState<boolean>(false);
  const [isOpenAllImg, setIsOpenAllImg] = useState<number|null>(null);
  const dragImgRef: any = useRef()
  const styleImgRef: any = useRef()
  const ScrollbarsRef: any = useRef()
  const pathname = useLocation().pathname
  const isDevMode = useMemo(() => {
    return pathname === '/model'
  }, [pathname])
  useEffect(() => {
    emitter.emit('headerData', {title: '背景融合', summary: '上传商品图，剩下的就交给AI速配吧'})
    let id = activeId;
    if(!activeId && taskList.length) {
      setActiveId(taskList[0].id)
      id = taskList[0].id
    }
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    getCurrentTask(true, id)
    return () => {
      dragImgRef?.current?.cancelCreate()
      styleImgRef?.current?.cancelCreate()
      if(timer) {
        clearTimeout(timer)
        timer = null
      }
      emitter.emit('headerData', null)
    };
  }, []);
  let currentTaskId: any = '';
  function switchActiveId(id: any) {
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    setActiveId(id)
    dragImgRef?.current?.cancelCreate()
    styleImgRef?.current?.cancelCreate()
    getCurrentTask(true, id)
  }
  
  function getCurrentTask(isInit = true, taskId?: any) {
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(async () => {
      try {
        const res = await taskCurrent()
        if(res) {
          getCurrentTask(false, taskId)
          const data = jsonParse(res)
          currentTaskId = data.TaskId
          if(isInit) {
            PubSub.publish('taskCurrentLoading')
            if(data.TaskId === taskId) {
              PubSub.publish('setLoading');
            }
          };
        } else {
          PubSub.publish('taskCurrentCancelLoading');
          if(timer) {
            clearTimeout(timer)
            timer = null
          }
          if(!isInit && (!currentTaskId || currentTaskId === taskId)) {
            PubSub.publish('updateImgResultList', { task_id: taskId || activeId });
            currentTaskId = null
          }
        }
      } catch (error) {
        PubSub.publish('taskCurrentCancelLoading');
      }
    }, 2000)
  }
  function jsonParse(obj: any) {
    try {
      return JSON.parse(obj)
    } catch (error) {
      return obj
    }
  }
  useImperativeHandle(ref, () => ({
    setActiveId
  }))
  const taskData = useMemo<ISelectItem | null>(() => {
    if(!taskList || taskList.length === 0) return null;
    if(!activeId) return taskList[0];
    const cur = taskList.find((item) => item.id === activeId);
    return cur || taskList[0]
  }, [activeId, taskList])
  const onRename = () => {
    if (!rename) {
      message.error('请输入重命名的名称');
      return;
    }
    
    const apiUpdateName = isDevMode ? updateDevName : updateName
    apiUpdateName({ task_name: rename, task_id: curTaskId }).then((res) => {
      // freshTaskName(curTaskId, rename);
      if(taskData) taskData.task_name = rename
      setIsOpenRename(false)
      message.success('修改成功');
    }).catch((res) => {
      message.error(res.errorMsg);
    })
  };

  const DropdownMenu: MenuProps['items'] = [
    {
      key: 'changeName',
      label: (<div>重命名</div>),
    },
    {
      key: 'delete',
      label: (<div className='text-center'>删除</div>),
    },
  ]
 
  function handleDropClick(data:any, item: ISelectItem) {
    if(data.key === 'changeName') {
      setRename(item.task_name)
      setCurTaskId(item.id)
      setIsOpenRename(true)
    } else {
      Modal.confirm({
        title: '要删除该任务',
        content: '确定后任务内所有内容将清空',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          deleteTask({ task_id: item.id }).then((res) => {
            let id: any = item.id;
            if(activeId === item.id) {
              id = undefined
            }
            freshTaskList(id);
            message.success('删除成功');
          }).catch(() => {})
        },
        onCancel() {},
      })
    }
  }
  function handleScroll(e:any) {
    if(!taskData) return;
    const container = e.srcElement;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if ((scrollHeight - 50) <= (scrollTop  + clientHeight)) {
      goToNextPage(activeId)
    }
  }

  function getTaskItem(id: any): any {
    return taskList.find(i => i.id === id)
  }
  function switchAllImg(id?:any) {
    setIsOpenAllImg(id)
  }
  return (
    // <Spin spinning={deleteLoading} className=' flex' wrapperClassName="h-full" style={{ height: 'calc(100% - 57px)'}}> 
      <div className={`
        ${isDevMode?'pt-[18px] justify-center':''} 
        relative flex pb-[30px] overflow-hidden h-full 
        px-[16px]`}>
        {
          isOpenAllImg && getTaskItem(isOpenAllImg)?
          <AllImg taskData={getTaskItem(isOpenAllImg)} switchAllImg={switchAllImg} />
          :
          <>
            {
              !isDevMode?
              <img className='absolute w-[21px] left-[168px] top-[9px]' src={fusionLineIcon} alt="" />
              :null
            }
            <div className={`${isDevMode?'min-h-[620px]':'pt-[72px]'} flex`}>
              <div 
                className={`${isDevMode?'w-[780px]':'w-[624px]'} flex mr-[19px] rounded-[10px] bg-white`} 
                style={{boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.1)'}}>
                <div className='w-[173px] flex-shrink-0 border-r border-[#EFEFEF]'>
                  <div className='flex items-center py-[15px] pl-[15px] pr-[14px]'>
                    <div className='flex-1 text-[#ACACAC] text-[16px]'>任务</div>
                    <div onClick={toUpload} className='w-[25px] h-[25px] rounded-[5px] flex items-center justify-center bg-primary hover:bg-primaryhover cursor-pointer'><PlusOutlined className='text-white' /></div>
                  </div>
                  {
                    taskData?
                    <Scrollbars ref={ScrollbarsRef} onScroll={throttle(handleScroll)} autoHide={true} style={{ height: 'calc(100% - 57px)'}}>
                      {/* DeleteLoading */}
                      <div>
                        {
                          taskList && taskList.length?
                          taskList.map((item, index) => (
                            <div key={item.id} className={`${activeId === item.id?'bg-[#6278DA] bg-opacity-10':''} group flex hover:bg-[#6278DA] hover:bg-opacity-10 px-[15px]  h-[60px] mb-[5px] `}>
                              <div onClick={() => {switchActiveId(item.id)}} key={item.id} className={` flex-1 flex h-full items-center cursor-pointer`}>
                                <img className='w-[40px] h-[40px] flex-shrink-0 object-fill' src={getResultImgUrl(item.tbn_main_img)} alt="" />
                                <Tooltip color='white' title={<div className='text-[#323232]'>{item.task_name}</div>}>
                                  <div className='truncate text-[#323232] text-[14px] w-0 flex-1 ml-[12px]'>{item.task_name}</div>
                                </Tooltip>
                              </div>
                              <Dropdown trigger={['click']}  menu={{ items:DropdownMenu, onClick: (key) => {handleDropClick(key, item)} }}>
                                <div className='hidden group-hover:flex h-full text-primary items-center cursor-pointer' onClick={(e) => e.preventDefault()}>
                                  <MenuOutlined className='text-[12px]' />
                                </div>
                              </Dropdown>
                            </div>
                          )):null
                        }
                      </div>
                    </Scrollbars>
                    :null
                  }
                </div>
                <div className='flex-1 relative'>
                  {
                    !isDevMode?
                    <DragImg ref={dragImgRef} taskData={taskData} />:
                    <StyleParameter ref={styleImgRef} taskData={taskData} taskList={taskList} freshTaskList={freshTaskList}  />
                  }
                </div>
              </div>
            </div>
            <div className={`${isDevMode?'min-h-[620px]':'h-[672px] pt-[22px] flex-1'} flex`}>
              <div className='min-w-[450px]  '>
                <TaskResult taskData={taskData} switchAllImg={switchAllImg} />
              </div>
            </div>
          </>
        }
        <Modal width={325} closeIcon={null} okText="确定" footer={null}
        cancelText="取消" centered open={isOpenRename} onCancel={() => {setIsOpenRename(false)}}>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-center text-[#121212] text-[16px] font-semibold mb-[10px]'>任务重命名</div>
            <Input value={rename} className='w-[258px] h-[44px] bg-[#F5F5F5] rounded-[5px] text-center' onChange={(e: any) => {setRename(e.target.value);}} placeholder="请输入要更改的名字"/>
            <div className='flex justify-center mt-[20px]'>
              <Button onClick={() => {setIsOpenRename(false)}} className='mr-[20px]'>取消</Button>
              <Button onClick={() => {onRename()}} type='primary'>确定</Button>
            </div>
          </div>
        </Modal>
      </div>
    // </Spin>
  )
}

// class TaskDataComponent extends React.Component<any, any> {
//   render() {
//     return (
//       <div >22</div>
//     )
//   }
// }
export default forwardRef(TaskDataList)