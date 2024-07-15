import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate ,useLocation} from "react-router-dom";
// utils
import { isLogin } from '@/utils/location'
import { getLocalStorage } from '@/utils'
import { checktoken, autologin } from '@/service'
import { setLocalStorage } from '@/utils'
// style
import style from './style.module.scss'
// img
import leftIcon from '@/assets/index_left.png'
import rightIcon from '@/assets/index_right.png'
import logo from '@/assets/logo.png'
import smIcon from '@/assets/index_sm_img.png'
import index_1 from '@/assets/index_1.png'
import index_2 from '@/assets/index_2.png'
import index_3 from '@/assets/index_3.png'
import index_4 from '@/assets/index_4.png'
import index_5 from '@/assets/index_5.png'
import lineIcon from '@/assets/line.png'
import gou from '@/assets/gou.png'
import beta from '@/assets/beta.png'

const REACT_APP_MODE = process.env.REACT_APP_MODE
const Home: React.FC = () => {

  const location = useLocation();
  const [curImg, setCurImg] = useState(0)
  const navigate = useNavigate();
  const imgArr = [index_1, index_2, index_3, index_4, index_5]
  const startTask = async () => {
      const params = new URLSearchParams(location.search); // 获取地址栏参数
      const from = params.get('from') || ''; 
      if (from==''){
        navigate('/fusion/workspace');
      }
      else{
        navigate('/fusion/workspace?from='+from);
      }
    // try {
    //   const user = getLocalStorage('user')
    //   if(!user || !user.token) {
    //     throw new Error()
    //   }
    //   const res = await checktoken({ token: user.token });
    //   if(!res || res === 'false') {
    //     throw new Error()
    //   }
    //   if(isLogin()) {
    //     navigate('/fusion/workspace');
    //   } else {
    //     loginRef.current?.showModal()
    //   }
    // } catch (error) {
    //   loginRef.current?.showModal()
    // }
  }

  useEffect(() => {
    if(REACT_APP_MODE === 'channel') {
      if(isLogin()) {
        navigate('/fusion/workspace');
      }
    }
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurImg((val: number) => {
        return val + 1 < 5 ? val + 1 : 0;
      })
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  })
  const footTip = ['背景融合','一键抠图', '高清处理', '涂抹消除', '尺寸扩展']
  return (
    <div className="flex flex-col bg-[#F9F9F9] min-w-[1100px] w-full min-h-[100vh] py-[27px] px-[80px]">
      <div className='flex items-center'>
        <div className="flex flex-1 text-[24px] items-center">
          <div className='w-[170px] relative'>
            <img src={logo} alt="" />
            <img className='absolute rounded-[4px] right-[-20px] top-[5px] w-[33px]' src={beta} alt="" />
          </div>
          <div className='w-[1px] h-[20px] bg-[#979797] mx-[28px]'></div>
          <div className='text-[#121212] font-semibold text-[20px]'>AI速配</div>
        </div>
        <div className="text-[#D3D3D3] text-[16px]">玩得转实验室</div>
      </div>
      <div className='flex flex-col rounded-[20px] px-[60px] py-[37px] mt-[19px] flex-1 bg-white border border-[#E5E5E5]'>
        <div className='text-[#484848] text-[24px] flex'>
          <div className='w-[19px]'><img src={leftIcon} alt="" /></div>
          <span className='mx-[16px]'>AI图片生成利器</span>
          <div className='w-[19px]'><img src={rightIcon} alt="" /></div>
        </div>
        <div className='flex mt-[51px]'>
          <div className='flex-1 mt-[20px]'>
            <div className="text-[#121212] text-[72px] small:text-[60px] font-semibold">智能创造一触即达</div>
            <div className='mt-[30px] mr-[21px] mb-[56px] text-[#818181] text-[24px]'
              >我们的AI助手为您的图片生成提供超乎想象的低成本和高质量，操作起来如鱼得水</div>
            <Button onClick={() => startTask()} className={style.startBtn}>开始使用</Button>
          </div>
          <div className='relative w-[379px] rounded-[10px]'>
            <img className='absolute -bottom-[48px] left-[65px] w-[79px]' src={lineIcon} alt="" />
            <div className='absolute -bottom-[56px] -left-[90px] w-[201px]'>
              <img src={smIcon} alt="" />
            </div>
            <img src={imgArr[curImg]} alt="" />
          </div>
        </div>
        <div className='flex-1'></div>
        <div className='flex items-center mt-[80px] justify-center'>
          {
            footTip.map((i, index) => (
              <div key={i} className={`flex border-[#D3D3D3] h-[23px] items-center text-[#A8A8A8] ${index !== 0? 'border-l ml-[55px] pl-[55px]' : ''}`}>
                <img className='w-[16px] mr-[4px]' src={gou} alt="" />
                <div className='text-[16px] small:text-[13px]'>{i}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home;
