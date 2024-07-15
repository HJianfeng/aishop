

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { Tooltip, Select } from 'antd'
import { getFusionDetail, getStyleCountList } from '@/service'
import type { FusionProps } from '@/service'
import { DownloadOutlined } from '@ant-design/icons';
import Footer from './Components/Footer'
import ImgList from './Components/ImgList'
import smearImg from '@/assets/smear_img.png'
import ImgDialog from './Components/ImgDialog';
import moment from 'moment';

const DataDetail = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [flag, setFlag] = useState(false)
  const [userTotal, setUserTotal] = useState(0)
  const { login_name, accountType } = useParams()
  const [dataList, setDataList] = useState<any>([])
  const [styleListData, setStyleListData] = useState<any>([])
  const [curStyle, setCurStyle] = useState<any>('')
  const [fusionAType, setFusionAType] = useState<any>('')
  
  const imgInfoRef:any = useRef()

  useEffect(() => {
    getStyleDataList()
  }, [])
  useEffect(() => {
    // 获取数据
    getData()
  }, [flag])

  async function getData() {
    try {
      const data: FusionProps = {
        page_index: page,
        page_size: pageSize,
        style: curStyle,
        fusion_a_type : fusionAType
      }
      if(login_name && login_name !== 'all') {
        data.login_name = login_name
      }
      if(accountType && accountType !== 'all') {
        data.account_type = accountType
      }
      const res = await getFusionDetail(data)
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }

  async function getStyleDataList() {
    try {
      const res = await getStyleCountList()
      res.forEach((i:any) => {
        i.style_name_label = i.style_name + ':'+i.count
      })
      res.unshift({
        style_name: '',
        // type_name: '全部风格'
        style_name_label: '全部风格'
      })
      setStyleListData(res)
    } catch (error) {
      
    }
  }
  function changeCurStyle(data: string) {
    setCurStyle(data)
    setFlag(!flag)
  }
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  
  function filterRender() {
    return (
      <div>
        <Select
          className='!w-[120px]'
          value={curStyle}
          placeholder='请选择风格'
          style={{ width: 120 }}
          onChange={(e) => changeCurStyle(e || '')}
          allowClear
          options={styleListData}
          fieldNames={{
            label: 'style_name_label',
            value: 'style_name',
          }}
        />
        <Select
          className='!w-[120px] ml-[18px]'
          value={fusionAType}
          placeholder='请选择'
          style={{ width: 120 }}
          onChange={(e) => {setFusionAType(e || '');setFlag(!flag);}}
          allowClear
          options={[
            {label: '全部', value: ''},
            {label: '高清下载', value: 'hd'},
            {label: '编辑', value: 'inpaint,merge'},
            {label: '下载', value: 'download'},
          ]}
        />
      </div>
    )
  }
  const ToolTipContent = (item: any) => {
    return (
      <div className='font-medium min-w-[100px]'>
        <div>用户：{item.login_name}</div>
        <div>{item.style_name}</div>
        <div className='text-[#ACACAC] text-[14px] mt-[5px]'>编辑</div>
        <div>涂抹消除：{item.inpaint_count}</div>
        <div>添加文案：{item.merge_count}</div>
        <div>下载：{(item.download_count || 0) + (item.hd_count || 0)}</div>
        {
         (item.download_count || 0) + (item.hd_count || 0)?
          <div onClick={() => {imgInfoRef.current?.openDialog(item,accountType)}} className='cursor-pointer texxt-primary text-primary'>查看</div>
          :null
        }
        <div className='text-[#ACACAC] text-[14px] mt-[5px]'>tag</div>
        <div>{item.task_name}</div>
      <div>{item.task_en_name}</div>
      <div>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>

    )
  }

  return (
    <div className='p-[50px]' style={{minHeight: 'calc(100vh - 66px)'}}>
      <div className='flex items-center'>
        <div className='flex-1 text-[24px] text-black font-medium mt-[14px]'>背景融合 {userTotal}</div>
        { filterRender() }
      </div>
      <div className='flex flex-wrap'>
          <ImgList 
            dataList={dataList}
            imgKey={{ mainImgKey: 'img', tbnImgKey: 'tbn_img' }}
            footer={(item: any) => (
              <div className='absolute flex items-center h-[30px] px-[4px] bottom-[10px] w-full'>
                <div className='flex-1'>
                  <div className=' flex'>
                    {
                      item.hd_count? 
                      <div className='bg-[#1677FF] flex items-center justify-center rounded-[4px] w-[20px] h-[20px] text-white text-[12px]'>HD</div>
                      :null
                    }
                    {
                      item.inpaint_count||item.merge_count? 
                      <div className='bg-[#1677FF] rounded-[4px] ml-[5px] p-[4px] w-[20px] h-[20px]'><img className='w-full h-full' src={smearImg} alt="" /></div>
                      : null
                    }
                    {
                      item.download_count? 
                      <div className='bg-[#1677FF] text-white flex items-center justify-center rounded-[4px] ml-[5px]  w-[20px] h-[20px]'><DownloadOutlined /></div>
                      : null
                    }
                  </div>
                </div>
                <div>
                  <Tooltip 
                    arrow={false}
                    overlayClassName="bg-white"
                    overlayInnerStyle={{background: '#fff', color: '#333'}}
                    title={ToolTipContent(item)}>
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
      <ImgDialog ref={imgInfoRef} />
    </div>
  )
}

export default DataDetail