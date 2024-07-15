import React, { useEffect, useState } from 'react';
import { Modal, Input, Switch, message, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { cutout, taskCreate } from '@/service';
import { getImgUrl } from '@/utils/location';
import { ISelectItem } from '@/interface';
import styles from './index.module.scss';

interface IProps {
  visible: boolean;
  taskList: ISelectItem[];
  onClose: () => void;
  onOk: () => void;
}
const { Dragger } = Upload;


const AddTask: React.FC<IProps> = (props) => {
  const { visible, taskList, onOk, onClose } = props;
  const [checked, setChecked] = useState(true);
  const [previewImage, setPreviewImage] = useState<any>();
  const [taskName, setTaskName] = useState<string>();
  const [loading, setLoading] = useState(false);


  // 取消
  const onHandleClose = () => {
    setPreviewImage('');
    onClose()
  }
  
  const customRequest = (option: any) => {
    setLoading(true);
    let formdata = new FormData() as any;
    formdata.append("file", option.file);
    cutout(formdata).then((res: any) => {
      if(res?.data?.code===0){
        setPreviewImage(res?.data?.data)
        setLoading(false);
      }else{
        message.error(res?.data?.message || '图片上传失败');
      }

    }).catch((error) => {
      message.error('图片上传失败');
      setLoading(false);
    })
  }

  // 确认使用
  const onConfirmCreate = () => {
    const task_name = taskName || `未命名${taskList?.length + 1}`;
    taskCreate({
      task_name,
      main_img: previewImage?.MainImg,
      tbn_main_img: previewImage?.TbnImg
    }).then(() => {
      onOk();
      onHandleClose()
      setLoading(false);
    }).catch((error) => {
      message.error(error?.errorMsg || '接口异常');
      setLoading(false);
    })
  }
  
  useEffect(() => {
    setTaskName(`未命名${taskList?.length + 1}`)
  }, [taskList]);


  const renderOnLoad = () => {
    return (
      previewImage?.MainImg ?
        <img src={`${getImgUrl()}/${previewImage?.MainImg}`} className={styles.previewImage} alt="" /> :
        <>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">将图片拖拽至此或点击上传</p>
        </>
    );
  }


  // 自定义 footer
  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Button onClick={() => onHandleClose()}>取消</Button>
        <Button
          style={{ marginLeft: 12 }}
          type="primary"
          onClick={onConfirmCreate}
          disabled={!previewImage?.MainImg }
          loading={loading}
        >
          确认使用
        </Button>
      </div>
    )
  }


  return (
    <Modal
      title="创建任务"
      centered
      open={visible}
      footer={renderFooter()}
      onCancel={() => onClose()}
      width={1000}
    >
      <div className={styles.addTaskConfig}>
        <div className={styles.addTitleWrap}>
          <div style={{ width: 100 }}>
            任务名称
          </div>
          <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </div>
        <div className={styles.switchBox}>
          <div className={styles.switchText}>是否抠图</div>
          <Switch checked={checked} onChange={(isCheck: boolean) => setChecked(isCheck)} />
        </div>
      </div>
      <div className={styles.draggerBox}>
        <Dragger
          name='file'
          showUploadList={false}
          customRequest={customRequest}
        >
          {renderOnLoad()}
        </Dragger>
      </div>
    </Modal>
  );
};

export default AddTask;