

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { Tooltip, Select, Checkbox } from 'antd'
import { getUpscaleDetail } from '@/service'
import type { UpscaleProps } from '@/service'
import { DownloadOutlined } from '@ant-design/icons';
import Footer from './Components/Footer'
import ImgList from './Components/ImgList'
import moment from 'moment';

const DataDetail = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [flag, setFlag] = useState(false)
  const [userTotal, setUserTotal] = useState(0)
  const [dataList, setDataList] = useState<any>([])
  const [fusionAType, setFusionAType] = useState<any>('')
  const [is_download, setDownload] = useState<boolean>(false)
  const { login_name, accountType } = useParams()
  

  useEffect(() => {
    // 获取数据
    getData()
  }, [flag])

  async function getData() {
    try {
      const data: UpscaleProps = {
        page_index: page,
        page_size: pageSize,
        is_download: is_download?'true':'false',
      }
      if(login_name && login_name !== 'all') {
        data.login_name = login_name
      }
      if(accountType && accountType !== 'all') {
        data.account_type = accountType
      }
      if(fusionAType) {
        data.upscale = fusionAType
      }
      const res = await getUpscaleDetail(data)
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }

  function changeCurStyle(data: string) {
    setFusionAType(data)
    setFlag(!flag)
  }
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  function changeDownload(e: any) {
    setDownload(e.target.checked)
    setFlag(!flag)
  }
  function filterRender() {
    return (
      <div>
        <Select
          className='!w-[120px] mr-[18px]'
          value={fusionAType}
          placeholder='请选择'
          style={{ width: 120 }}
          onChange={(e) => {changeCurStyle(e || '')}}
          allowClear
          options={[
            {label: '全部', value: ''},
            {label: 'X2', value: 'X2'},
            {label: 'X4', value: 'X4'},
          ]}
        />
        <Checkbox  value={is_download} onChange={(e) => {changeDownload(e)}}>下载</Checkbox>
      </div>
    )
  }


  return (
    <div className='p-[50px]' style={{minHeight: 'calc(100vh - 66px)'}}>
      <div className='flex items-center'>
        <div className='flex-1 text-[24px] text-black font-medium mt-[14px]'>无损放大 {userTotal}</div>
        { filterRender() }
      </div>
      <div className='flex flex-wrap'>
          <ImgList 
            dataList={dataList}
            imgKey={{ mainImgKey: 'img_url', tbnImgKey: 'img_tbn_url' }}
            footer={(item: any) => (
              <div className='absolute flex items-center h-[30px] px-[4px] bottom-[10px] w-full'>
                <div className='flex-1'>
                  <div className=' flex'>
                    {
                      item.ext_info? 
                      <div className='bg-[#1677FF] flex items-center justify-center rounded-[4px] w-[20px] h-[20px] text-white text-[12px]'>{item.ext_info}</div>
                      :null
                    }
                    {
                      item.is_download? 
                      <div  className='bg-[#1677FF] text-white flex items-center justify-center rounded-[4px] ml-[5px]  w-[20px] h-[20px]'><DownloadOutlined /></div>
                      : null
                    }
                  </div>
                </div>
                <div>
                  <Tooltip 
                    arrow={false}
                    overlayClassName="bg-white"
                    overlayInnerStyle={{background: '#fff', color: '#333'}}
                    title={() => (<div>用户：{item.login_name}<br />{item.create_time?moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'):null}</div>

                    )}>
                    <div className='hidden  w-[20px] h-[20px] group-hover:flex bg-black  items-center justify-center rounded-[4px] text-white text-[12px] mr-[10px]'>INF</div>
                  </Tooltip>
                </div>
              </div>
            )}
          />
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