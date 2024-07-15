import React from 'react';
import { Button, Form, Input,message  } from 'antd';
import { useNavigate } from "react-router-dom";
import { login } from '@/service/index'
import { setLocalStorage } from '@/utils'
import styles from './index.module.scss';


const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    login({ login_name: values.user_name,password: values.pass_word }).then((res) => {
      setLocalStorage('user', res)
      navigate('/fusion/workspace');
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
        <div className={styles.welcome}>欢迎登录</div>
        <Form
          name="basic"
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login;
