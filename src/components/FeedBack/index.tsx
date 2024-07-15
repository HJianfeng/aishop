import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, Table } from 'antd'
import { feedBackList } from '@/service'
import moment from 'moment'

const FeedBack = (props: any, ref: any) => {
  const [feedBackOpen, setFeedBackOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const pageSize = 40;
  function openDialog() {
    setPage(1)
    getFeedbackList()
    setFeedBackOpen(true);
  }

  useEffect(() => {
    getFeedbackList()
  }, [page])
  async function getFeedbackList() {
    try {
      const res = await feedBackList({ page_index: page.toString(), page_size: pageSize.toString() })
      setList(res.items)
      setTotal(res.total)
    } catch (error) {
      
    }
  }
  useImperativeHandle(ref, () => {
    return { openDialog }
  })

  const columns = [
    {
      title: '用户',
      dataIndex: 'login_name',
      key: 'login_name',
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 80
    },
    {
      title: '反馈',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: '时间',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (val: any) => {
        return val ? moment(val).format('YYYY/MM/DD HH:mm:ss') : ''
      }
    },
  ];
  return (
  <Modal 
    closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
    width={1000} okText="确定" footer={null}
    cancelText="取消" centered open={feedBackOpen} onCancel={() => setFeedBackOpen(false)}>
    <Table dataSource={list} columns={columns} pagination={{
      total, pageSize, onChange: (page, pageSize) => {setPage(page)}
      }} />
  </Modal>
  )
}

export default forwardRef(FeedBack)