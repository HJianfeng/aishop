import React, { useState } from 'react';
import { Button, Form, Input, message, Select, Radio } from 'antd';

const TaobaoAuthError= () => {
  return (
  <div>
    <div className="text-[121212] truncate text-[20px] font-semibold mt-[7px]">授权登录操作失败啦！如果您使用的是子帐号，请按以下步骤操作后重新登录: </div>
    <div><img src='https://aishop-1304948377.cos.ap-shanghai.myqcloud.com/aisoup/necessary/other/AuthError.png' alt="" /></div>
    </div>
  )
}

export default TaobaoAuthError