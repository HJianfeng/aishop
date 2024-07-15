import { useRef, useState } from "react"
import {  Form, Input, Button, message } from 'antd'
import type { FormInstance } from 'antd';
import { forgetpwd, sendsmscode, checksmscode } from '@/service/index'
import { phoneCheck } from '@/utils'
// import IdentifyDialog from './IdentifyDialog'
import style from './style.module.scss'


const ResetPassword = (props: { switchRegister: (type: number) => void; handleCancel:  ()=>  void; }, ref: any) => {
  // const navigate = useNavigate();
  const formRef = useRef<FormInstance>(null);
  const [step, setStep] = useState(0);
  // const IdentifyDialogRef: any = useRef(null);
  const [countdown, setCountdown] = useState(0)
  const [user_name, setUserName] = useState('')

  const onFinish = (values: any) => {
    if(step === 0) {
      checksmscode({ mobile: values.user_name, sms_code: values.sms_code }).then((res) => {
        setUserName(values.user_name)
        setStep(1)
      }).catch((err:any)=>{
        message.error(err?.errorMsg || '服务异常');
      })
    } else {
      if (values.pass_word !== values.re_pass){
        message.error('两次密码输入不一致,请重新输入');
        return
      }
      const data = {
        user_name: user_name,
        passwd: values.pass_word,
      }
      forgetpwd(data).then((res) => {
        message.success('修改成功')
        props.switchRegister(0)
        setUserName('')
      }).catch((err:any)=>{
        console.log(err)
        message.error(err?.errorMsg || '服务异常');
      })
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    const errorField = errorInfo.errorFields.map((i:any) => i.name[0])
    if(step === 0) {
      if(errorField.includes('user_name')) {
        message.error('请输入正确的手机号码');
      } else if(errorField.includes('sms_code')) {
        message.error('请输入验证码');
      }
    } else {
      if(errorField.includes('pass_word') || errorField.includes('re_pass')) {
        message.error('请输入密码');
      }
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
      <div className='mb-[43px] text-center text-[#121212] text-[22px] font-semibold'>{step===0?'忘记密码':'修改密码'}</div>
      <Form
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {
          step === 0?
          <>
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
              className='mb-[0px]'
            >
              <Input size='large' suffix={
                countdown > 0 ? 
                <div className="text-[16px]">{countdown}</div> :
                <div onClick={sendPhone} className="text-primary cursor-pointer text-[16px]">验证码</div>
              } placeholder="请输入验证码" />
            </Form.Item>
          </> : 
          <>
            <Form.Item
              name="pass_word"
              rules={[{ required: true, message: '' }]}
              className='mb-[10px]'
            >
              <Input.Password size='large' placeholder="请输入修改密码" />
            </Form.Item>

            <Form.Item
              name="re_pass"
              rules={[{ required: true, message: '' }]}
              className='mb-[0px]'
            >
              <Input.Password size='large' placeholder="再次输入修改密码" />
            </Form.Item>
          </>
        }
        
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='mt-[70px] mb-[0]'>
          <Button type="primary" className={`w-[85px] h-[40px] text-[16px] ${style.btnBg}`} htmlType="submit">
            {step === 0?'下一步':'确定'}
          </Button>
        </Form.Item>
      </Form>
      
      
      {/* <IdentifyDialog ref={IdentifyDialogRef} handleIdentify={handleIdentify} /> */}
    </div>
  )
}

export default ResetPassword;