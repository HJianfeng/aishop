// import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import TableCom from "./components/TableCom"

const StyleTool = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `大模型`,
      children: <TableCom type="1" />
    },
    {
      key: '2',
      label: `LORA`,
      children: <TableCom type="2" />
    },
    {
      key: '3',
      label: `Textual Inversion`,
      children: <TableCom type="3" />
    },
  ];

  return (
    <div style={{minHeight: 'calc(100vh - 74px)'}} className='flex justify-center'>
      <div className='w-[1000px]'>
        <Tabs defaultActiveKey="1" centered items={items} />
      </div>
    </div>
  )
}


export default StyleTool