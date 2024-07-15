import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Pagination } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { getFusionDetailDownload } from '@/service'
import ImgList from './ImgList'
import { Scrollbars } from 'rc-scrollbars';

const ImgInfo = (data: any, ref: any) => {
  const [id, setId] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [flag, setFlag] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgInfo, setImgInfo] = useState([]);
  const [imgTotal, setTotal] = useState(0)
  const [accountType, setAccountType] = useState('')

  function openDialog(item: any,at: string) {
    setId(item.id)
    setPage(1)
    setPageSize(30)
    setFlag(!flag)
    setIsModalOpen(true)
    setAccountType(at)
  }
  useEffect(() => {
    // 获取数据
   if(id) getData()
  }, [flag])
  async function getData() {
    try {
      const data = {
        page_index: page,
        page_size: pageSize,
        id: id,
        account_type: accountType
      }
    
      const res = await getFusionDetailDownload(data)
      console.log(res);
      setImgInfo(res.items || [])
      setTotal(res.total)
    } catch (error) {
      
    }
  }

  useImperativeHandle(ref, () => ({
    openDialog
  }))
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  return (
    <Modal 
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />}
      width={600}
      footer={null}>
        <Scrollbars style={{ height: '70vh'}}>
          <div className='flex flex-wrap'>
            <ImgList 
              dataList={imgInfo}
              imgKey={{ mainImgKey: 'img_url', tbnImgKey: 'img_url' }}
            />
          </div>
      </Scrollbars>
      <Pagination 
        onChange={changePage}
        pageSize={pageSize}
        current={page} 
        total={imgTotal} 
        showQuickJumper
        showTotal={() => `总共 ${imgTotal} 条`} />

  </Modal>
  )
}
export default forwardRef(ImgInfo)