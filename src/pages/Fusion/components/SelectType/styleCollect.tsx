import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, Upload, message, Input, Space, Button } from 'antd'
import style from './style.module.scss'
import { CollectStyle } from '@/service'
import Bg from '@/assets/bg.png'
import uploadPlusIcon from '@/assets/upload_plus.png'

const { Dragger } = Upload;
const StyleCollect = (props: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [styleInfo, setStyleInfo] = useState<string>('')

  const openDialog = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([])
    setStyleInfo('')
  };

  useImperativeHandle(ref, () => ({
    openDialog
  }))

  function customRequest({file}: any) {
    const isJpgOrPng = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
    if (!isJpgOrPng) {
      message.error('格式错误');
      return
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片必须小于 5MB!');
      return
    }
    setFileList([...fileList, file])
  }

  
  async function onSubmit() {
    if(fileList.length === 0 && !styleInfo) {
      message.error('您还没有填写哦~');
      return
    }
    const formData = new FormData();
    formData.append('style_info', styleInfo);
    // formData.append('files', fileList as any);
    // // fileList.forEach((value, index) => {
    // //   formData.append(`files[${index}]`, value)
    // // });
    fileList.forEach( e => {
      formData.append('files',e);
    });
    setLoading(true)
    CollectStyle(formData).then((res: any) => {
      setLoading(false)
      handleCancel()
      message.success('提交成功');
    }).catch((error) => {
      setLoading(false)
      message.error(error.message);
    })
  }
  function deleteImg(index: number) {
    const cloneFile = [...fileList]
    cloneFile.splice(index, 1)
    setFileList([...cloneFile])
  }
  return (
    <Modal className={style.modelP0} width={480} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      <div className='px-[25px] py-[28px]' style={{background: `url(${Bg}) no-repeat`, backgroundSize: '100%'}}>
        <div className=''>
          <div className='text-white mb-[22px] text-center text-[36px] font-medium'>风格收集</div>
          <div className='text-white text-[16px] font-medium text-center'>风格太少？想要什么类型，告诉我们，很快就能满足你呦～</div>
        </div>
        <div className='px-[20px] py-[30px] bg-white rounded-[10px] mt-[21px]' style={{boxShadow: '0px 2px 20px 0px rgba(200,200,200,0.5)'}}>
          <div className='text-[16px] mb-[10px]'>上传喜欢的图片风格<span className='text-[#ACACAC]'>（至少传一张）</span></div>
          <div className='flex mb-[10px]'>
            <Space size={30}>
              {
                fileList.map((i: any, index: number) => (
                  <div key={i.uid}>
                    {uploadBtn(i, () => {deleteImg(index)})}
                  </div>
                ))
              }
              {
                fileList.length < 3?
                <div className='flex'>
                  <Dragger
                    name='file'
                    accept='image/*'
                    listType="picture-card"
                    fileList={fileList}
                    showUploadList={false}
                    className={`${style.collectUpload}`}
                    customRequest={customRequest}
                  >
                    {uploadBtn()}
                  </Dragger>
                </div>
                :null
              }
            </Space>
          </div>
          <div className='flex items-center'>
            <span className='flex-1 h-[1px] bg-[#E8E8E8]' />
            <span className='text-[#121212] mx-[20px] text-[16px] font-medium shrink-0'>或则</span> 
            <span className='flex-1 h-[1px] bg-[#E8E8E8]' />
          </div>
          <div className='mt-[10px] text-[16px] mb-[10px]'>描述想要的风格类型</div>
          <Input maxLength={50} value={styleInfo} onChange={(event) => setStyleInfo(event.target.value)} 
            className="h-[48px] mr-[10px] text-[16px]" placeholder="如：阳光户外、海边椰林、室内温馨桌台等" />
        </div>
        <Button loading={loading} onClick={onSubmit} className='flex mt-[20px] items-center justify-center w-full bg-[#5B77F8] hover:bg-[#6984FF] h-[51px] rounded-[100px] !text-white text-[22px] cursor-pointer'>
          提交
        </Button>
      </div>
    </Modal>
  )
}

const uploadBtn = (file?: File, deleteFun?: () => void) => {
  const url = file?window.URL.createObjectURL(file):''
  return (
    // ${!file?'hover:border-primary':''} 
    <div className={`group w-[110px] h-[110px] border-[2px] relative bg-white border-[#D3D3D3] border-dashed flex items-center justify-center`}>
      {
        url?
        <img className='object-contain w-[100%] h-[100%]' src={url} alt="" />
        :
        <img className='w-[16px] h-[16px]' src={uploadPlusIcon} alt="" />
      }
      {
        deleteFun?
        <div onClick={deleteFun} className='hidden group-hover:block absolute cursor-pointer z-[10] right-[-8px] top-[-8px]'>
          <CloseCircleFilled className='text-black text-[18px] bg-white rounded-full' />
        </div>
        :null
      }
    </div>
  )
}
export default forwardRef(StyleCollect)