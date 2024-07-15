import React from 'react';
import { Button, Result } from 'antd';

const NotFound: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，您的页面未找到"
    extra={<Button href='/' type="primary">返回首页</Button>}
  />
);

export default NotFound;