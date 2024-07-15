import { useRef, useState, useEffect } from 'react'

import RecordList from '@/components/RechargeScore/RecordList'
import { Dropdown, Modal, message } from 'antd'
import type { MenuProps } from 'antd';
import { removeLocalStorage, getLocalStorage } from '@/utils'
import EditPassword from '@/components/LoginDialog/EditPassword'
import { logout } from '@/service'
import { useNavigate } from "react-router-dom";
import avatar from '@/assets/avatar.png'
import vipIcon from '@/assets/vip.svg'

const REACT_APP_MODE = process.env.REACT_APP_MODE
export default function UserInfo() {

  const navigate = useNavigate();
  const loginRef: React.MutableRefObject<any> = useRef(null);
  const recordListRef: React.MutableRefObject<any> = useRef(null);
  const [userInfo, setUserInfo] = useState<any>()
  useEffect(() => {
    setUserInfo(getLocalStorage('user') || {})
  }, []);
  function changePwd() {
    loginRef.current.showModal()
  }

  function handleLogout() {
    Modal.confirm({
      title: '提示',
      content: '是否确定要退出登录？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        logout().then(() => {}).catch(() => {})
        removeLocalStorage('user')
        navigate('/')
        message.success('退出成功');
      },
      onCancel() {},
    })
  }
  let items: MenuProps['items'] = [
    {
      key: '0',
      disabled: true,
      label: (
        <div className='whitespace-nowrap cursor-auto text-center tect-[#D3D3D3]'>{userInfo?.user_name}</div>
      ),
    },
    {
      key: '3',
      label: (
        <div 
          className='w-[95px] whitespace-nowrap text-center text-[#585656]' 
          onClick={() => {recordListRef.current?.openDialog();}}>算力记录</div>
      ),
    },
  ]
  if(REACT_APP_MODE !== 'ali') {
    items = items.concat([
      {
        key: '1',
        label: (
          <div className='w-[95px] whitespace-nowrap text-center text-[#585656]' onClick={changePwd}>修改密码</div>
        ),
      },
      { type: 'divider', style: {backgroundColor: '#979797'} },
      {
        key: '2',
        label: (
          <div onClick={handleLogout} className='text-center text-[#585656]'>退出</div>
        ),
      },
    ])
  }
  return (
    <div>
      <Dropdown disabled={REACT_APP_MODE === 'channel'} trigger={['click']} menu={{ items, style: {padding: '6px 9px'} }}>
        <div className='rounded-full relative w-[44px] h-[44px] flex justify-center items-center border-[2px] cursor-pointer border-[#EAECF6]'>
          <img className='w-[28px] h-[26px]' src={avatar} alt="" />
          {
            userInfo?.is_vip?
            <img className='w-[28px] right-[-18px] top-[-4px] absolute' src={vipIcon} alt="" />
            :null
          }
        </div>
      </Dropdown>
      <EditPassword ref={loginRef} />
      <RecordList ref={recordListRef} />
  </div>
  )
}