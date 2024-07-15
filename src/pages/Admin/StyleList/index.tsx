import { useEffect, useState } from 'react'
import { getCollectionList } from '@/service'
import { Tooltip, Table, Pagination, Tag, Image } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'rc-scrollbars';
import type { ColumnsType } from 'antd/es/table';


const StyleList = () => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [userTotal, setUserTotal] = useState(0)
  const [flag, setFlag] = useState(false)
  const [dataList, setDataList] = useState<any>([])

  useEffect(() => {
    getData()
  }, [flag])

  async function getData() {
    try {
      const data: any = {
        page_index: page.toString(),
        page_size: pageSize.toString(),
      }
      setLoading(true)
      const res = await getCollectionList(data)
      console.log(res);
      if(res.items) {
        res.items.forEach((i: any) => {
          i.style_img = arrayParse(i.style_img)
        })
      }
      setDataList(res.items)
      setUserTotal(res.total)
      setLoading(false)
    } catch (error) { setLoading(false)}
  }
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  function arrayParse(str: string) {
    try {
      return JSON.parse(str)
    } catch (error) {
      return []
    }
  }
  const columns: ColumnsType<any> = [
    // {
    //   title: '序号',
    //   render:(text: any, record: any, index: number)=>`${index+1}`,
    // },
    {
      title: '用户',
      key: 'nick_name',
      width: 200,
      render:(data: any)=> {
        return (
          <div className='flex'>{data.nick_name?data.nick_name:data.login_name} {[2, 8].includes(data.user_type)?<Tag color='#108ee9' className='ml-[5px]'>风格</Tag>: null} </div>
        )
      },
    },
    {
      title: '图片',
      key: 'style_img',
      width: 350,
      render:(data: any)=> {
        return (
          <Scrollbars style={{width: '350px', height: '100px'}} className=''>
            <div className='flex'>
              {
                data.style_img.map((i: any, index: number) => (
                  <div key={`${data.id}-${index}`} className='flex shrink-0 mr-[5px] w-[100px] h-[100px]'>
                    <Image width={100} height={100} className='object-contain' src={i} alt="" />
                  </div>
                ))
              }
            </div>
          </Scrollbars>
        )
      },
    },
    {
      title: '描述',
      key: 'ext_info',
      width: 100,
      render: (address) => (
        <Tooltip title={address}>
         <div className='whitespace-nowrap max-w-[100px] truncate'>{address}</div>
        </Tooltip>
      ),
      dataIndex: 'ext_info',
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 150,
      render: (val: any) => {
        return val ? moment(val).format('YYYY/MM/DD HH:mm:ss') : ''
      },
   },
  ]
  return (
    <div> 
    <div className='px-[30px] mt-[20px]'>
      <div className='bg-white rounded-[6px]'>
        <Table 
          rowKey={'id'}
          scroll={{ x: true }}
          onHeaderRow={() => {
            return {
              className: 'whitespace-nowrap'
            }
          }}
          pagination={false} 
          dataSource={dataList} 
          columns={columns} />
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

export default StyleList