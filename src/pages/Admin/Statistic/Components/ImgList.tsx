import { Empty  } from 'antd'
interface Props {
  dataList: any[]
  imgKey?: {
    mainImgKey: string
    tbnImgKey: string
  }
  footer?: (data: any) => any
}
const DetailImgList = (options: Props) => {
  const { dataList, imgKey, footer } = options

  function getImg(item: any, key: string) {
    const host = 'https://aishop-1304948377.cos.ap-shanghai.myqcloud.com/'
    let img: string = item[key]
    if(!img.startsWith('http')) {
      img = `${host}${img}`
    }
    return img
  }
  return (
    <div className='flex flex-wrap w-full'>
        {
          dataList.map((item: any) => (
            <div className='group relative w-[250px] h-[250px] m-[10px] rounded-[5px] overflow-hidden' key={item.id}>
              <a href={getImg(item, imgKey?.mainImgKey || 'img')} target='_blank' rel="noreferrer">
                <img src={getImg(item, imgKey?.tbnImgKey || 'tbn_img')} alt="" className="w-full h-full object-fill"/>
              </a>
              { footer?.(item) }
            </div>
          ))
        }
        {
          !dataList || dataList.length === 0 ? <div className='flex justify-center w-full'><Empty className='mt-[50px] ' description='暂无数据' /> </div>: null
        }
    </div>
  )
}
export default DetailImgList