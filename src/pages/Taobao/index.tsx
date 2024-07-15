import React, { useState } from 'react';
import { getUrlParams } from '@/utils';
import { useNavigate } from "react-router-dom";
import { setLocalStorage } from '@/utils'
import { useEffect } from 'react';


const Taobao = () => {
  const navigate = useNavigate();
  const urlParams = getUrlParams();

  const _key = { user_name: urlParams?.user_name, token: urlParams?.token,user_type:urlParams?.user_type, scores: urlParams?.scores,account_type: 'tb',daily_scores: urlParams?.daily_scores};
  setLocalStorage('user', _key)
  
  useEffect(() => {
    navigate('/fusion/workspace');
  }, []); // 空的依赖数组

const handleClick = () => {
    // 跳转到指定路由
    navigate('/fusion/workspace');
  };

    return (
    <div>
      <button onClick={handleClick}>正在加载...</button>
    </div>
  );
  
}

export default Taobao