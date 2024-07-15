import { useState, useEffect, useRef } from 'react'
import { Upload, Button, message, Spin } from 'antd'
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons'
import PageCover from '@/components/PageCover'
import { cutoutimgtool, getdemolist, addBpoint } from '@/service';
import style from './style.module.scss'
import PreviewImage from '@/components/PreviewImg'
import { emitter } from '@/utils/eventBus'
import { uploadLimit } from '@/utils'
import cutoutCover from '@/assets/cutoutcover.png'
import cutoutBtn from '@/assets/cutout-btn.png'
import cutoutIcon from '@/assets/cutout_icon.png'
import aiIcon from '@/assets/aiIcon.png'
import { DemoItem } from '@/interface'
import { useDispatch } from 'react-redux'
import { setTooltip } from '@/store/toolSlice'
import ResetCanvas from './resetCanvas/index';
import {detectScores } from "@/service";


const { Dragger } = Upload;
const Cutout = () => {
  const [progess, setProgess] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [originImage, setOriginImage] = useState<any>();
  const [demoList, setDemoList] = useState<DemoItem[]>([]);
  const ResetCanvasRef:any = useRef()
  const dispatch = useDispatch()
  useEffect(() => {
    getDemo()
  }, [])
  useEffect(() => {
    if(originImage && previewImage) {
      emitter.emit('headerData', {title: '一键抠图', summary: '无需复杂操作，仅需一步，让你的照片抠图变得轻而易举！'})
    } else {
      emitter.emit('headerData', null)
    }
    return () => {
      emitter.emit('headerData', null)
    };
  });
  async function getDemo() {
    try {
      const res = await getdemolist()
      const data = res.filter((i:any) => i.Type === 'cutout')
      setDemoList(data)
    } catch (error) {
      
    }
  }
  let timer: any = null;
  const customRequest: any = async ({ file, demoItem }: { file?: File, demoItem?: DemoItem }) => {
    detectScores(5)
    const fileType = file?.type
    if(fileType && !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(fileType)) {
      message.error('暂时不支持此类图片格式哦~')
      return
    }
    try {
      let formdata = new FormData() as any;
      const data: any = { is_demo: 'true' };
      if(file) {
        await uploadLimit(file);
        getOriginImg(file)
        formdata.append("file", file);
      } else if(demoItem){
        data.file_name = demoItem.MainImgKey
        setOriginImage(demoItem.DemoImg)
      }
      
      setLoading(true);
      setProgess(0)
      handleProgess()
      cutoutimgtool(file?formdata:data).then((res: any) => {
        setPreviewImage(res)
        dispatch(setTooltip('cutout'))
      }).catch((error) => {
        message.error(error.message || '图片上传失败');
        setPreviewImage(null)
      }).finally(() => {
        setProgess(100)
        if(timer) clearTimeout(timer)
        setTimeout(() => {
          setLoading(false);
        }, 500)
      })
    } catch (error) {
        
    }
  }

  function getOriginImg(file: File) {
    if(window.FileReader) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = function() {
        setOriginImage(fr.result)
      }
    }
  }

  const handleProgess = () => {
    timer = setTimeout(() => {
      setProgess((data) => {
        if (data >= 98) {
          if(timer) clearTimeout(timer)
          return 98;
        } else {
          handleProgess();
        }
        return data + 2;
      });
    }, 100);
  }
  function createDemo(item: DemoItem) {
    setLoading(true);
    setProgess(0)
    handleProgess()
    setTimeout(() => {
      setLoading(false);
      setProgess(100)
      if(timer) clearTimeout(timer)

      setOriginImage(item.DemoImg)
      setPreviewImage({tbn_img: item.MainImgKey, img: item.MainImgKey, img_box: item.BoxImgKey})
      dispatch(setTooltip('cutout'))
    }, 4500)
    
    // customRequest({demoItem: item})
  }
  const renderUpload = (reset = false) => {
    return (
      <Dragger
        name='file'
        accept='image/*'
        showUploadList={false}
        className={style.upload}
        maxCount={1}
        customRequest={customRequest}
      >
        {
          reset?
          <Button className='w-[130px] h-[51px] font-semibold text-[16px] text-[#121212] flex items-center justify-center'>重新上传</Button>
          :
          <Button className='w-[130px] justify-center h-[51px] text-[16px] flex items-center' type='primary'><CloudUploadOutlined /> 上传图片</Button>
        }
      </Dragger>
    )
  }
  function renderButtonSlot(reset = false) {
    return (
      reset?
      <div className='relative'>
        <div onClick={() => {ResetCanvasRef.current.openDialog(previewImage.img_box || previewImage.img)}} className='w-[50px] ml-[10px] cursor-pointer h-[50px] rounded-[8px] border border-[#D3D3D3] flex items-center justify-center bg-white'>
          <img src={cutoutBtn} className='w-[24px] h-[24px]' alt="" />
        </div>
        {/* <div className='absolute right-[-38px] top-[-20px] w-[40px]'>
          <img src={aiIcon} alt="" />
        </div> */}
        <img className='absolute right-[-38px] top-[-20px] w-[40px]' src={cutoutIcon} alt="" />
      </div>
      :null
      )
  }
  function afterDownload(url: string) {
    addBpoint({"action_type":"tool", "action":"download", "root":`cutout`, "url": url})
  }
  return (
    <div className='relative h-full w-full'>
      <div className='flex justify-center h-full'>
        {
          loading?
          <div className='flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{margin: '-25px', color: '#ACACAC', fontSize: 50 }} spin />}/>
            <div className='text-[#ACACAC] mt-[50px] text-[16px]'>上传处理中… {progess?progess+'%': ""}</div>
          </div>
          :
          originImage && previewImage ?
            <PreviewImage afterDownload={afterDownload} className='pb-[20px]' uploadButton={renderUpload(true)} buttonSlot={renderButtonSlot(true)} type='cutout' root="cutout" originImg={originImage} previewImg={previewImage} />
            :
            <PageCover 
              title='一键抠图'
              cover={cutoutCover}
              showRecommend
              recommendList={demoList} 
              type='cutout'
              createDemo={createDemo} 
              demoTitle='你也可以试试这些商品图片进行抠图哟~'
              summary='无需担心复杂的抠图步骤，一键操作，让创作变得简单、高效'
              uploadButton={renderUpload()}
            />
        }
      </div>
      <ResetCanvas ref={ResetCanvasRef} />
    </div>
  )
}

export default Cutout