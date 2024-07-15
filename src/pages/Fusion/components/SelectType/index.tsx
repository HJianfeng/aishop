import { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { getStyleList } from '@/service';
import { ISceneItem } from '@/interface';
import { Drawer, Empty } from 'antd'
import style from './style.module.scss'
import { Scrollbars } from 'rc-scrollbars';
import StyleCollect from './styleCollect'

interface Prop {
  container: any
  visible: boolean
  handleOpenChange: (data: boolean) => void
  styleConfig?: ISceneItem
  setStyle: (data: ISceneItem) => void
  containerWidth?: string
  itemWidth?: string
}

const SelectType = ({ visible, container, handleOpenChange, setStyle, styleConfig,containerWidth,itemWidth }: Prop, ref: any) => {
  const [imgList, setImgList] = useState<ISceneItem[]>([])
  const [selectClassification, setSelectClassification] = useState('全部')
  const StyleCollectRef:any = useRef()
  useEffect(() => {
    getList()
  }, [visible]);
  function setImg(item: ISceneItem) {
    setStyle(item)
  }
  function getList() {
    getStyleList().then((res: ISceneItem[]) => {
      setImgList(res)
    }).catch(console.log)
  }
  
  const classification = useMemo<string[]>(() => {
    const result: string[] = ['全部'];
    if(!imgList || imgList.length === 0) return result;
    imgList.forEach((item) => {
      if(!result.includes(item.type_name)) {
        result.push(item.type_name)
      }
    })
    return result
  }, [imgList])

  const curImg = useMemo<ISceneItem[]>(() => {
    if(!selectClassification) return [];
    const radom: ISceneItem = {
      id: -1,
      n_prompt: '',
      prompt: '',
      style_img: 'https://web-1304948377.cos.ap-shanghai.myqcloud.com/ai-web/random-style-f6f6537e.png',
      style_name: '随机变变变',
      type_name: '全部'
    }
    if(selectClassification === '全部') {
      return [radom, ...imgList]
    }
    const result: ISceneItem[] = [];
    if(!imgList || imgList.length === 0) return result;
    imgList.forEach((item) => {
      if(item.type_name === selectClassification) {
        result.push(item)
      }
    })
    return result
  }, [imgList, selectClassification])
  
  const renderContent = () => {
    return (
      <div style={{background: 'rgba(19,19,19,0.9)', width: containerWidth?containerWidth:'100%'}} className='flex flex-col h-full overflow-hidden border border-[#F2F2F2] pt-[10px] pl-[20px] rounded-[5px]'>
        <div className='mb-[4px] flex items-center justify-between'>
          <div className='text-[#fff] text-[16px]'>场景/风格选择</div>
          <div onClick={createStyle} className='text-[#6984FF] mr-[26px] cursor-pointer text-[14px]'>{`更多风格 >`}</div>
        </div>
        {/*  overflow-x-auto ${style.beautyScroll} */}
        {
          imgList && imgList.length?
          <>
            <div className={`flex flex-wrap mt-[15px] mb-[4px] overflow-y-hidden`}>
              {
                classification.map((item) => (
                  <div onClick={() => setSelectClassification(item)} className={`${selectClassification === item?'bg-[#EAECF6] !text-[#121212] ':''} h-[22px] flex-shrink-0 cursor-pointer rounded-full text-[14px] text-[#fff] mr-[10px] mb-[13px] px-[21px] flex items-center`} key={item}>{item}</div>
                ))
              }
            </div>
            <Scrollbars className={style.scrollbar}>
              <div className='flex flex-wrap'>
                {curImg.map((item, index) => (
                  <div onClick={() => (setImg(item))} style={{width: itemWidth?itemWidth:'90px'}} className={`group cursor-pointer mr-[11px] mb-[8px] ${style.nth3}`} key={item.id}>
                    <img style={{width: itemWidth?itemWidth:'90px',height: itemWidth?itemWidth:'90px'}} className={`${styleConfig?.id === item.id || (!styleConfig?.id && item.id === -1)?'border-primary':''}  group-hover:border-primary border-[3px] border-[transparent] rounded-[5px] object-cover`}
                     src={item.style_img} alt="" />
                    <div className='text-[#fff] text-[14px] text-center mt-[5px] truncate'>{item.style_name}</div>
                  </div>
                ))}
              </div>
            </Scrollbars>
          </> :
          <div className='flex mt-[100px] justify-center'>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        }
      </div>
    )
  }
  const createStyle = () => {
    StyleCollectRef.current.openDialog()
  }
  useImperativeHandle(ref, () => ({
    styleConfig
  }))
  return (
    <div>
      <Drawer
        placement="bottom"
        open={visible}
        closable={false}
        mask={false}
        rootStyle={{height: '100%'}}
        bodyStyle={{padding: '12px 0 0 0'}}
        rootClassName='absolute w-full top-0 outline-none z-10'
        contentWrapperStyle={{height: '100%', boxShadow: 'none'}}
        className='!bg-transparent'
        onClose={() => handleOpenChange(false)}
        getContainer={container.current}
      >
        {renderContent()}
      </Drawer>
      <StyleCollect ref={StyleCollectRef} />
    </div>

  )
}

export default forwardRef(SelectType)