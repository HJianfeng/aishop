import { ConfigProvider } from 'antd';
// import SideBar from './SideBar';
import { Outlet, useNavigate } from 'react-router-dom'
import { CanvasProvider } from '@/components/Canvas'
import logo from '@/assets/logo.png'

export default function LayoutCom() {
  const navigate = useNavigate();
  return (
    <ConfigProvider theme={{
       token: { colorPrimary: '#5C77F8' } 
      }}>
      <div className='min-h-[100vh]'>
        <div className='h-full bg-[#f9f9f9]'>
          <div className='w-full px-[15px]'>
            <div className='flex items-center py-[15px] w-full'>
              <div onClick={() => navigate('/')} className='relative cursor-pointer w-[120px]'>
                <img src={logo} alt="" />
              </div>
              <div className='text-[#AFAFAF] text-[14px] mt-[5px]'>数据看板</div>
            </div>
          </div>
          <CanvasProvider>
            <Outlet  />
          </CanvasProvider>
        </div>
      </div>
    </ConfigProvider>
)}