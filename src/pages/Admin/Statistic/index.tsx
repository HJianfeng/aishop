import { useEffect, useState, useMemo } from 'react'
import { getDailycount, getUserList, getReportCount } from '@/service'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Table, Pagination, Tag, Select, Checkbox, Tooltip } from 'antd';
import moneyIcon from '@/assets/money.svg'
import moment from 'moment';

const StatisticCom = () => {
  let listOrderby: any;
  try {
    const localData = localStorage.getItem('listOrderby')
    listOrderby = localData?JSON.parse(localData) : null;
  } catch (error) {
    
  }
  const defaultOrder = listOrderby?`${listOrderby.field}${listOrderby.order === 'descend'?' desc':''}`:''

  const [dailycount, setDailycount] = useState<any>({})
  const [reportData, setReportData] = useState<any>([])
  const [login_name, setLoginName] = useState('')
  const [order_by, setOrderby] = useState(defaultOrder)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [userTotal, setUserTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState(false)
  const [userList, setUserList] = useState<any>([])
  const [accountType, setAccountType] = useState<string>('all')
  const [is_buy, setIs_buy] = useState<string>('')
  
  const navigate = useNavigate();

  useEffect(() => {
    getCurData()
    getReport()
  }, [accountType])

  const reportDataCur = useMemo(() => {
    return reportData.find((i:any) => accountType === i.count_type) || reportData[0]
  }, [accountType, reportData])
  async function getCurData() {
    try {
      const data = {
        account_type: accountType || 'all'
      }
      const res = await getDailycount(data)
      setDailycount(res)
    } catch (error) {}
  }
  async function getReport() {
    try {
      const data = {
        account_type: accountType || 'all'
      }
      const res = await getReportCount(data)
      setReportData(res)
    } catch (error) {}
  }


  async function getUser() {
    try {
      const data: any = {
        login_name,
        total_score: -1,
        page_index: page,
        page_size: pageSize,
        account_type: accountType || 'all',
        is_buy: is_buy
      }
      if(order_by) {
        data.order_by = order_by
      }
      setLoading(true)
      const res = await getUserList(data)
      console.log(res);
      
      setUserList(res.items)
      setUserTotal(res.total)
      setLoading(false)
    } catch (error) { setLoading(false)}
  }
  useEffect(() => {
    getUser()
  }, [flag, accountType])

  function handelReset() {
    setLoginName('')
    setPage(1)
    setPageSize(20)
    setFlag(!flag)
  }
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  function formatNumber(val?: number | string) {
    if(!val) return 0
    return String(val).replace(/\B(?=(\d{3})+$)/g, ',')
  }
  // const allCreateImg = useMemo(() => {
  //   const key = ['inpaint_count', 'fusion_count', 'cutout_count', 'hd_count']
  //   let t_sum = 0;
  //   let y_sum = 0;
  //   key.forEach(item => {
  //     t_sum += (Number(dailycount[`${item}_t`]) || 0)
  //     y_sum += (Number(dailycount[`${item}_y`]) || 0)
  //   })
  //   return { t_sum, y_sum }
  // }, [dailycount])
  const StatisticList = [
    { label: '风格制作', value: dailycount.devmodel_count_t, y_value: dailycount.devmodel_count_y, onclick: () => {toDetail('all', 'model')} },
    { label: '背景融合', value: dailycount.fusion_count_t, y_value: dailycount.fusion_count_y ,onclick: () => {toLink('all', '/admin/fusionDetail')} },
    { label: '一键抠图', value: dailycount.cutout_count_t, y_value: dailycount.cutout_count_y ,onclick: () => {toOtherDetail('all','cutout', '/admin/otherdetail')}},
    { label: '高清修复', value: dailycount.hd_count_t, y_value: dailycount.hd_count_y ,onclick: () => {toOtherDetail('all','hd', '/admin/otherdetail')} },
    { label: '涂抹消除', value: dailycount.inpaint_count_t, y_value: dailycount.inpaint_count_y,onclick: () => {toOtherDetail('all','inpaint', '/admin/otherdetail')} },
    { label: '图文合并', value: dailycount.merge_count_t, y_value: dailycount.merge_count_y, onclick: () => {toOtherDetail('all', 'merge', '/admin/otherdetail')} },
    { label: '无损放大', value: dailycount.upscale_count_t, y_value: dailycount.upscale_count_y, onclick: () => {toLink('all','/admin/upscaleDetail')} },
    { label: 'AI文案', value: dailycount.ai_count_t, y_value: dailycount.ai_count_y, onclick: () => {toLink('all','/admin/aiTextDetail')} },
    { label: '喜欢', value: dailycount.favorite_count_t, y_value: dailycount.favorite_count_y, onclick: () => {toDetail('all', 'favorite')} },
    { label: '不喜欢', value: dailycount.unlike_count_t, y_value: dailycount.unlike_count_y, onclick: () => {toDetail('all', 'not_favorite')} },
    // { label: '用户', value: dailycount.user_count_t, y_value: dailycount.user_count_y },
    // { label: '生产图片', value: allCreateImg.t_sum, y_value: allCreateImg.y_sum },
  ]
 
  const columns = [
    {
      title: '序号',
      render:(text: any, record: any, index: number)=>`${index+1}`,
    },
    {
      title: '用户',
      key: 'user_nick',
      width: 300,
      render:(data: any)=> {
        return (
          <div className='flex'>
            {data.user_nick?data.user_nick:data.login_name} {[2, 8].includes(data.user_type)?<Tag color='#108ee9' className='ml-[5px]'>风格</Tag>: null} 
            {
              data.total_fee > 0?
                <div className="flex shrink-0">
                  <Tooltip title={() => (<div>
                    {data.canal}：{data.pay_type==1?'微信':'支付宝'}：{data.total_fee} 
                  </div>)}>
                    <img className='w-[16px] h-[16px]' src={moneyIcon} alt="" />
                  </Tooltip>
                </div>
              : null
            }
          </div>
        )
      },
    },
    {
      title: '总使用',
      dataIndex: 'total_use',
      key: 'total_use',
      ...sortOrderOptions('total_use')
    },
    {
      title: '剩余积分',
      dataIndex: 'current_score',
      key: 'current_score',
      ...sortOrderOptions('current_score')
    },
    {
      title: '下载',
      dataIndex: 'download',
      key: 'download',
      ...sortOrderOptions('download'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toDetail(row.login_name, 'download')}} className='text-primary cursor-pointer'>{row.download}</div>
      }
    },
    {
      title: '背景融合',
      dataIndex: 'fusion',
      key: 'fusion',
      ...sortOrderOptions('fusion'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toLink(row.login_name, '/admin/fusionDetail')}} className='text-primary cursor-pointer'>{row.fusion}</div>
      }
    },
    {
      title: '一键抠图',
      dataIndex: 'cutout',
      key: 'cutout',
      ...sortOrderOptions('cutout'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toOtherDetail(row.login_name, 'cutout', '/admin/otherdetail')}} className='text-primary cursor-pointer'>{row.cutout}</div>
      }
    },
    {
      title: '高清/通用',
      dataIndex: 'hd_clean',
      key: 'hd_clean',
      ...sortOrderOptions('hd_clean'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toOtherDetail(row.login_name, 'hd', '/admin/otherdetail')}} className='text-primary cursor-pointer'>{row.hd_clean}</div>
      }
    },
    {
      title: '高清/人物',
      dataIndex: 'hd_face',
      key: 'hd_face',
      ...sortOrderOptions('hd_face'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toOtherDetail(row.login_name, 'hd', '/admin/otherdetail')}} className='text-primary cursor-pointer'>{row.hd_face}</div>
      }
    },
    {
      title: '无损放大',
      dataIndex: 'upscale',
      key: 'upscale',
      ...sortOrderOptions('upscale'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toLink(row.login_name, '/admin/upscaleDetail')}} className='text-primary cursor-pointer'>{row.upscale}</div>
      }
    },
    {
      title: '涂抹消除',
      dataIndex: 'inpaint',
      key: 'inpaint',
      ...sortOrderOptions('inpaint'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toOtherDetail(row.login_name, 'inpaint', '/admin/otherdetail')}} className='text-primary cursor-pointer'>{row.inpaint}</div>
      }
    },
    {
      title: 'AI文案',
      dataIndex: 'ai_gpt',
      key: 'ai_gpt',
      ...sortOrderOptions('ai_gpt'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toLink(row.login_name, '/admin/aiTextDetail')}} className='text-primary cursor-pointer'>{row.ai_gpt}</div>
      }
    },
    {
      title: '喜欢',
      dataIndex: 'favorite',
      key: 'favorite',
      ...sortOrderOptions('favorite'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toDetail(row.login_name, 'favorite')}} className='text-primary cursor-pointer'>{row.favorite}</div>
      }
    },
    {
      title: '不喜欢',
      dataIndex: 'un_like',
      key: 'un_like',
      ...sortOrderOptions('un_like'),
      render: (data: any, row: any) => {
        return <div onClick={() => {toDetail(row.login_name, 'not_favorite')}} className='text-primary cursor-pointer'>{row.un_like}</div>
      }
    },
    // {
    //   title: '风格',
    //   dataIndex: 'dev_model',
    //   key: 'dev_model',
    //   ...sortOrderOptions('dev_model'),
    // },
    {
       title: '注册时间',
       dataIndex: 'create_time',
       key: 'create_time',
       render: (val: any) => {
         return val && val!='0001-01-01T00:00:00Z'  ? moment(val).format('MM/DD|HH:mm') : '暂无'
       },
       width: 150,
       ...sortOrderOptions('create_time')
    },
    {
       title: '最后使用',
       dataIndex: 'use_time',
       key: 'use_time',
       render: (val: any) => {
         return val && val!='0001-01-01T00:00:00Z' ? moment(val).format('MM/DD|HH:mm') : '暂无'
       },
       width: 150,
       ...sortOrderOptions('use_time')
    }
  ]
  function sortOrderOptions(field: string) {
    return {
      sorter: true,
      showSorterTooltip: false,
      defaultSortOrder: listOrderby?.field === field?listOrderby.order||undefined:undefined,
    }
  }
  function tableOnChange(p: any, f: any, s:any) {
    if(s.field) {
      if(s.order) {
        localStorage.setItem('listOrderby', JSON.stringify( {field: s.field, order: s.order}))
        setOrderby(`${s.field}${s.order === 'descend'?' desc':''}`)
      } else {
        localStorage.removeItem('listOrderby')
        setOrderby('')
      }
      setFlag(!flag)
    }
  }
  function toDetail(login_name: string, type: string) {
    if(!login_name || !type ) return
    window.open(`/admin/detail/${type}/${accountType}/${login_name}`,'_blank')
  }
  function toLink(login_name: string, url: string) {
    if(!login_name) return
    window.open(`${url}/${login_name}/${accountType}`,'_blank')
  }
  function toOtherDetail(login_name: string, type: string, url: string) {
    if(!login_name) return
    window.open(`${url}/${type}/${accountType}/${login_name}`,'_blank')
  }
  function handleCheck(e: any) {
    setIs_buy(e.target.checked?'true':'')
    setFlag(!flag)
  }
  return (
    <div className="py-[20px]">
      <div className='flex px-[20px] mb-[20px]'>
        <div className='flex flex-1'>
          <div className='flex items-center mr-[20px]'>
            <div className='text-[#818181] mr-[10px]'>注册用户</div>
            <div className='text-[22px] text-[#000] font-medium'>{reportDataCur?.user_count}</div>
          </div>
          <div className='flex items-center mr-[20px]'>
            <div className='text-[#818181] mr-[10px]'>使用次数</div>
            <div className='text-[22px] text-[#000] font-medium'>{reportDataCur?.use_count}</div>
          </div>
          <div className='flex items-center mr-[20px]'>
            <div className='text-[#818181] mr-[10px]'>生产图片</div>
            <div className='text-[22px] text-[#000] font-medium'>{reportDataCur?.img_count}</div>
          </div>
        </div>
        <Select
          style={{ width: 120 }}
          value={accountType}
          onChange={(val) => setAccountType(val)}
          options={[
            { label: '全部数据', value: 'all' },
            { label: '正式版', value: 'normal' },
            { label: '淘宝版', value: 'tb' },
            { label: '速销易', value: 'sxy' },
            { label: '活动版', value: 'canal' },
          ]}
        />
      </div>
      <div className='px-[10px]'>
        <div className='flex w-full overflow-x-auto '>
          {
            StatisticList.map((item, index) => (
              <div key={item.label} className='flex-1 flex justify-center'>
                <div onClick={() => item.onclick?.()} style={{cursor: 'pointer'}} className='bg-white border border-[#F5F5F5] w-[120px] p-[5px] rounded-[5px] flex flex-col justify-center items-center'>
                  <div className='mb-[10px] text-[#818181] text-[14px]'>{item.label}</div>
                  <div className='text-[24px] font-medium mb-[10px]'>{formatNumber(item.value)}</div>
                  <div className='mb-[10px] text-[#818181] text-[14px]'>昨天：{formatNumber(item.y_value)}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className='px-[30px] mt-[20px]'>
        <div className='bg-white rounded-[6px]'>
          <div className='flex p-[24px] justify-between'>
            <div className='flex items-center'>
              <div className='text-[14px]'>用户：</div>
              <Input className='w-[270px]' value={login_name}  onChange={(e: any) => setLoginName(e.target.value)} placeholder="请输入" />
              <Checkbox className='ml-[20px]' onChange={handleCheck}>支付</Checkbox>
            </div>
            <div>
              <Button onClick={handelReset}>重置</Button>
              <Button onClick={() => setFlag(!flag)} className='ml-[20px]' type='primary'>查询</Button>
            </div>
          </div>
          <Table 
            rowKey={'login_name'}
            scroll={{ x: true }}
            onHeaderRow={() => {
              return {
                className: 'whitespace-nowrap'
              }
            }}
            onChange={tableOnChange} 
            pagination={false} dataSource={userList} columns={columns} />
          {
            userTotal > 0?
              <div className='p-[10px] flex justify-end'>
                <Pagination 
                  onChange={changePage}
                  pageSize={pageSize}
                  current={page} 
                  total={userTotal} 
                  showQuickJumper
                  showTotal={() => `总共 ${userTotal} 条`} />
              </div> : 
              null
          }
          
        </div>
      </div>
    </div>
  )
}

export default StatisticCom