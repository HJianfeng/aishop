import { forwardRef, useState, useImperativeHandle } from 'react';
import { CloseCircleFilled } from '@ant-design/icons'
import { Modal, Radio, Upload, Button } from 'antd'
import style from '../../Cutout/style.module.scss'

const { Dragger } = Upload;
const ResetImg = ({ customRequest }: any, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repairType, setRepairType] = useState<'clean'|'face'>('clean');

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const confirm: any = ({ file }: { file: File }) => {
    handleCancel()
    customRequest({ file }, repairType)
  }
  const showModal = (repairTypeInit: 'clean'|'face') => {
    setRepairType(repairTypeInit)
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    showModal
  }))
  const renderRadio = () => {
    return (
      
    <div className='flex justify-center'>
      <div className=' p-[8px] rounded-[4px]'>
        <Radio onChange={(e) => setRepairType(e.target.value)} checked={repairType === 'clean'} className='text-[16px]' value={'clean'}>通用</Radio>
        <div onClick={() => setRepairType('clean')} className='text-[#818181] text-[14px] cursor-pointer'>风景、动漫、物体、景观等模糊场景</div>
      </div>
      <div className='ml-[90px] p-[8px] rounded-[4px]'>
        <Radio onChange={(e) => setRepairType(e.target.value)} checked={repairType === 'face'} className='text-[16px]' value={'face'}>人物</Radio>
        <div onClick={() => setRepairType('face')} className='text-[#818181] text-[14px] cursor-pointer'>面部细节、证件照、老照片等模糊人像</div>
      </div>
    </div>
    )
  }
  return (
    <Modal width={640} centered open={isModalOpen} closeIcon={<CloseCircleFilled className='text-black text-[26px] bg-white rounded-full' />} footer={null}  onCancel={handleCancel}>
      <div className='mb-[40px] text-center text-[16px] font-medium'>选择修复类型</div>
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