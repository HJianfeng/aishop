import { ConfigProvider } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'
import { CanvasProvider } from '@/components/Canvas'
import UserInfo from '../Layout/UserInfo'
import logo from '@/assets/logo.png'
import DingTalk from '@/assets/DingTalk.png'

export default function LayoutCom() {
  const navigate = useNavigate();
  return (
    <ConfigProvider theme={{
       token: { colorPrimary: '#5C77F8' } 
      }}>
      <div className=''>
        {/* <img src={DingTalk} className='fixed right-[10px] bottom-[10px] w-[100px] z-[101]' alt=""  />*/}
        <div className='h-full bg-[#f9f9f9] w-full min-w-[1280px] min-h-[100vh]'>
          <div className='flex items-center w-full px-[15px] py-[15px] '>
            <div className='flex-1 flex items-center w-full'>
              <div onClick={() => navigate('/')} className='relative cursor-pointer w-[120px]'>
                <img src={logo} alt="" />
              </div>
              <div className='text-[#AFAFAF] text-[14px] mt-[5px]'>风格工具</div>
            </div>

            <div onClick={() => {navigate('/model/style')}} className="cursor-pointer  justify-center rounded-full border-[2px] border-[#EAECF6] h-[44px] px-[20px] flex items-center mr-[10px] text-[14px]">
              <span className='text-[14px] text-[#121212] font-semibold'>我的模型库</span>
            </div>
            <UserInfo />
          </div>
          <CanvasProvider>
            <Outlet  />
          </CanvasProvider>
        </div>
      </div>
    </ConfigProvider>
)}