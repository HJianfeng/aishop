import { useState, useEffect, useRef } from 'react'
import { Upload, Button, message, Spin, Radio } from 'antd'
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons'
import PageCover from '@/components/PageCover'
import { upscaleHd, addBpoint } from '@/service';
import style from '../Cutout/style.module.scss'
import PreviewImage from '@/components/PreviewImg'
import { emitter } from '@/utils/eventBus'
import { uploadLimit } from '@/utils'
import hdCover from '@/assets/hdcover.png'
import { useDispatch } from 'react-redux'
import { setTooltip } from '@/store/toolSlice'
import ResetImg from './components/ResetImg'
import {detectScores } from "@/service";

const { Dragger } = Upload;
const Cutout = () => {
  const [progess, setProgess] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [originImage, setOriginImage] = useState<any>();
  const [repairType, setRepairType] = useState<'clean'|'face'>('clean');
  const ResetImgRef: any = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if(originImage && (previewImage || loading)) {
      emitter.emit('headerData', {title: '高清修复', summary: '不用发愁，让模糊画面重焕清晰光彩，每个细节都清晰可见'})
    } else {
      emitter.emit('headerData', null)
    }
    return () => {
      emitter.emit('headerData', null)
    };
  }, [originImage, previewImage]);

  let timer: any = null;
  const customRequest: any = async ({ file }: { file: File }, resetRepairType?: 'clean'|'face') => {
    detectScores(5)
    const fileType = file?.type
    if(fileType && !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(fileType)) {
      message.error('暂时不支持此类图片格式哦~')
      return
    }
    if(resetRepairType) {
      setRepairType(resetRepairType)
    }
    try {
      await uploadLimit(file,4096);
      setLoading(true);
      getOriginImg(file)
      let formdata = new FormData() as any;
      formdata.append("file", file);
      setProgess(0)
      handleProgess()
      const params = {
        upscale: 1,
        hd_type: resetRepairType || repairType,
      }
      upscaleHd(params, formdata).then((res: any) => {
        setPreviewImage(res)
        dispatch(setTooltip('repair'))
      }).catch((error) => {
        message.error(error.message || '图片上传失败');
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
          return 98
        } else {
          handleProgess();
        }
        return data + 2;
      });
    }, 800);
  }
  function resetUpload() {
    ResetImgRef.current?.showModal(repairType)
  }
  const renderUpload = (reset = false) => {
    return (
      <>
      {
        reset?
        <Button onClick={resetUpload} className='w-[130px] h-[51px] font-semibold text-[16px] text-[#121212] flex items-center justify-center'>重新上传</Button>
        :
        <Dragger
          name='file'
          accept='image/*'
          showUploadList={false}
          className={style.upload}
          maxCount={1}
          customRequest={customRequest}
        >
          <Button className='w-[155px] h-[51px] text-[16px] justify-center flex items-center' type='primary'><CloudUploadOutlined /> 上传图片</Button>
        </Dragger>
      }
      </>
    )
  }
  const renderRadio = () => {
    return (
      
    <div className='text-left flex'>
      <div className='ml-[40px]'>
        <Radio onChange={(e) => setRepairType(e.target.value)} checked={repairType === 'clean'} className='text-[16px]' value={'clean'}>通用</Radio>
        <div onClick={() => setRepairType('clean')} className='text-[#818181] text-[14px] cursor-pointer'>风景、动漫、物体、景观等模糊场景</div>
      </div>
      <div className='ml-[90px]'>
        <Radio onChange={(e) => setRepairType(e.target.value)} checked={repairType === 'face'} className='text-[16px]' value={'face'}>人物</Radio>
        <div onClick={() => setRepairType('face')} className='text-[#818181] text-[14px] cursor-pointer'>面部细节、证件照、老照片等模糊人像</div>
      </div>
    </div>
    )
  }

  function afterDownload(url: string) {
    addBpoint({"action_type":"tool", "action":"download", "root":`hd/${repairType}`, "url": url})
  }
  return (
    <div className='relative h-full w-full'>
      <div className='flex pb-[20px]  justify-center h-full'>
        {
          loading?
          <div className='flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{margin: '-25px', color: '#ACACAC', fontSize: 50 }} spin />}/>
            <div className='text-[#ACACAC] mt-[50px] text-[16px]'>上传处理中… {progess?progess+'%': ""}</div>
          </div>
          :
          originImage && previewImage ?
             <PreviewImage isCompare={false} compareTag="高清" hdMultiple={1} afterDownload={afterDownload} type='hd' previewImgTag="高清" root="upscale" uploadButton={renderUpload(true)} originImg={originImage} previewImg={previewImage} />
            :
              <PageCover 
                title='高清修复'
                summary='不用发愁，让模糊画面重焕清晰光彩，每个细节都清晰可见'
                subElement={renderRadio()}
                cover={hdCover}
                uploadButton={renderUpload()}
              />
        }
      </div>
      <ResetImg ref={ResetImgRef} customRequest={customRequest} />
    </div>
  )
}

export default Cutout