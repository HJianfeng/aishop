import { useState, forwardRef, useImperativeHandle } from 'react';
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, Button } from 'antd'
import Login  from './login';
import Register  from './register';
import ResetPassword from './ResetPassword'

interface Prop {
  onlyChangeName?: boolean
}
const REACT_APP_MODE = process.env.REACT_APP_MODE
const LoginDialog = forwardRef(({ onlyChangeName }: Prop, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState(0);
  

  const showModal = () => {
    switchRegister(0);
    setIsModalOpen(true);
    if(onlyChangeName) setContentType(2)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal
  }))

  function forgetPassword() {
    setContentType(2)
  }
  function switchRegister(type: number) {
    setContentType(type);
  }

  const toTb = () => {
    window.open("https://fuwu.taobao.com/ser/my_service.htm","_self");
  };
  return (
    <Modal width={REACT_APP_MODE === 'ali'?500:300} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      {
        REACT_APP_MODE === 'ali'?
        <div className='flex flex-col items-center justify-center'>
          <div className='mb-[43px] text-center items-center text-[#121212] !text-[20px] font-semibold'>请在淘宝服务市场-我的服务里点击使用哦</div>
          <Button onClick={toTb} type="primary" className='w-[85px] h-[40px] text-[16px]' >去使用</Button>
        </div>
        :
        <>
          {
            contentType === 0 ? <Login forgetPassword={forgetPassword} handleCancel={handleCancel} /> : 
            contentType === 1 ? <Register handleCancel={handleCancel} /> : 
            contentType === 2 ? <ResetPassword switchRegister={switchRegister} handleCancel={handleCancel} /> : null
          }
          {
            !onlyChangeName?
            contentType === 0 ? 
                    <div onClick={() => {switchRegister(1)}} 
                className='mt-[19px] cursor-pointer text-primary text-[14px] text-center'>注册账号</div> :
            contentType === 1 ?
            <div className='flex items-center mt-[19px] text-[14px] justify-center'>
              <div className='text-[#ACACAC] mr-[5px]'>已有账号</div> 
              <div onClick={() => {switchRegister(0)}}  className='cursor-pointer text-primary'>立即登录</div>
            </div> : 
            <div className='flex items-center mt-[19px] text-[14px] justify-center'>
              <div className='text-[#ACACAC] mr-[5px]'>记得密码</div> 
              <div onClick={() => {switchRegister(0)}}  className='cursor-pointer text-primary'>账号登录</div>
            </div>
            : null
          }
        </>
      }
      
    </Modal>
  )
})

export default LoginDialog;