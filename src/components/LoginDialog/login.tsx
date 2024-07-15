import { useNavigate } from "react-router-dom";
import {  Form, Input, Button, message } from 'antd'
import { login } from '@/service/index'
import { setLocalStorage } from '@/utils'
import style from './style.module.scss'
import PubSub from 'pubsub-js';

interface Prop {
  forgetPassword: () => void;
  handleCancel:  ()=>  void
}
const Login = (props: Prop, ref: any) => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    if(!values.user_name) {
      message.error('请输入用户名');
      return;
    }
    if(!values.pass_word) {
      message.error('请输入密码');
      return;
    }
    login({ login_name: values.user_name, password: values.pass_word }).then((res) => {
      setLocalStorage('user', res)
      props.handleCancel()
      if(window.location.href.indexOf('/fusion/workspace') >= 0) {
        window.location.reload()
      } else {
        PubSub.publish('freshUserScores');
        PubSub.publish('freshSloganInfo')
      }
      
      // if(res?.user_type ===2 || res?.user_type === 8){
      //   navigate('/fusion/workspace?dev=true');
      // }else{
      //   navigate('/fusion/workspace');
      // }
    }).catch((err:any)=>{
      console.log(err)
      message.error(err?.errorMsg || '服务异常');
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    const errorField = errorInfo.errorFields.map((i:any) => i.name[0])
    if(errorField.includes('pass_word') && errorField.includes('user_name')) {
      message.error('请输入用户名和密码');
    } else  if(errorField.includes('user_name')) {
      message.error('请输入用户名');
    } else if(errorField.includes('pass_word')) {
      message.error('请输入密码');
    }
  };
  return (
    <div>
      <div className='mb-[43px] text-center text-[#121212] text-[22px] font-semibold'>账号登录</div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="user_name"
          rules={[{ required: true, message: '' }]}
          className='mb-[10px]'
        >
          <Input size='large' placeholder="请输入正确的手机号码"/>
        </Form.Item>

        <Form.Item
          name="pass_word"
          rules={[{ required: true, message: '' }]}
          className='mb-[0px]'
        >
          <Input.Password size='large' placeholder="请输入密码"/>
        </Form.Item>
        <div onClick={props.forgetPassword} className='mb-[44px] text-primary text-[16px] mt-[8px] cursor-pointer hover:text-primaryhover'>忘记密码</div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='mb-[0]'>
          <Button type="primary" className={`w-[85px] h-[40px] text-[16px] ${style.btnBg}`} htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login;