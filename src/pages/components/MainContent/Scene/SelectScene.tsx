import React, { useEffect, useState } from 'react';
import { Modal, Empty } from 'antd';
import { getStyleList } from '@/service';
import { HOST } from '@/constant/host';
import { ISceneItem } from '@/interface';
import styles from './index.module.scss';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (args: ISceneItem) => void;
}

const SelectScene: React.FC<IProps> = (props) => {
  const { visible, onClose, onSelect } = props;

  const [imgList, setImgList] = useState<ISceneItem[]>([])

  useEffect(() => {
    if (visible) {
      getStyleList().then((res: ISceneItem[]) => {
        setImgList(res)
      }).catch(console.log)
    }
  }, [visible]);

  return (
    <Modal
      title="场景/风格选择"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div className={styles.sceneSelectWrap}>
        {
          imgList?.length > 0 ?
            (
              <div className={styles.imgList}>
                {
                  imgList.map((item: ISceneItem) => {
                    return (
                      <div
                        className={styles.item}
                        onClick={() => { onSelect(item); onClose() }}
                      >
                        <img src={`${HOST}/img/style/${item.style_img}`} alt="" />
                      </div>
                    )
                  })
                }
              </div>
            ) :
            <Empty description="暂无可选择风格数据" className={styles.sceneSelectEmpty} />
        }
      </div>
    </Modal>
  );
};

export default SelectScene;