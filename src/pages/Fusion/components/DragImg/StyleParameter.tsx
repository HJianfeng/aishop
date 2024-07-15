import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Radio, Button, Space, message } from 'antd';
import { copyToClip, handleCoordinate } from '@/utils'
import { useCanvasContext } from '@/components/Canvas/hooks';
import ImportModule  from './module/ImportModule';
import OptionsModule  from './module/OptionsModule';
import { imgCreateInner, getSdConfig, taskCopy, taskSdConfigSave } from '@/service';
import PubSub from 'pubsub-js';
import axios from 'axios';
import { useSelector } from 'react-redux'

interface Prop {
  taskData: any
  taskList: any
  freshTaskList: any
}
let listCancelToken: any = null;
const StyleParameter = (prop: Prop, ref: any) => {
  const [loading, setLoading] = useState(false);
  const headerRef: any = useRef()
  const optionRef: any = useRef()
  const importRef: any = useRef()
  const { imageOffset, canvasInfo } = useCanvasContext();
  const fusionImgInfo = useSelector((state: any) => state.tool.fusionImgInfo)

  useEffect(() => {
    PubSub.subscribe('taskCurrentLoading', () => {
      setLoading(true);
    })
    PubSub.subscribe('taskCurrentCancelLoading', () => {
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
    return () => {
      cancelCreate()
    }
  }, [])
  useEffect(() => {
    getConfig()
  }, [prop.taskData])
  async function getConfig() {
    try {
     const res = await getSdConfig({ task_id: prop.taskData.id})
     const data = JSON.parse(res)
     
     if(data) {
      optionRef.current.fillData(data)
      if(data.create_type) {
        headerRef.current.setMode(data.create_type === 'B'?1:0)
      }
     } else {
      optionRef.current.fillData()
     }
    } catch (error) {
      optionRef.current.fillData()
    }
  }
  function getTaskName(nameList: any[], name: string, index: number) : any{
    const taskName = `${name}-${index}`
    if(nameList.includes(taskName)) {
      return getTaskName(nameList, name, index + 1)
    } else {
      return taskName
    }
  }
  async function handleTaskCopy() {
    if(!prop.taskData) return
    const taskList = prop.taskList
    let taskName = prop.taskData.task_name;
    if(taskList && taskList.length) {
      const nameList = taskList.map((item: any) => item.task_name)
      taskName = getTaskName(nameList, taskName, 1)
    }
    const data = {
      task_name: taskName,
      task_id: prop.taskData.id.toString()
    }
    try {
      await taskCopy(data)
      message.success('新建任务成功')
      prop.freshTaskList?.(prop.taskData.id)
    } catch (error) {
      
    }
  }
  async function save() {
    const mode = headerRef.current.mode;
    const devParams = optionRef.current.params
    
    const x = parseInt(imageOffset.current.x + '');
    const y = parseInt(imageOffset.current.y + '')
    const width = parseInt(imageOffset.current.width + '')
    // const result  = handleCoordinate({
    //   frontOpt: { width: canvasInfo.width, height: canvasInfo.height },
    //   resultInfo: fusionImgInfo,
    //   x, y, img_width: width
    // })
    const result = {
      x, y, img_width: width
    }
    const params = {
      task_id: prop.taskData.id.toString(),
      img_width: result.img_width,
      coordinate: `${result.x},${result.y}`,
    }
    const data = {
      ...devParams,
    }
    data.create_type = mode? 'B': 'A'
    try {
      await taskSdConfigSave(params, data)
      message.success('保存成功')
    } catch (error: any) {
      // message.error(error?.message)
    }
  }
  function submit() {
    const mode = headerRef.current.mode;
    const devParams = optionRef.current.params
    
    const x = parseInt(imageOffset.current.x + '');
    const y = parseInt(imageOffset.current.y + '')
    const width = parseInt(imageOffset.current.width + '')
    // const result  = handleCoordinate({
    //   frontOpt: { width: canvasInfo.width, height: canvasInfo.height },
    //   resultInfo: fusionImgInfo,
    //   x, y, img_width: width
    // })
    const result = {
      x, y, img_width: width
    }
    const params = {
      task_id: prop.taskData.id.toString(),
      style_id: -1,
      coordinate: `${result.x},${result.y}`,
      style_name: '随机风格',
      batch_number: 4,
      img_width: result.img_width,
      canvas: `${canvasInfo.width}:${canvasInfo.height}`
    }
    const data = {
      ...devParams,
    }
    data.create_type = mode? 'B': 'A'
    
    PubSub.publish('setLoading');
    setLoading(true);
    const source = axios.CancelToken.source();
    listCancelToken = source
    imgCreateInner(params, data, source.token).then((res) => {
      listCancelToken = null
      PubSub.publish('updateImgResultList', { task_id: prop.taskData?.id });
      setLoading(false);
    }).catch((error) => {
      if(error.message !== 'cancel') {
        message.error(error.message || '连接图片服务器失败');
      }
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
  }
  async function copy() {
    const devParams = optionRef.current.params
    const data = {
      ...devParams,
    }
    const str = JSON.stringify(data);
    await copyToClip(str)
    message.success('复制成功');
  }
  function importData() {
    importRef.current.switchDialog()
  }
  function importSubmit(data: any) {
    try {
      const result = JSON.parse(data)
      optionRef.current.fillData(result)
      if(result.create_type) {
        headerRef.current.setMode(result.create_type === 'B'?1:0)
      }
    } catch (error) {
      
    }
  }
  useImperativeHandle(ref, () => ({
    cancelCreate
  }))
  function cancelCreate() {
    if(listCancelToken) listCancelToken.cancel('cancel');
  }
  return (
    <div className='pb-[20px]'>
      <Header ref={headerRef} disabled={!prop.taskData} />
      <div className='px-[13px] py-[9px] flex'>
        <OptionsModule ref= {optionRef} disabled={!prop.taskData} taskData={prop.taskData} />
      </div>
      <div className='mx-[13px] pt-[10px] border-t flex border-dashed border-[#D3D3D3]'>
        <Space size={10} className='flex-1'>
          <Button disabled={!prop.taskData} onClick={save}>保存</Button>
          <Button disabled={!prop.taskData} onClick={handleTaskCopy}>副本</Button>
          <Button disabled={!prop.taskData} onClick={copy}>复制</Button>
          <Button disabled={!prop.taskData} onClick={importData}>导入</Button>
        </Space>
        <Button disabled={!prop.taskData} onClick={submit} loading={loading} className='!h-[42px] !w-[100px] !rounded-[5px]' type='primary' size='large'>GO!!</Button>
      </div>
      <ImportModule ref={importRef} submit={importSubmit} />
    </div>
  )
}


const Header = forwardRef((prop:any, ref: any) => {
  const [mode, setMode] = useState(0)

  useImperativeHandle(ref, () => ({
    mode, setMode
  }))
  return (
    <div className="px-[20px] ">
      <div className="flex justify-between items-center h-[50px] border-b border-dashed border-[#D3D3D3]">
        <div className="text-primary text-[20px] font-medium">风格参数</div>
        <div>
          <Radio.Group disabled={prop.disabled} onChange={(e: any) => setMode(e.target.value)} value={mode}>
            <Radio value={0} className='text-[#818181] text-[14px] mr-[50px]'>模式A</Radio>
            <Radio value={1} className='text-[#818181] text-[14px]'>模式B</Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  )
})


export default forwardRef(StyleParameter)