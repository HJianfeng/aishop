import { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Space, Modal } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons'

const ImportModel = forwardRef((props: any, ref: any) => {
  const [isOpen, setiIsOpen] = useState(false);
  const [copyStr, setCopyStr] = useState('');

  function switchDialog(e?: any) {
    e?.stopPropagation()
    setiIsOpen(!isOpen)
    setCopyStr('')
  }
  async function submit() {
    props.submit(copyStr)
    switchDialog()
  }
  useImperativeHandle(ref, () => ({
    switchDialog
  }))
  return (
    <Modal 
      closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
      width={300} 
      footer={null}
      centered open={isOpen} onCancel={() => switchDialog()}>
      <div className='text-[#121212] text-[22px] text-center font-medium'>导入参数</div>
      <div className='mt-[17px]'>
        <Input.TextArea 
          value={copyStr} 
          placeholder='粘贴之前复制的参数'
          style={{ height: 170, resize: 'none' }}
          onChange={(e) => setCopyStr(e.target.value)}
        />
      </div>
      <div className='flex justify-center mt-[20px]'>
        <Space size={20}>
          <Button className='!text-[16px]  w-[85px] !h-[40px] !rounded-[3px]' size='large' onClick={submit} type="primary">提交</Button>
        </Space>
      </div>
    </Modal>
  )
})

export default ImportModel
