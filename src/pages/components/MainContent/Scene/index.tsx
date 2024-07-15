import React, { useState } from 'react';
import { Button, message } from 'antd';
import PubSub from 'pubsub-js';
import { HOST } from '@/constant/host';
import { imgCreate, imgCreateInner } from '@/service';
import { useCanvasContext } from '@/components/Canvas/hooks';
import { getUrlParams } from '@/utils';
import { ISceneItem } from '@/interface';
import SelectScene from './SelectScene';
import styles from './index.module.scss';

const urlParams = getUrlParams();
const api = urlParams.dev === 'true' ? imgCreateInner : imgCreate
console.log("current mode:",urlParams.dev)

const Scene: React.FC<any> = (props) => {
  const { config } = props;
  const [styleConfig, setStyleConfig] = useState<ISceneItem>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { imageOffset, state } = useCanvasContext();

  const { devParams } = state;

  const onCreate = () => {
    setLoading(true);
    const x = parseInt(imageOffset.current.x + '');
    const y = parseInt(imageOffset.current.y + '')
    const width = parseInt(imageOffset.current.width + '')
    const params = {
      task_id: config?.id,
      style_id: styleConfig?.id || -1,
      coordinate: `${x},${y}`,
      style_name: styleConfig?.style_name || '随机风格',
      batch_number: 4,
      img_width: width,
    }
    const data = {
      ...devParams,
      clip: Number(devParams?.clip),
      mask_blur: Number(devParams?.mask_blur),
      seed: Number(devParams?.seed),
      inpainting_fill: Number(devParams?.inpainting_fill),
      steps: Number(devParams?.steps),
      cfg_scale: Number(devParams?.cfg_scale),
      denoising_strength: Number(devParams?.denoising_strength),
      cnargs_need_img: Number(devParams?.cnargs_need_img),
      cnargs_weight: Number(devParams?.cnargs_weight),
      cnargs_guidance_start: Number(devParams?.cnargs_guidance_start),
      cnargs_guidance_end: Number(devParams?.cnargs_guidance_end),
    }
    
    PubSub.publish('setLoading');
    api(params, data).then((res) => {
      if(Number(res?.data?.code) === 0) {
        PubSub.publish('updateImgResultList', { task_id: config?.id });
      } else {
        message.error(res?.data?.message || '服务异常');
        PubSub.publish('cancelSetLoading');
      }
      setLoading(false);
    }).catch((error) => {
      message.error('连接图片服务器失败');
      PubSub.publish('cancelSetLoading');
      setLoading(false);
    })
  }

  return (
    <>
      <div className={styles.configBottom}>
        <div className={styles.left}>
          <div className={styles.info}>
            <div className={styles['info-tip']}>场景/风格选择</div>
            <div className={styles['info-title']}>{styleConfig?.style_name || '随机风格'}</div>
          </div>
          <img src={styleConfig?.style_img ? `${HOST}/img/style/${styleConfig?.style_img}` : 'https://web-1304948377.cos.ap-shanghai.myqcloud.com/ai-web/random-style-f6f6537e.png'} alt="" onClick={() => setVisible(true)} />
        </div>
        <div className={styles.right}>
          <Button style={{ width: 90 }} type="primary" loading={loading} onClick={onCreate}>生成</Button>
        </div>
      </div>
      <SelectScene
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={(item: ISceneItem) => setStyleConfig(item)}
      />
    </>
  )
};

export default Scene;