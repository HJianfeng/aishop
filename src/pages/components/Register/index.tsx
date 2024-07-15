import React from 'react';
import { Button, Form, Input,message } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import { register } from '@/service/index'
import { setLocalStorage } from '@/utils'
import styles from './index.module.scss';


const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onFinish = (values: any) => {
    if (values.pass_word !== values.re_pass){
        message.error('两次密码输入不一致,请重新输入');
        return
    }
    const params = new URLSearchParams(location.search); // 获取地址栏参数
    const from = params.get('from') || ''; 
    register({ from, login_name: values.user_name,password: values.pass_word ,iv_code: values.iv_code}).then((res) => {
      setLocalStorage('user', res)

        if(res?.user_type ===2 || res?.user_type === 8){
          navigate('/fusion/workspace?dev=true');
        }else{
          navigate('/fusion/workspace');
        }
      
    }).catch((err:any)=>{
            console.log(err)
            message.error(err?.errorMsg || '服务异常');
         });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.loginBg}>
      <div className={styles.loginWrap}>
        <div className={styles.welcome}>新用户注册</div>
        <Form
          name="basic_reg"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="user_name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="pass_word"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="re_pass"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register;
