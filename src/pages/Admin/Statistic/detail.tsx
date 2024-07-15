
import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Tooltip, Pagination, Button, Empty, Select } from 'antd'
import { favoriteDetail, downloadDetail, modelDetail, userList } from '@/service'
import ImgInfo from '@/pages/Fusion/components/TaskResult/ImgInfo'
import ImgDialog from '@/pages/Admin/Statistic/Components/ImgDialog'
import moment from 'moment';

const DataDetail = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [flag, setFlag] = useState(false)
  const [userTotal, setUserTotal] = useState(0)
  const { type, login_name, accountType } = useParams()
  const [dataList, setDataList] = useState<any>([])
  const [userListData, setUserListData] = useState<any>([])
  const [curUser, setCurUser] = useState<any>('')
  const api = type === 'favorite' ||  type === 'not_favorite' ||  type === 'all' ? favoriteDetail : downloadDetail
  const navigate = useNavigate();
  const imgInfoRef:any = useRef()
  const imgInfoDialogRef:any = useRef()

  useEffect(() => {
    getUserList()
  }, [])
  useEffect(() => {
    // 获取数据
    if(type === 'model') {
      getModelList()
    } else {
      getData()
    }
  }, [flag])

  async function getData() {
    try {
      const data: any = {
        login_name,
        page_index: page,
        page_size: pageSize,
      }
      if(login_name === 'all') {
        data.login_name = ''
      }
      if(type==='merge') {
        data.login_name = curUser || ''
        data.action=['merge']
      }
      if(type==='download') {
        data.login_name = curUser || data.login_name
        data.action=['download','hd']
      }
      if(type === 'not_favorite') {
        data.favorite = 2
      }
      if(type === 'all') {
        data.favorite = -1
      }
      if(accountType && accountType !== 'all') {
        data.account_type = accountType
      }
      const res = await api(data)
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }
  async function getModelList() {
    try {
      const data: any = {
        login_name: curUser || '',
        page_index: page,
        page_size: pageSize,
      }
      const res = await modelDetail(data)
      console.log(res);
      setDataList(res.items || [])
      setUserTotal(res.total)
    } catch (error) {
      
    }
  }
  async function getUserList() {
    try {
      const res = await userList()
      res.forEach((i:any) => {
        i.label = i.login_name
      })
      res.unshift({
        login_name: '',
        label: '全部'
      })
      setUserListData(res)
    } catch (error) {
      
    }
  }
  function changeCurUser(user: string) {
    setCurUser(user)
    setFlag(!flag)
  }
  function changePage(page: number, pageSize: number) {
    setPageSize(pageSize)
    setPage(page)
    setFlag(!flag)
  }
  const titleText = useMemo(() => {
    if(type === 'model') return '制作风格'
    if(type === 'merge') return '文案合并'
    return type === 'all'?'融合': type === 'favorite'?'喜欢': type === 'not_favorite'? '不喜欢':'下载'
  }, [type])
  const imgKey = useMemo(() => {
    let mainImgKey = ['favorite', 'not_favorite', 'all', 'model'].includes(type || '')? 'img': 'img_url'
    let tbnImgKey =  ['favorite', 'not_favorite', 'all', 'model'].includes(type || '')? 'tbn_img': 'img_tbn_url'

    return {
      mainImgKey,
      tbnImgKey
    }
  }, [type])



  return (
    <div className='p-[50px]' style={{minHeight: 'calc(100vh - 66px)'}}>
      <div className='flex items-center'>
        <div className='flex-1 text-[24px] text-black font-medium mt-[14px]'>{titleText} {userTotal}</div>
        {
          type === 'model' || type === 'merge'?
          <Select
            className='!w-[240px]'
            value={curUser}
            placeholder='请选择用户'
            style={{ width: 120 }}
            onChange={(e) => changeCurUser(e || '')}
            allowClear
            options={userListData}
            fieldNames={{
              label: 'label',
              value: 'login_name',
            }}
          />
          : null
        }
        
      </div>
      <div className='flex flex-wrap'>
          {
            dataList.map((item: any) => (
              <div className='group relative w-[250px] h-[250px] m-[10px] rounded-[5px] overflow-hidden' key={item.id}>
                {/* <Image
                  width={'100%'}
                  height={'100%'}
                  src={type === 'favorite'? item.tbn_img:item.img_url} 
                  style={{borderRadius: '5px'}}
                  fallback="data:image/png;base64,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"
                  preview={{
                    src: type === 'favorite'? item.img:item.img_url,
                    closeIcon:null,
                  }}/> */}
                  <a href={item[imgKey.mainImgKey]} target='_blank' rel="noreferrer">
                    <img src={item[imgKey.tbnImgKey]} alt="" className="w-full h-full object-fill"/>
                  </a>
                  {
                    type === 'model'?
                    <div onClick={() => {item.img_info && imgInfoRef.current.openDialog(item.img_info)}} 
                        className='hidden group-hover:block cursor-pointer absolute bg-black rounded-[2px] px-[4px] text-white text-[14px] right-[10px] bottom-[10px]'>INF</div>
                    :
                    <Tooltip 
                    overlayInnerStyle={{background: '#fff', color: '#333'}}
                    title={renderInfo(item,(infoItem: any) => {imgInfoDialogRef.current?.openDialog(infoItem, accountType)})}>
                      <div className='hidden group-hover:block absolute bg-black rounded-[2px] px-[4px] text-white text-[14px] right-[10px] bottom-[10px]'>INF</div>
                    </Tooltip>
                  }
              </div>
            ))
          }
      </div>
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
            <Empty className='mt-[50px]' description='暂无数据' />
          </div>
      }
      <ImgInfo ref={imgInfoRef} />
      <ImgDialog ref={imgInfoDialogRef} />
    </div>
  )
}
function renderInfo(item: any, callback: any) {
  let ext_info: any = {}
  try {
    ext_info = JSON.parse(item.ext_info)
  } catch (error) {}

  return (
    item.task_detail_id>0?
    <div>
      <div className='font-medium min-w-[100px]'>
        <div>用户：{item.login_name}</div>
        <div>{ext_info.style_name}</div>
        <div className='text-[#ACACAC] text-[14px] mt-[5px]'>编辑</div>
        <div>涂抹消除：{ext_info.inpaint_count}</div>
        <div>添加文案：{ext_info.merge_count}</div>
        <div>下载：{(ext_info.download_count || 0) + (ext_info.hd_count || 0)}</div>
        {
         (ext_info.download_count || 0) + (ext_info.hd_count || 0)?
          <div onClick={() => {callback(ext_info)}} className='cursor-pointer texxt-primary text-primary'>查看</div>
          :null
        }
        <div className='text-[#ACACAC] text-[14px] mt-[5px]'>tag</div>
        <div>{ext_info.task_name}</div>
        <div>{ext_info.task_en_name}</div>
        <div>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    </div>:
    <div>用户：{item.login_name}<br />信息：{item.ext_info}<br />{item.create_time?moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'):null}</div>

  )
}
export default DataDetail