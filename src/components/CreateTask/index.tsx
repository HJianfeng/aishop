import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { CloseCircleFilled, EditOutlined, LoadingOutlined } from '@ant-design/icons'
import { Modal, Input, Upload, message, Button } from 'antd'
import { cutout, taskCreate, taskDevCreate, taskTemplateCreate } from '@/service';
import UploadIcon from '@/assets/upload.png'
import BgIcon from '@/assets/bg.jpeg'
import style from './style.module.scss'
import { ISelectItem } from '@/interface';
import { uploadLimit } from '@/utils'
import Alert from '@/components/Alert';

const { Dragger } = Upload;
interface IProps {
  taskList?: ISelectItem[];
  onClose: () => void;
  onOk: (id: any) => void;
  isDevMode?: Boolean
  isTaskMode?: Boolean
}
const CreateTask = ({ taskList, onClose, onOk, isDevMode, isTaskMode }: IProps, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskEnName, setTaskEnName] = useState('');
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [progess, setProgess] = useState(0);
  const [tipShow, setTipShow] = useState(false);

  const handleCancel = () => {
    setTaskName('')
    setTaskEnName('')
    setTipShow(false)
    setIsModalOpen(false);
    setLoading(false);
    setPreviewImage(undefined)
    setProgess(0)
    if(timer) clearTimeout(timer)
  };
  const showModal = (taskList?: any) => {
    setIsModalOpen(true);
    // if(taskList && taskList.length > 0) {
    //   setTaskName(`未命名${taskList.length+1}`)
    // }
  };

  useImperativeHandle(ref, () => ({
    showModal
  }))


  let timer: any = null;
  const customRequest: any = async (option: any) => {
    const fileType = option.file.type
    if(!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(fileType)) {
      message.error('暂时不支持此类图片格式哦~')
      return
    }
    try {
      await uploadLimit(option.file);
      setLoading(true);
      let formdata = new FormData() as any;
      formdata.append("file", option.file);
      setProgess(0)
      handleProgess()
      cutout(formdata).then((res: any) => {
        setPreviewImage(res)
        setTaskName(res.TaskName)
        setTaskEnName(res.TaskEnName)
        setTipShow(true)
      }).catch((error) => {
        message.error(error.message || '图片上传失败');
      }).finally(() => {
        setProgess(100)
        if(timer) clearTimeout(timer)
        setLoading(false);
      })
    } catch (error) {
        
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

  // 确认使用
  const onConfirmCreate = () => {
    const task_name = taskName || `未命名${(taskList?.length || 0) + 1}`;
    setSubmitLoading(true)
    const apiCreate = isTaskMode? taskTemplateCreate : (isDevMode?taskDevCreate:taskCreate);
    apiCreate({
      task_name,
      task_en_name: taskEnName,
      main_img: previewImage?.MainImgKey,
      tbn_main_img: previewImage?.TbnImgKey
    }).then((res:any) => {
      onOk(res);
      onClose()
      handleCancel()
      setLoading(false);
      setSubmitLoading(false)
    }).catch((error: any) => {
      message.error(error?.errorMsg || '接口异常');
      setSubmitLoading(false)
      setLoading(false);
    })
  }
  return (
    <Modal width={448} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      <div className='flex items-center relative'>
        <div className='flex-1 text-[#121212] text-[22px] font-semibold'>创建任务</div>
        <Input value={taskName} 
          suffix={<EditOutlined className='text-[#D3D3D3]' />} 
          onChange={(event: any) => setTaskName(event.target.value)} 
          styles={{input: {textAlign: 'center'}}}
          disabled={!previewImage}
          className="h-[42px] w-[180px] text-center text-[16px]" 
          placeholder="商品简称" />
          {
            tipShow?
            <div className='absolute w-full bottom-[-49px] z-10'>
              <Alert arrowClass="!right-[80px]" onClose={() => {setTipShow(false)}} text="输入产品词让AI更加准确，如：化妆品、纸盒、罐子" />
            </div> :null
          }
      </div>
      <div className={`relative mt-[17px] bg-white h-[398px] ${style.upload}`}>
        <Dragger
          name='file'
          accept='image/*'
          showUploadList={false}
          className={style.upload}
          maxCount={1}
          disabled={previewImage?.MainImg}
          style={previewImage?.MainImg ?{background: `url(${BgIcon}) repeat`}:{}}
          customRequest={customRequest}
        >
          {
            previewImage?.MainImg ?
            <div className='relative flex justify-center items-center'>
              <img className='max-w-[290px] max-h-[290px] object-fill' src={previewImage?.MainImg} alt="" />
            </div>
            :
            <div className='flex flex-col items-center justify-center'>
              <div className="mb-[54px] w-[72px]">
                <img src={UploadIcon} alt="" />
              </div>
              <div className="text-[#818181] text-[16px]">将图片拖拽至此或点击上传</div>
            </div>
          }
        </Dragger>
        
        {loading?
          <div className='absolute p-[6px] w-full h-full right-[0px] top-[0px]'>
            <div className='bg-white bg-opacity-90 w-full h-full flex justify-center flex-col items-center'>
              <LoadingOutlined className='text-[50px]' />
              <div className='mt-[30px] text-[#121212] text-[16px]'>拼命加载中…{progess}%</div>
            </div>
          </div>
          :null
        }
      </div>
      <div className='flex mt-[20px] justify-center'>
        <Button className='w-[90px] h-[40px] text-[16px] mr-[10px] border-[#ACACAC] font-medium' onClick={handleCancel}>取消</Button>
        <Button 
          className={`w-[90px] h-[40px] text-[16px] ${(!previewImage?.MainImg || !taskName)?'opacity-50 !text-white !bg-primary':''}`}
          type='primary'
          onClick={onConfirmCreate}
          loading={loading || submitLoading}
          disabled={!previewImage?.MainImg || !taskName}>使用</Button>
      </div>
    </Modal>
  )
}
export default forwardRef(CreateTask)