import { useMemo, useEffect, useState, useRef } from 'react';
import { Dropdown, Tooltip, message, Input, Modal, Button,Spin } from 'antd';
import { Scrollbars } from 'rc-scrollbars';
import { throttle } from '@/utils';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons'
import { getResultImgUrl } from '@/utils/location';
import type { MenuProps } from 'antd';
import { deleteTask, updateTemplteName } from '@/service';
import { getTemplateTaskList } from '@/service'
import CreateTask from '@/components/CreateTask'
import TemplateMain from './templateMain'

const TemplateCreate = () => {
  const [taskList, setTaskList] = useState<any[]>([])
  const [activeId, setActiveId] = useState<any>('');
  const [taskTotal, setTaskTotal] = useState<number>(0);
  const [pageFlag, setPageFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<{page: number,flag: boolean}>({page: 1, flag: true});

  // 修改名称
  const [isOpenRename, setIsOpenRename] = useState<boolean>(false);
  const [rename, setRename] = useState<string>('');
  const [curTaskId, setCurTaskId] = useState<any>('');

  const dragImgRef: any = useRef()
  const createTaskRef: React.MutableRefObject<any> = useRef(null);
  useEffect(() => {
    getData()
  }, [params])

  async function getData() {
    const data = {
      page_index: (params.page || 1).toString(),
      page_size: '30',
    }
    try {
      const res = await getTemplateTaskList(data)
      setPageFlag(false)
      setTaskTotal(res.total)
      setTaskList(res.items || [])
      if(!activeId && res.items?.length) {
        setActiveId(res.items[0].id)
      }
    } catch (error) {
      setPageFlag(false)
    }
  }
  function freshTaskList(id: any) {
    setParams((val) => {
      return {...val, flag: !val.flag, page:  1}
    })
  }
  function handleScroll(e:any) {
    if(!taskData) return;
    const container = e.srcElement;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if (!pageFlag && (scrollHeight - 50) <= (scrollTop  + clientHeight) && taskList.length < taskTotal) {
      setPageFlag(true)
      setParams((val) => {
        return {...val, page: val.page + 1}
      })
    }
  }
  const taskData = useMemo<any>(() => {
    if(!taskList || taskList.length === 0) return null;
    if(!activeId) return taskList[0];
    const cur = taskList.find((item) => item.id === activeId);
    return cur || taskList[0]
  }, [activeId, taskList])

  function switchActiveId(id: any) {
    setActiveId(id)
    dragImgRef?.current?.cancelCreate()
  }

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
  function handleDropClick(data:any, item: any) {
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
            if(activeId === item.id) {
              setActiveId('')
            }
            setParams((val) => {
              return {...val, flag: !val.flag}
            })
            message.success('删除成功');
          }).catch(() => {})
        },
        onCancel() {},
      })
    }
  }
  function createTask() {
    createTaskRef.current.showModal(taskList)
  }

  const onRename = () => {
    if (!rename) {
      message.error('请输入重命名的名称');
      return;
    }
    updateTemplteName({ task_name: rename, task_id: curTaskId }).then((res) => {
      if(taskData) taskData.task_name = rename
      setIsOpenRename(false)
      message.success('修改成功');
    }).catch((res) => {
      message.error(res.errorMsg);
    })
  };
  
  return (
    <div style={{minHeight: 'calc(100vh - 74px)'}} className={`relative flex pb-[30px] overflow-hidden h-full px-[16px]`}>
      <Spin spinning={loading} className="!max-h-full" tip="生成中" >
        <div className={`flex `}>
          <div 
            className={`flex mr-[19px] rounded-[10px] bg-white`} 
            style={{boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.1)'}}>
            <div className='w-[173px] flex-shrink-0 border-r border-[#EFEFEF]'>
              <div className='flex items-center py-[15px] pl-[15px] pr-[14px]'>
                <div className='flex-1 text-[#ACACAC] text-[16px]'>任务</div>
                <div onClick={createTask} className='w-[25px] h-[25px] rounded-[5px] flex items-center justify-center bg-primary hover:bg-primaryhover cursor-pointer'><PlusOutlined className='text-white' /></div>
              </div>
              {
                taskData?
                <Scrollbars onScroll={throttle(handleScroll)} autoHide={true} style={{ height: 'calc(100% - 57px)'}}>
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
                taskData?
                <TemplateMain ref={dragImgRef} setPageLoading={(val: boolean) => {setLoading(val)}} taskData={taskData} />
                : null
              }
            </div>
          </div>
        </div>
        {/* <div className={`flex`}>
          <div className='min-w-[450px]'>
            <Result taskData={taskData}  />
          </div>
        </div> */}
        {/* 修改名称 */}
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
        <CreateTask ref={createTaskRef} isTaskMode={true} onClose={() => {}} onOk={(id) => {freshTaskList(id)}} />
      </Spin>
    </div>
  )
}

export default TemplateCreate