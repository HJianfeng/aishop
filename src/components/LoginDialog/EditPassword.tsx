import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import {  Form, Input, Button, message, Modal } from 'antd'
import type { FormInstance } from 'antd';
import { changepassword } from '@/service/index'
import { CloseCircleFilled } from '@ant-design/icons'
// import IdentifyDialog from './IdentifyDialog'
import style from './style.module.scss'


const EditPassword = (props: any, ref: any) => {
  const formRef = useRef<FormInstance>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onFinish = (values: any) => {
    if(values.new_pass !== values.re_pass) {
      message.error('两次输入的密码不一致');
      return
    }
    const data = {
      new_pass: values.new_pass,
      re_pass: values.re_pass,
    }
    changepassword(data).then((res) => {
      message.success('修改成功')
      handleCancel()
    }).catch((err:any)=>{
      console.log(err)
      message.error(err?.errorMsg || '服务异常');
    })
  };
  const onFinishFailed = (errorInfo: any) => {
    const errorField = errorInfo.errorFields.map((i:any) => i.name[0])
    if(errorField.includes('re_pass') || errorField.includes('re_pass')) {
      message.error('请输入密码');
    }
  };



  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {

    formRef?.current?.resetFields()
    setIsModalOpen(true);
  };
  useImperativeHandle(ref, () => ({
    showModal
  }))
  return (
    <Modal width={300} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      <div className='mb-[43px] text-center text-[#121212] text-[22px] font-semibold'>修改密码</div>
      <Form
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        
        <Form.Item
          name="re_pass"
          rules={[{ required: true, message: '' }]}
          className='mb-[10px]'
        >
          <Input.Password size='large' placeholder="请输入修改密码" />
        </Form.Item>

        <Form.Item
          name="new_pass"
          rules={[{ required: true, message: '' }]}
          className='mb-[0px]'
        >
          <Input.Password size='large' placeholder="请再次输入修改密码" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='mt-[70px] mb-[0]'>
          <Button type="primary" className={`w-[85px] h-[40px] text-[16px] ${style.btnBg}`} htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
      
    </Modal>
  )
}

export default forwardRef(EditPassword);