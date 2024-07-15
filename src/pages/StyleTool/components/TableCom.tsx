import { useRef, useState, forwardRef, useImperativeHandle, useEffect, useMemo } from 'react'
import {  Modal, message, Table, Input, Space, Button } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import moment from 'moment'
import style from './style.module.scss'
import { copyToClip } from '@/utils'
import { submitModel, getModel } from '@/service'

const model_type_map: any = {
  '1': 'model',
  '2': 'lora',
  '3': 'embeddings',
}
const TableCom = ({ type }: any) => {
  const [modelList, setModelList] = useState<any>([])
  const submitRef:any = useRef()
  
  
  useEffect(() => {
    getModelList()
  }, [])

  function getModelList() {
    
    const data = {
      model_type: model_type_map[type] || ''
    }

    getModel(data).then((res: any) => {
      setModelList(res)
    }).catch(() => {
      
    })
  }

  async function copy(copyText: string) {
    await copyToClip(copyText || '')
    message.success('复制成功')
  }

  const columns = useMemo(() => {
    const data: any = [
      {
        title: '模型名',
        dataIndex: 'model_name',
        key: 'model_name',
        width: 300,
        render: (val: any) => {
          return (
          <div className='flex w-[300px]'>
            <div className='truncate'>{val}</div>
          {
            type === '3'?
            <span onClick={() => {copy(val)}} className='shrink-0 text-primary cursor-pointer ml-[10px]'>复制</span>
            :null
          }
          </div>)
        },
      },
      {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
        width: 150
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (val: any) => {
          return val ? moment(val).format('YYYY/MM/DD HH:mm:ss') : ''
        },
        width: 200
      }
    ]
    if(type !== '3') {
      data.splice(1, 0, {
        title: '触发词',
        dataIndex: 'key',
        key: 'key',
        render: (val: any) => {
          return (
          <div className='flex w-[300px]'>
            <div title={val} className='truncate'>{val}</div>
          </div>)
        },
      })
    }
    return data
  }, [type])
  

  function submitModel() {
    submitRef.current.switchDialog()
  }
  return (
    <div className={style.tableStyle}>
      <Table rowKey={'id'} columns={columns} dataSource={modelList} pagination={{pageSize: 10}} />
      <div className='text-center mt-[20px]'>
        <div onClick={submitModel} className='cursor-pointer text-primary text-[16px]'>提交模型</div>
      </div>
      <SubmitModel type={type} freshData={getModelList} ref={submitRef} />
    </div>
  )
}

const SubmitModel = forwardRef(({ type, freshData }: any, ref: any) => {
  const [isOpen, setiIsOpen] = useState(false);
  const [ext_info, setExtinfo] = useState('');
  const [model_url, setModel_url] = useState('');
  const [name, setName] = useState('');
  // const map = {
  //   '1': '大模型',
  //   '2': 'LORA',
  //   '3': 'Textual Inversion',
  // }
  function switchDialog(e?: any) {
    e?.stopPropagation()
    setiIsOpen(!isOpen)
  }
  async function submit() {
    const data = {
      name,
      model_url,
      ext_info,
      model_type: model_type_map[type] || ''
    }
    try {
      await submitModel(data);
      message.success('提交成功')
      freshData()
      switchDialog()
      setModel_url('')
      setName('')
      setExtinfo('')
    } catch (error: any) {
      if(error?.message) message.error(error?.message)
    }
  }
  useImperativeHandle(ref, () => ({
    switchDialog
  }))
  return (
    <Modal 
      closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
      width={400} okText="确定" footer={null}
      cancelText="取消" centered open={isOpen} onCancel={() => switchDialog()}>
      <div className='text-[#121212] text-[22px] text-center font-medium'>提交模型</div>
      <div className='mt-[25px]'>
        <Input 
          value={name} 
          className='border-[#D3D3D3] rounded-[5px]'
          prefix={<div className='shrink-0 text-[#818181] text-[14px] font-medium'>名称：</div>}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='mt-[25px]'>
        <Input 
          value={model_url} 
          className='border-[#D3D3D3] rounded-[5px]'
          prefix={<div className='shrink-0 text-[#818181] text-[14px] font-medium'>地址：</div>}
          onChange={(e) => setModel_url(e.target.value)}
        />
      </div>
      <div className='mt-[17px] border border-[#D3D3D3] rounded-[5px]'>
        <div className='text-[#818181] px-[11px] pt-[8px] text-[14px] font-medium'>备注：</div>
        <Input.TextArea 
          value={ext_info} 
          bordered={false}
          placeholder='这里填写备注信息~'
          style={{ height: 150, resize: 'none' }}
          onChange={(e) => setExtinfo(e.target.value)}
        />
      </div>
      <div className='flex justify-center mt-[20px]'>
        <Space size={20}>
          {/* <Button className='!text-[22px] !text-[#121212] w-[111px] !h-[50px] !rounded-[5px]' size='large' onClick={switchDialog}>取消</Button> */}
          <Button className='!text-[16px]  w-[85px] !h-[40px] !rounded-[3px]' size='large' onClick={submit} type="primary">提交</Button>
        </Space>
      </div>
    </Modal>
  )
})
export default TableCom