import { useState, forwardRef, useImperativeHandle } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { recharge } from '@/service'
import { Modal, Button, Space, Input, message, InputNumber, Radio } from 'antd'

const RechargeScore = (prop: any, ref: any) => {
  const [isOpen, setisOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [remark, setRemark] = useState('');
  const [day, setDay] = useState<any>('');
  const [score, setScore] = useState<any>('');
  const [r_type, setType] = useState(1)

  function openDialog() {
    setisOpen(true);
    setUserName('')
    setScore('')
  }
  useImperativeHandle(ref, () => {
    return { openDialog }
  })
  async function submit() {
    if(!userName) {
      message.error('请输入手机号或昵称')
      return
    }
    if((!score && score !== 0) || isNaN(Number(score))) {
      message.error('请输入套餐')
      return
    }
    const data = {
      login_name : userName,
      score: Number(score),
      r_type,
      remark,
      days: Number(day)
    }
    try {
      await recharge(data)
      message.success('充值成功')
    } catch (error: any) {
      message.error(error?.message)
    }
  }
  return (
  <Modal 
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    width={400} okText="确定" footer={null}
    cancelText="取消" centered open={isOpen} onCancel={() => setisOpen(false)}>
    <div className='flex items-center'>
      <div className='shrink-0 text-[16px] mr-[10px]'>账号</div>
      <Input className='flex-1' size='large' value={userName} placeholder='请输入手机号或昵称' onChange={(e) => setUserName(e.target.value)} />
    </div>
    <div className='flex items-center mt-[20px]'>
      <div className='shirink-0 text-[16px] mr-[10px]'>算力</div>
      <InputNumber controls={false} className='flex-1' size='large' value={score} placeholder='请输入算力' onChange={(e: any) => setScore(e)} />
    </div>
    <div className='flex items-center mt-[20px]'>
      <div className='shirink-0 text-[16px] mr-[10px]'>类型</div>
        <Radio.Group options={[
          { label: '套餐', value: 1 },
          { label: '人工', value: 2 },
        ]} onChange={(e) => {setType(e.target.value)}} value={r_type} />

        <Input className='w-[80px] mr-[5px]' size='small' value={remark} 
        placeholder='备注' onChange={(e: any) => setRemark(e.target.value)} />
        <InputNumber className='w-[80px]' controls={false} size='small' value={day} 
        placeholder='天数' onChange={(e: any) => setDay(e)} />
      </div>
    <div className='flex justify-center mt-[20px]'>
      <Space size={20}>
        <Button size='large' onClick={() => setisOpen(false)}>取消</Button>
        <Button size='large' onClick={submit} type="primary">确定</Button>
      </Space>
    </div>
  </Modal>
  )
}

export default forwardRef(RechargeScore);