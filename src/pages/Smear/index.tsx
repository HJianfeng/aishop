import { useState, useEffect, useRef } from 'react'
import { Upload, Button, message, Spin, } from 'antd'
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons'
import PageCover from '@/components/PageCover'
import { imgtoolInpaint, getdemolist } from '@/service';
import style from '../Cutout/style.module.scss'
import { emitter } from '@/utils/eventBus'
import SmearCanvasModule from '@/components/Smear/smearCanvas'
import { fabric } from 'fabric';
import { uploadLimit } from '@/utils'
import smearCover from '@/assets/smearCover.png'
import { DemoItem } from '@/interface'
import { useDispatch } from 'react-redux'
import './style.module.scss'
import { setTooltip } from '@/store/toolSlice'
import {detectScores } from "@/service";

const { Dragger } = Upload;
const Cutout = () => {
  const [progess, setProgess] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [originImage, setOriginImage] = useState<any>();
  const [imgSize, setImgSize] = useState<any>({width: 0, height: 0});
  const [demoList, setDemoList] = useState<DemoItem[]>([]);
  const [isSmear, setiIsSmear] = useState(false);
  const dispatch = useDispatch()
  const SmearCanvasRef = useRef<any>(null);

  useEffect(() => {
    getDemo()
    if(originImage && previewImage) {
      emitter.emit('headerData', {title: '涂抹消除', summary: '擦除图像中不需要或多余的物，只需要在图片中涂一涂'})
    } else {
      emitter.emit('headerData', null)
    }
    return () => {
      emitter.emit('headerData', null)
    };
  }, [originImage, previewImage]);
  async function getDemo() {
    try {
      const res = await getdemolist()
      const data = res.filter((i:any) => i.Type === 'inpaint')
      setDemoList(data)
    } catch (error) {
      
    }
  }
  let timer: any = null;
  const customRequest: any = async ({ file, demoItem }: { file?: File, demoItem?: DemoItem })  => {
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
        await uploadLimit(file,4096);
        getOriginImg(file)
        formdata.append("file", file);
      } else if(demoItem){
        data.file_name = demoItem.MainImgKey
        setOriginImage(demoItem.DemoImg)
      }

      setLoading(true);
      setProgess(0)
      handleProgess()
      imgtoolInpaint(file?formdata:data).then((res: any) => {
        setiIsSmear(false)
        setPreviewImage(res)
        dispatch(setTooltip('smear'))
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
        fabric.Image.fromURL(fr.result as string, (img: any) => {
          const ratio = img.width / img.height;
          if(img.width > 512) {
            img.height = 512 / ratio
            img.width = 512;
          }
          setImgSize(img)
          setOriginImage(fr.result)
        })
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
    }, 100);
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
          <Button className='w-[120px] h-[50px] font-semibold text-[20px] text-[#121212] flex items-center justify-center'>重新上传</Button>
          :
          <Button className='w-[155px] h-[51px] text-[16px] flex items-center justify-center' type='primary'><CloudUploadOutlined /> 上传图片</Button>
        }
      </Dragger>
    )
  }
  function afterSmear(img: string) {
    // setFlag(true)
    setiIsSmear(true)
    setOriginImage(img)
    const resArr = img.split('/');
    setPreviewImage(resArr[resArr.length-1])
    setTimeout(() => {
      resetCanvas(img)
    })
  }
  function resetCanvas(img: string) {
    SmearCanvasRef.current?.resetCanvas(img)
  }
  function createDemo(item: DemoItem) {
    customRequest({demoItem: item})
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
          originImage && previewImage?
            !flag?
            <div className='relative pb-[20px] h-full w-full'>
              <SmearCanvasModule
                ref={SmearCanvasRef}
                afterSmear={afterSmear} 
                isSmear={isSmear}
                canvasHeight={imgSize.height}
                canvasWidth={imgSize.width}
                imgUrl={originImage}
                imgKey={previewImage}
                uploadButton={renderUpload(true)}
              />
            </div>
            : null
            
          : <PageCover 
              title='涂抹消除'
              cover={smearCover}
              showRecommend
              recommendList={demoList} 
              createDemo={createDemo} 
              demoTitle='你也可以试试这些商品图片进行涂抹哟~'
              summary='擦除多余，焕新你的照片，只需轻轻一刷，你的照片就能焕发新生'
              uploadButton={renderUpload()}
            />
        }
      </div>
    </div>
  )
}

export default Cutout