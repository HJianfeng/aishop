import { ConfigProvider } from 'antd';
import LayoutHeader from './Header';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom'
import Style from './style.module.scss'
import { CanvasProvider } from '@/components/Canvas'
// import DingTalk from '@/assets/DingTalk.png'
import { LoginProvider } from '@/components/LoginContext'
import FontFaceObserver from 'fontfaceobserver'
import { fontList } from '@/components/Smear/helper'

export default function LayoutCom() {
  const cacheFont: string[] = []
  function loadFont(val: string) {
    if(!cacheFont.includes(val)) {
      const font = new FontFaceObserver(val)
      font.load().then(() => {
        cacheFont.push(val)
      }).catch((err: any) => {
        console.log(err);
      })
    }
  }
  function preLoadFont() {
    fontList.forEach(i => {
      loadFont(i.value)
    })
  }
  
  preLoadFont()

  return (
    <ConfigProvider theme={{
       token: { colorPrimary: '#5C77F8' } 
      }}>
      <LoginProvider>
        <div className='min-h-[100vh] flex'>
          {/* <div className='fixed z-10 left-0 top-0 h-full w-[270px] bg-white border-[#eee] border-r border-dashed'>
            <SideBar />
          </div> */}
          <div className='flex w-full'>
            {/* fixed z-10 left-0 top-0  */}
            <div className={`fixed z-10 left-0 top-0 h-full flex flex-shrink-0 w-[270px] bg-white`}>
              <SideBar />
            </div>
            <div className='h-full flex flex-shrink-0 w-[270px]'></div>
            <div className='flex flex-col flex-1 relative border-[#eee] border-l border-dashed bg-[#f9f9f9]'>
              <div className={Style.smearDialog} id="side-bar"></div>
              <LayoutHeader />
              <div className='flex flex-1'>
                <CanvasProvider>
                  <Outlet  />
                </CanvasProvider>
              </div>
            </div>
          </div>
          {/*<img src={DingTalk} className='fixed right-[10px] bottom-[10px] w-[100px] z-[101]' alt=""  />*/}
        </div>
      </LoginProvider>
    </ConfigProvider>
)}