
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Tooltip, Checkbox, Select } from 'antd'
import { getBpointDetail,getBpointDownloadDetail, getBpointDetailCount } from '@/service'
import ImgList from './Components/ImgList'
import Footer from './Components/Footer'
import { DownloadOutlined } from '@ant-design/icons';
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
  const [is_download, setDownload] = useState<boolean>(false)
  const api = type === 'cutout' || type==='hd' ? getBpointDownloadDetail : getBpointDetail


  useEffect(() => {
    getData()
    getConutData()
  }, [flag])

  function getParams(isCount?: boolean) {
    const obj: any = {
      action_type: "tool",
      action: ["download"],
      is_download: is_download?'true':'false',
    }
    if(accountType && accountType !== 'all') {
      obj.account_type = accountType
    }
    switch (type) {
      case 'cutout':
        if(isCount) {
          Object.assign(obj, { action: ["download","hd"], root: ['cutout'] })
        }else{
          Object.assign(obj, { action: ['cutout'] })
        }
        break;
      case 'inpaint':
        if(isCount) {
          Object.assign(obj, { action: ["inpaint"] })
        } else {
          Object.assign(obj, { action: ["download","hd"], root: ['inpaint'] })
        }
        break;
      case 'hd':
        if(!isCount) {
          Object.assign(obj, { action: ["hd"], root: ["clean","face"] })
          if(fusionAType === 'clean') {
            obj.root = ['clean']
          } else if(fusionAType === 'face') {
            obj.root = ['face']
          }
        } else {
          Object.assign(obj, { action: ["download"], root: ["hd/clean","hd/face"] })
          if(fusionAType === 'clean') {
            obj.root = ['hd/clean']
          } else if(fusionAType === 'face') {
            obj.root = ['hd/face']
          }
        }
        break;
      case 'merge':
        if(isCount) {
          Object.assign(obj, { action_type:"fusion", action: ["merge"] })
        } else {
          Object.assign(obj, { action_type:"fusion", action: ["download","hd"], root: ['merge']})
        }
        if(onlyDownload) {
          obj.action = ["download"]
        }
        break;
    }
   
    if(login_name && login_name !== 'all') {
      obj.login_name = login_name
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
      const res = await api(data)
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }

  async function getConutData() {
    try {
      const data: any = {
        ...getParams(true)
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
  const titleText = useMemo(() => {
    let title = '';
    switch (type) {
      case 'cutout':
        title = '一键抠图'
        break;
      case 'inpaint':
        title = '涂抹替换'
        break;
      case 'merge':
        title = '图文合并'
        break;
      case 'hd':
        title = '高清修复'
        break;
    }
    return title
  }, [type])

function changeDownload(e: any) {
  setDownload(e.target.checked)
  setFlag(!flag)
}
function changeCurStyle(e: any) {
  setFusionAType(e)
  setFlag(!flag)
}

const ToolTipContent = (item: any) => {
    return (
    <div className='font-medium min-w-[100px]'>
      <div>用户：{item.login_name}</div>
      {
      item.d_count?<div>下载次数：{item.d_count}</div>:null
      }
      {item.create_time?<div>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>:null}

      </div>
    )
  }

  return (
    <div className='p-[50px]' style={{minHeight: 'calc(100vh - 66px)'}}>
      <div className='flex items-center'>
        <div className='flex-1 flex text-[24px] text-black font-medium mt-[14px]'>
          <div className='mr-[20px]'>{titleText} {[ 'inpaint'].includes(type || '')? countData:userTotal}</div>
          {
            ['inpaint'].includes(type || '')?
            <div className=''>下载 {userTotal}</div>
            : null
          }
          {
            ['cutout','hd'].includes(type || '')?
            <div className=''>下载 {countData}</div>
            : null
          }

        </div>
        <div>
        {
          type === 'hd'?
            <Select
              className='!w-[120px] mr-[18px]'
              value={fusionAType}
              placeholder='请选择'
              style={{ width: 120 }}
              onChange={(e) => {changeCurStyle(e || '')}}
              allowClear
              options={[
                {label: '全部', value: ''},
                {label: '通用', value: 'clean'},
                {label: '人像', value: 'face'},
              ]}
            />
            
          : null
        }
        {type === 'cutout'?
        <Checkbox  value={is_download} onChange={(e) => {changeDownload(e)}}>下载</Checkbox>:null
        }
        </div>
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
                      item.dl_count? 
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
                    title={ToolTipContent(item)}
                    >
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