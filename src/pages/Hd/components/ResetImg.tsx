import { forwardRef, useState, useImperativeHandle } from 'react';
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, Radio, Upload, Button } from 'antd'
import style from '../../Cutout/style.module.scss'

const { Dragger } = Upload;
const ResetImg = ({ customRequest }: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [multiple, setMultiple] = useState(2);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const confirm: any = ({ file }: { file: File }) => {
    handleCancel()
    customRequest({ file }, multiple)
  }
  const showModal = (multipleInit: number) => {
    setMultiple(multipleInit)
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    showModal
  }))
  const renderRadio = () => {
    return (
      
    <div className='flex justify-center'>
      <div className=''>
        <Radio onChange={(e) => setMultiple(e.target.value)} checked={multiple === 2} className='text-[16px]' value={2}>2倍</Radio>
      </div>
      <div className='ml-[90px]'>
        <Radio onChange={(e) => setMultiple(e.target.value)} checked={multiple === 4} className='text-[16px]' value={4}>4倍</Radio>
      </div>
    </div>
    )
  }
  return (
    <Modal width={330} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      <div className='mb-[40px] text-center text-[16px] font-medium'>选择放大倍数</div>
      {renderRadio()}
      <div className='flex justify-center items-center mt-[40px]'>
        <Button onClick={handleCancel} className='mr-[30px]' size='large'>取消</Button>
        <Dragger
          name='file'
          accept='image/*'
          showUploadList={false}
          className={style.upload}
          maxCount={1}
          customRequest={confirm}
        >
          <Button type='primary' size='large'>确定</Button>
        </Dragger>
      </div>
    </Modal>
  )
}


export default forwardRef(ResetImg)