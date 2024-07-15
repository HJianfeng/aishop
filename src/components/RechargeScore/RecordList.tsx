import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { orderList } from '@/service'
import { Modal, Table, message, Pagination } from 'antd'
import moment from 'moment'

const RecordList = (prop: any, ref: any) => {
  const [isOpen, setisOpen] = useState(false);
  const [page_index, setPage] = useState(1);
  const [page_size, setPageSize] = useState(30);
  const [orderListData, setOrderList] = useState([]);
  const [flag, setFlag] = useState(false)
  const [total, setTotal] = useState(0)

  function openDialog() {
    setisOpen(true);
    setPage(1)
    getOrderList()
  }
  useEffect(() => {
    getOrderList()
  }, [flag])
  useImperativeHandle(ref, () => {
    return { openDialog }
  })
  async function getOrderList() {
    try {
      const data = {
        page_index: page_index.toString(),
        page_size: page_size.toString()
      }
      const res = await orderList(data)
      setOrderList(res.items)
      setTotal(res.total)
    } catch (error: any) {
      if(!error || error.code !== 401) {
        message.error(error?.message)
      }
    }
  }

  const columns = [
    {
      title: '类型',
      key: 'packageName',
      width: 130,
      render:(data: any)=> {
        return (
          <div>{data.package_name}</div>
        )
      },
    },
    {
      title: '算力数值',
      key: 'scores',
      width: 100,
      render:(data: any)=> {
        return (
          <div>{data.scores}</div>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      showSorterTooltip: false,
      key: 'create_time',
      render: (val: any) => {
        return val ? moment(val).format('YYYY/MM/DD HH:mm:ss') : ''
      },
      width: 200
    },
    {
      title: '算力状态',
      key: 'status',
      width: 230,
      render:(data: any)=> {
        let text  = '';
        if(data.status === 1) {
          text = '已失效'
        } else if(data.status === 2) {
          text = '已用完'
        } else {
          const diff = moment(data.exp_time).valueOf() - moment().valueOf()
          text = `剩余${Math.ceil(moment.duration(diff, 'milliseconds').asDays()) || 1}天` 
        }
        return (
          <div>{`${data.scores}/${data.orig_scores}`} {text}</div>
        )
      },
    },
  ]

  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  return (
  <Modal 
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    width={730} okText="确定" footer={null}
    cancelText="取消" centered open={isOpen} onCancel={() => setisOpen(false)}>
    <div className={total > page_size?'':'pb-[20px]'}>
      <div className='text-center font-semibold text-[16px] mb-[25px]'>订单记录</div>
      <div>
        <Table scroll={{ y: 300 }} pagination={false} dataSource={orderListData} columns={columns} />
        {
          total > page_size?
            <div className='p-[10px] mt-[10px] flex justify-end'>
              <Pagination 
                onChange={changePage}
                pageSize={page_size}
                current={page_index} 
                total={total} 
                showTotal={() => `总共 ${total} 条`} />
            </div> : 
            null
          }
      </div>
    </div>
  </Modal>
  )
}

export default forwardRef(RecordList);