
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Tooltip, Checkbox, Table } from 'antd'
import { getAiTextDetail, getBpointDetailCount } from '@/service'
import ImgList from './Components/ImgList'
import Footer from './Components/Footer'
import moment from 'moment';

const DataDetail = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [flag, setFlag] = useState(false)
  const [userTotal, setUserTotal] = useState(0)
  const { type, login_name, accountType } = useParams()
  const [dataList, setDataList] = useState<any>([])
  const [countData, setCountData] = useState<any>()
  const [onlyDownload, setOnlyDownload] = useState<boolean>(false)
  const [fusionAType, setFusionAType] = useState<any>('')


  useEffect(() => {
    getData()
    getConutData()
  }, [flag])

  function getParams() {
    const obj: any = {
    }
   
    if(login_name && login_name !== 'all') {
      obj.login_name = login_name
    }
    if(accountType && accountType !== 'all') {
      obj.account_type = accountType
    }
    return obj
  }
  async function getData() {
    try {
      const data: any = {
        page_index: page,
        page_size: pageSize,
        ...getParams()
      }
      const res = await getAiTextDetail(data)
      res?.items.forEach((i:any) => {
        try {
          i.param = JSON.parse(i.param)
        } catch (error) {  }
      })
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }

  async function getConutData() {
    try {
      const data: any = {
        action_type: "tool", 
        action: ["gpt_copy"],
        ...getParams()
      }
      const res = await getBpointDetailCount(data)
      setCountData(res)
    } catch (error) {
      
    }
  }

  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  const columns = [
    {
      title: '用户',
      key: 'id',
      width: 200,
      dataIndex: 'login_name',
    },
    {
      title: '产品',
      key: 'main1',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.param.main1} </div>
        )
      },
    },
    {
      title: '类目',
      key: 'main2',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.param.main2} </div>
        )
      },
    },
    {
      title: '功能/成分',
      key: 'minor3',
      width: 200,
      render:(data: any)=> {
        const { minor3, minor2 }: any = data.param
        const a = minor3 && minor2 ? '/':''
        const text = `${minor3}${a}${minor2}`
        return (
          <div className='flex'>{text}</div>
        )
      },
    },
    {
      title: '加强',
      key: 'keypoint ',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{['功能', '成分'].includes(data.param.keypoint)?'是':'否'} </div>
        )
      },
    },
    {
      title: '用途/ 产地',
      key: 'minor1',
      width: 200,
      render:(data: any)=> {
        const { minor1, minor4 }: any = data.param
        const a = minor1 && minor4 ? '/':''
        const text = `${minor1}${a}${minor4}`
        return (
          <div className='flex'>{text}</div>
        )
      },
    },
    {
      title: '加强',
      key: 'keypoint ',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{['用途', '产地'].includes(data.param.keypoint)?'是':'否'} </div>
        )
      },
    },
    {
      title: '辅助提示词',
      key: 'assist1',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.param.assist1} </div>
        )
      },
    },
    {
      title: '语气',
      key: 'tone',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.param.tone} </div>
        )
      },
    },
    {
      title: '长短',
      key: 'solgan_len',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.param.solgan_len} </div>
        )
      },
    },
    {
      title: '结果',
      key: 'result',
      width: 500,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.result} </div>
        )
      },
    },
    {
      title: '复制次数',
      key: 'copy_count',
      width: 200,
      dataIndex: 'copy_count',
    },
    {
      title: '时间',
      key: 'create_time',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{moment(data.create_time).format('YYYY-MM-DD HH:mm:ss')} </div>
        )
      },
    },
  ]
 
  return (
    <div className='p-[50px]' style={{minHeight: 'calc(100vh - 66px)'}}>
      <div className='flex items-center'>
        <div className='flex-1 flex text-[24px] text-black font-medium mt-[14px]'>
          <div className='mr-[20px]'>AI文案 {userTotal}</div>
          <div className='mr-[20px]'>复制次数 {countData}</div>
        </div>
      </div>
      <div className='flex flex-wrap'>
         <Table 
            rowKey={'id'}
            scroll={{ x: true }}
            onHeaderRow={() => {
              return {
                className: 'whitespace-nowrap'
              }
            }}
            pagination={false} dataSource={dataList} columns={columns} />
      </div>
      <Footer 
        userTotal={userTotal}
        changePage={changePage}
        page={page} 
        pageSize={pageSize}  />
    </div>
  )
}

export default DataDetail