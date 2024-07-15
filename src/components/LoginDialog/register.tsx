import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react"
import {  Form, Input, Button, message } from 'antd'
import type { FormInstance } from 'antd';
import { register, sendsmscode } from '@/service/index'
import { setLocalStorage, phoneCheck } from '@/utils'
// import IdentifyDialog from './IdentifyDialog'
import style from './style.module.scss'
import PubSub from 'pubsub-js';


const Register = (props: any, ref: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<FormInstance>(null);
  // const IdentifyDialogRef: any = useRef(null);
  const [countdown, setCountdown] = useState(0)

  const onFinish = (values: any) => {
    const params = new URLSearchParams(location.search); // 获取地址栏参数
    const from = params.get('from') || ''; 
    const data = {
      login_name: values.user_name,
      password: values.pass_word ,
      sms_code: values.sms_code,
      iv_code: values.iv_code,
      from
    }
    register(data).then((res) => {
      setLocalStorage('user', res)
      props.handleCancel?.()
      if(res?.user_type ===2 || res?.user_type === 8){
        navigate('/fusion/workspace?dev=true');
      }else{
        navigate('/fusion/workspace');
      }
      
      PubSub.publish('freshUserScores');
    }).catch((err:any)=>{
      console.log(err)
      message.error(err?.errorMsg || '服务异常');
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    const errorField = errorInfo.errorFields.map((i:any) => i.name[0])
    
    if(errorField.includes('sms_code')) {
      message.error('请输入验证码');
      return
    }
    if(errorField.includes('pass_word') && errorField.includes('user_name')) {
      message.error('请输入正确的手机号码、密码和邀请码');
    } else if(errorField.includes('pass_word') && errorField.includes('user_name')) {
      message.error('请输入正确的手机号码和密码');
    } else if(errorField.includes('user_name')) {
      message.error('请输入正确的手机号码');
    } else if(errorField.includes('pass_word')) {
      message.error('请输入密码');
    }
  };

  const sendPhone = () => {
    const phone = formRef.current?.getFieldValue('user_name')
    if(!phone) {
      message.error('请输入正确的手机号码');
      return
    }
    sendsmscode({login_name: phone}).then(res => {
      console.log(res);
      message.success('短信验证码发送成功');
      handleIdentify()
    }).catch((err) => {
      message.error('短信验证码发送失败');
    })
  }

  
  // function openDialog(login_name: string) {
  //   IdentifyDialogRef.current?.openDialog(login_name)
  // }
  let timer: any = null;
  function handleIdentify() {
    setCountdown(60)
    countDown()
  }
  const countDown = () => {
    timer = setTimeout(() => {
      setCountdown((data) => {
        if (data < 1) {
          if(timer) clearTimeout(timer)
        } else {
          countDown();
        }
        return data - 1;
      });
    }, 1000);
  }

  return (
    <div>
      <div className='mb-[43px] text-center text-[#121212] text-[22px] font-semibold'>注册账号</div>
      <Form
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="user_name"
          rules={[{ required: true, message: '' }, { validator: phoneCheck.bind(this) }]}
          className='mb-[10px]'
        >
          <Input size='large' placeholder="请输入正确的手机号码" />
        </Form.Item>
        <Form.Item
          name="sms_code"
          rules={[{ required: true, message: '' }]}
          className='mb-[10px]'
        >
          <Input size='large' suffix={
            countdown > 0 ? 
            <div className="text-[16px]">{countdown}</div> :
            <div onClick={sendPhone} className="text-primary cursor-pointer text-[16px]">验证码</div>
          } placeholder="请输入验证码" />
        </Form.Item>
        <Form.Item
          name="pass_word"
          rules={[{ required: true, message: '' }]}
          className='mb-[10px]'
        >
          <Input.Password size='large' placeholder="请输入密码" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='mb-[0]'>
          <Button type="primary" className={`w-[85px] h-[40px] text-[16px] ${style.btnBg}`} htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
      
      {/* <IdentifyDialog ref={IdentifyDialogRef} handleIdentify={handleIdentify} /> */}
    </div>
  )
}

export default Register;