import {  Pagination, Button  } from 'antd'
import {  useNavigate } from 'react-router-dom'

interface Props {
  userTotal: number
  pageSize: number
  page: number
  changePage: (page: number, pageSize: number) => void
}
const DetailFooter = (options: Props) => {
  const { userTotal, pageSize, page, changePage } = options
  const navigate = useNavigate();
  return (
    <div>
      {
        userTotal > 0?
          <div className='p-[10px] flex justify-center'>
            <Pagination 
              onChange={changePage}
              pageSize={pageSize}
              current={page} 
              total={userTotal} 
              showQuickJumper
              showTotal={() => `总共 ${userTotal} 条`} />
          </div> : 
          <div className='text-center'>
          </div>
      }
    </div>
  )
}
export default DetailFooter