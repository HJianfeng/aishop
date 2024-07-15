
import { useState, useImperativeHandle, forwardRef } from "react"
import { Input, Button, message, Modal } from 'antd'
import Identify from './Identify'
import style from './style.module.scss'
import { sendsmscode } from '@/service/index'


const IdentifyDialog = forwardRef((props: { handleIdentify: () => void }, ref: any) => {
  const [isOpenIdentify, setiIsOpenIdentify] = useState(false);
  const [inputIdentifyCode, setInputIdentifyCode] = useState('');
  const [identifyCode, setidentifyCode] = useState(randomNum())
  const [login_name, setLogin_name] = useState('');

  function toSendPhoneHttp() {
    if(inputIdentifyCode !== identifyCode) {
      message.error('验证码错啦！');
      resetCode()
      return
    }
    if(!login_name) return
    // TODO: 这里请求接口发送短信验证码
    sendsmscode({login_name}).then(res => {
      console.log(res);
      message.success('短信验证码发送成功');
      props.handleIdentify()
      switchOpen()
    })
  }
  function resetCode() {
    setidentifyCode(randomNum())
  }
  
  function randomNum(): string {
    return (Math.floor(Math.random()*(9999-1000))+1000).toString()
  }
  function switchOpen() {
    if(!isOpenIdentify) {
      setInputIdentifyCode('')
    }
    setiIsOpenIdentify(!isOpenIdentify);
  }
  function openDialog(login_name: string) {
    switchOpen()
    setLogin_name(login_name)
  }
  useImperativeHandle(ref, () => ({
    openDialog
  }))
  return (
    <Modal 
      width={400} closeIcon={null} okText="确定" footer={null}
      cancelText="取消" centered open={isOpenIdentify} onCancel={switchOpen}>
      <div className="flex">
        <Input maxLength={4} value={inputIdentifyCode} onChange={(event) => setInputIdentifyCode(event.target.value)} className="h-[48px] mr-[10px] text-[16px]" placeholder="请输入图形验证码" />
        <div className="cursor-pointer" onClick={() => {resetCode()}}>
          <Identify  identifyCode={identifyCode} />
        </div>
      </div>

      <div className="flex justify-center mt-[20px]">
        <Button onClick={switchOpen} className="mr-[10px]">取消</Button>
        <Button onClick={toSendPhoneHttp} type="primary" className={`${style.btnBg}`}>确定</Button>
      </div>
    </Modal>
  )
})

export default IdentifyDialog;