import { useState, useEffect, useRef } from 'react'
import { Upload, Button, message, Spin, Radio } from 'antd'
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons'
import PageCover from '@/components/PageCover'
import { upscaleZoomin, addBpoint } from '@/service';
import style from '../Cutout/style.module.scss'
import PreviewImage from '@/components/PreviewImg'
import { emitter } from '@/utils/eventBus'
import { uploadLimit } from '@/utils'
import zoomIncover from '@/assets/zoomInCover.jpg'
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
  const [multiple, setMultiple] = useState(2);
  const ResetImgRef: any = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    if(originImage && (previewImage || loading)) {
      emitter.emit('headerData', {title: '无损放大', summary: '不用担心放大会模糊，每一处细节都尽在掌握'})
    } else {
      emitter.emit('headerData', null)
    }
    return () => {
      emitter.emit('headerData', null)
    };
  }, [originImage, previewImage]);

  let timer: any = null;
  const customRequest: any =async ({ file }: { file: File }, resetmultiple?: number) => {
    detectScores(5)
    const fileType = file?.type
    if(fileType && !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(fileType)) {
      message.error('暂时不支持此类图片格式哦~')
      return
    }
    try {
      await uploadLimit(file, 1024);
      if(resetmultiple) {
        setMultiple(resetmultiple)
      }
      setLoading(true);
      getOriginImg(file)
      let formdata = new FormData() as any;
      formdata.append("file", file);
      setProgess(0)
      handleProgess()
      const params = {
        upscale: resetmultiple || multiple,
        root: `x${resetmultiple || multiple}`,
        origin: 'cutout'
      }
      upscaleZoomin(params, formdata).then((res: any) => {
        setPreviewImage(res)
        dispatch(setTooltip('hd'))
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
    ResetImgRef.current?.showModal(multiple)
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
    <Radio.Group onChange={(e) => setMultiple(e.target.value)} value={multiple}>
      <Radio className='text-[16px]' value={2}>2倍</Radio>
      {/* <Radio className='text-[16px] mx-[80px]' value={3}>3倍</Radio> */}
      <Radio className='text-[16px] ml-[160px]' value={4}>4倍</Radio>
    </Radio.Group>
    )
  }
  function afterDownload(url: string) {
    addBpoint({"action_type":"tool", "action":"download", "root":`upscale/x${multiple}`, "url": url})
  }
  return (
    <div className='relative h-full w-full'>
      <div className='flex pb-[20px]  justify-center h-full'>
        {
          loading?
          <div className='flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{margin: '-25px', color: '#ACACAC', fontSize: 50 }} spin />}/>
            <div className='text-[#ACACAC] mt-[50px] text-[16px]'>上传处理中… {progess?progess+'%': ""}</div>
            <div className='text-[#ACACAC] mt-[10px] text-[16px]'>ai在拼命计算尺寸大小，速度稍慢，耐心等候哦～</div>
          </div>
          :
          originImage && previewImage ?
             <PreviewImage type='hd' isCompare={false} compareTag="扩大" afterDownload={afterDownload} hdMultiple={multiple} previewImgTag={`${multiple}倍`} root="upscale" uploadButton={renderUpload(true)} originImg={originImage} previewImg={previewImage} />
            :
              <PageCover 
                title='无损放大'
                summary='不用担心放大会模糊，每一处细节都尽在掌握'
                subElement={renderRadio()}
                cover={zoomIncover}
                uploadButton={renderUpload()}
              />
        }
      </div>
      <ResetImg ref={ResetImgRef} customRequest={customRequest} />
    </div>
  )
}

export default Cutout