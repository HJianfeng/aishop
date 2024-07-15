import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from 'react'
import Slogan from '@/components/Slogan'
import logo from '@/assets/logo.png'
import fusion from '@/assets/fusion.png'
import fusion_active from '@/assets/fusion_active.png'
import cutout from '@/assets/cutout.png'
import cutout_active from '@/assets/cutout_active.png'
import hd from '@/assets/hd.png'
import hd_active from '@/assets/hd_active.png'
import smear from '@/assets/smear.png'
import smear_active from '@/assets/smear_active.png'
import zoom from '@/assets/zoom.png'
import zoom_active from '@/assets/zoom_active.png'
import whiteBg from '@/assets/whiteBg.png'
import betaIcon from '@/assets/beta.png'
import { useSelector, useDispatch } from 'react-redux'
import { hideAllTooltip, setSmearDialog } from '@/store/toolSlice'
import { Modal, Checkbox } from 'antd'

const SideBar = () => {
  const container:any = useRef(null);
  const navigate = useNavigate();
  const pathname = useLocation().pathname
  // const user = getLocalStorage('user')
  // user?.user_type ===2 || user?.user_type === 8?'/fusion/workspace?dev=true':
  const dispatch = useDispatch()
  
  const hdPageTooltip = useSelector((state: any) => state.tool.hdPageTooltip)
  const repairPageTooltip = useSelector((state: any) => state.tool.repairPageTooltip)
  const cutoutPageTooltip = useSelector((state: any) => state.tool.cutoutPageTooltip)
  const smearPageTooltip = useSelector((state: any) => state.tool.smearPageTooltip)
  const fusionSmearDialog = useSelector((state: any) => state.tool.fusionSmearDialog)
  const sideList: { label: string, url: string, icon: string, activeIcon: string, afterIcon?:string }[] = [
    { label: '背景融合', url: '/fusion/workspace', icon: fusion, activeIcon: fusion_active },
    { label: '一键抠图', url: '/tool/cutout',icon: cutout, activeIcon: cutout_active, afterIcon: whiteBg },
    { label: '高清修复', url: '/tool/repair',icon: hd, activeIcon: hd_active },
    { label: '涂抹消除', url: '/tool/smear',icon: smear, activeIcon: smear_active },
    { label: '无损放大', url: '/tool/hd',icon: zoom, activeIcon: zoom_active },
  ]
  async function goUrl(url: string) {
    if(fusionSmearDialog) {
      const rejectNavigate = await dialogConfirm()
      if(rejectNavigate) {
        return
      }
      dispatch(setSmearDialog(false))
    }
    const map = [
      { url: '/tool/cutout', key: 'cutout' },
      { url: '/tool/hd', key: 'hd' },
      { url: '/tool/smear', key: 'smear' },
      { url: '/tool/repair', key: 'repair' },
    ]
    const curPage = map.find((i: any) => i.url === pathname)
    if(!curPage || url.indexOf(pathname) >= 0) {
      navigate(url)
      return
    }
    let locaData = !!localStorage.getItem(`${curPage.key}Tooltip`)

    let showTooltip = false;
    if(curPage.key === 'cutout') {
      showTooltip = cutoutPageTooltip
    } else if(curPage.key === 'hd') {
      showTooltip = hdPageTooltip
    } else if(curPage.key === 'smear') {
      showTooltip = smearPageTooltip
    } else if(curPage.key === 'repair') {
      showTooltip = repairPageTooltip
    }
    
    if(curPage.key && showTooltip && !locaData) {
      let checked = false;
      Modal.confirm({
        title: '提示',
        content: (<div className="relative">
          <div>你还没有下载处理完的结果，切换后内容将会清除哦～</div>
          <div className="absolute bottom-[-37px]"><Checkbox onChange={(e: any) => {checked = e.target.checked}}>不再提示</Checkbox></div>
        </div>),
        okText: '确定',
        centered: true,
        width: 420,
        cancelText: '取消',
        onOk() {
          if(checked) {
            localStorage.setItem(`${curPage.key}Tooltip`, '1')
          } else {
            localStorage.removeItem(`${curPage.key}Tooltip`)
          }
          navigate(url)
          dispatch(hideAllTooltip())
        },
        onCancel() {
          console.log(checked);
        },
      })
    } else {
      navigate(url)
    }
  }

  function dialogConfirm() {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        content: '关闭正在编辑的任务？',
        okText: '确定',
        centered: true,
        cancelText: '取消',
        onOk() {
          resolve(false)
        },
        onCancel() {
          resolve(true)
        },
      })
    })
  }
  return (
    <div className="flex flex-col relative w-[270px]">
      <div className='w-full px-[15px]'>
        <div className='flex items-center py-[15px] w-full border-b border-[#DCDCDC]'>
          <div onClick={() => goUrl('/')} className='relative cursor-pointer w-[120px]'>
            <img src={logo} alt="" />
            <img className="absolute w-[25px] right-[-9px] top-[0px]" src={betaIcon} alt="" />
          </div>
          <div className='text-[#AFAFAF] text-[14px] mt-[5px]'>素材小助手</div>
        </div>
      </div>
      <div ref={container} className="overflow-hidden relative flex flex-1 h-0 flex-col bg-white">
        <div>
          <div className='text-[#999999] text-[14px] pl-[24px] mt-[15px] mb-[22px]'>工具箱</div>
        </div>
        <div className='px-[10px]'>
        {
          sideList.map((item, index) => {
            return (
              <div key={index} onClick={() => goUrl(item.url)} className={`${item.url.indexOf(pathname) >= 0 ?'bg-[#EFF1FB] text-[#6278DA]':'text-[#040404]'} py-[9px] rounded-[5px] flex items-center px-[32px] w-full cursor-pointer hover:bg-[#EFF1FB] hover:text-[#6278DA] group mb-[18px]`}>
                <div className='w-[18px]'>
                  {
                    item.url.indexOf(pathname) >= 0?
                    <img src={item.activeIcon} alt="" /> :
                    <>
                      <img className='group-hover:hidden' src={item.icon} alt="" /> 
                      <img className='hidden group-hover:block' src={item.activeIcon} alt="" /> 
                    </>
                  }
                </div>
                <div className='text-[14px] ml-[10px]'>{item.label}</div>
                {
                  item.afterIcon?
                  <img className="w-[44px] ml-[10px]" src={item.afterIcon} alt="" /> : null
                }
              </div>
            )
          })
        }
        </div>
      </div>
      <Slogan container={container} />
    </div>
  )
}

export default SideBar