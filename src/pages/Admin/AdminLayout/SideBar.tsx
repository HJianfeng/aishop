import { useNavigate, useLocation } from "react-router-dom";
import logo from '@/assets/logo.png'

const SideBar = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname
  
  const sideList: { label: string, url: string }[] = [
    { label: '数据统计', url: '/admin' }
  ]
  function goUrl(url: string) {
    navigate(url)
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className='w-full px-[15px]'>
        <div className='flex items-center py-[15px] w-full border-b border-[#DCDCDC]'>
          <div onClick={() => goUrl('/')} className='relative cursor-pointer w-[120px]'>
            <img src={logo} alt="" />
          </div>
          <div className='text-[#AFAFAF] text-[14px] mt-[5px]'>数据看板</div>
        </div>
      </div>
      <div className='flex-1'>
        <div className='text-[#999999] text-[14px] pl-[24px] mt-[15px] mb-[22px]'>管理后台</div>
      </div>
      <div className='px-[10px]'>
      {
        sideList.map((item, index) => {
          return (
            <div key={index} onClick={() => goUrl(item.url)} className={`${pathname === item.url?'bg-[#EFF1FB] text-[#6278DA]':'bg-white text-[#040404]'} py-[9px] rounded-[5px] flex items-center px-[32px] w-full cursor-pointer hover:bg-[#EFF1FB] hover:text-[#6278DA] group mb-[18px]`}>
              <div className='text-[14px] ml-[10px]'>{item.label}</div>
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

export default SideBar