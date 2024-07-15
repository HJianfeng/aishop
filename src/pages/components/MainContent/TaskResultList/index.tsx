import React, { useEffect, useState } from 'react';
import { Empty, Spin, Button, message , Modal } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import Viewer from 'react-viewer';
import PubSub from 'pubsub-js';
import { getImgUrl, getBigImgUrl } from '@/utils/location';
import { getImgListInner, getImgList, taskDetailDelete, upscale } from '@/service';
import { ISelectItem } from '@/interface'
import styles from './index.module.scss';
import { getUrlParams } from '@/utils';
import axios from 'axios'


interface IProps {
  selectItem: ISelectItem
}

const urlParams = getUrlParams();
const api = urlParams.dev === 'true' ? getImgListInner : getImgList

const ResultList: React.FC<IProps> = (props) => {
  const { selectItem } = props;
  const [imgList, setImgList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadImgLoading, setLoadImgLoading] = useState(false);
  const [loadIndex, setLoadIndex] = useState(-1)
  const [delInfo, setDelInfo] = useState({
    id: '',
    index: -1
  });

  const [info, setInfo] = useState({
    id: '',
    index: -1
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // 获取任务list
  const getList = (params: { task_id: string }) => {
    setLoading(true);
    api({...params, page_index: 1, page_size:24}).then(res => {
      setImgList(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  }

  function downloadImg(url: string, name?: string) {
    setLoadImgLoading(true);
    axios(url)
      .then((res:any) => {
        console.log(res);
        res.blob().then((blob:any) => {
          let a = document.createElement('a');
          let url = window.URL.createObjectURL(blob);
          let filename = name || '图片.jpg'
          a.href = url;
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(url);
          setLoadImgLoading(false);
        }).catch(() => {
          setLoadImgLoading(false);
          message.error('下载失败，请稍后再试')
        })
      })
  }

  // 删除
  const onRemove = () => {
    taskDetailDelete({ task_detail_id: delInfo.id }).then(res => {
        getList({ task_id: selectItem?.id });
        setDelInfo({ id: '', index: -1 })
    }).catch((error) => {
      message.error(error?.message || '服务异常')
    })
  }

  // 下载
  const onDownLoad = (url: string, name: string) => {
    downloadImg(url, name)
  }

  // hd 图片生成
  const onHdImgCreate = (url: string, id: string) => {
    setLoadImgLoading(true);
    upscale({ img_file: url,task_detail_id:id }).then((res: any) => {
      if (Number(res?.data?.code) === 0) {
        downloadImg(`${getBigImgUrl()}/${res?.data?.data}`, res?.data?.data)
      } else {
        message.error(res?.data?.message || '服务异常')
      }
      setLoadImgLoading(false);
    }).catch((error) => {
      setLoadImgLoading(false);
      message.error(error?.message || '服务异常');
    })
  }

  useEffect(() => {
    if (selectItem?.id) {
      getList({ task_id: selectItem?.id });
    }
  }, [selectItem?.id]);

  useEffect(() => {

    PubSub.subscribe('setLoading', () => {
      setLoading(true);
    })
    PubSub.subscribe('cancelSetLoading', () => {
      setLoading(false);
    })

    PubSub.subscribe('updateImgResultList', (name, params) => {
      getList(params);
    })
  }, [])


  return (
    <>
      <Spin tip="加载中..." spinning={loading}>
        <div className={styles.resultList}>
          <div>生成结果</div>
          {
            imgList?.length > 0 ?
              <div className={styles.imgListWrap}>
                <div className={styles.imgListContent}>
                  {
                    imgList.map((item: any, index: number) => {
                      return (
                        <Spin spinning={loadIndex === index && loadImgLoading} key={item?.id}>
                          <div className={styles.itemWrap}>
                            <div className={styles.imgItem}>
                              <img src={`${getImgUrl()}/${item?.tbn_img}`} alt='' />
                            </div>
                            <div className={styles.actionWrap} onClick={() => {
                              setLoadIndex(index);
                              setVisible(true);
                            }}>
                              <div className={styles.action}>
                                <Button
                                  className={`${styles.handle}`}
                                  size="small"
                                  type="text"
                                  shape="round"
                                  onClick={(e) => {
                                    setLoadIndex(index)
                                    onHdImgCreate(item?.img,item?.id);
                                    e.stopPropagation();
                                  }}
                                >
                                  HD
                                </Button>
                                <div className={styles.actionRight}>
                                  <Button
                                    className={styles.handle}
                                    type="text"
                                    shape="round"
                                    icon={<DownloadOutlined />}
                                    size="small"
                                    onClick={(e) => {
                                      setLoadIndex(index);
                                      onDownLoad(`${getImgUrl()}/${item?.img}`, item?.img);
                                      e.stopPropagation();
                                    }}
                                  />
                                  <Button
                                    className={`${styles.handle} ${styles.remove}`}
                                    size="small"
                                    type="text"
                                    shape="round"
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => { setDelInfo({ id: item?.id, index }); e.stopPropagation();}}
                                  />
                                  {urlParams?.dev === 'true' ? <Button
                                  className={`${styles.handle} ${styles.remove}`}
                                  size="small"
                                  type="text"
                                  shape="round"
                                  onClick={(e) => {
                                    setIsModalOpen(true);
                                    setInfo({ id: item?.id, index });
                                    e.stopPropagation();
                                  }}
                                >
                                  INF
                                </Button> : null}
                                  

                                </div>

                                
                              </div>
                            </div>
                            <div className={`${styles.deleteWrap} ${(delInfo.index === index && !loadImgLoading) && styles.show}`}>
                              <div className={styles.deleteTitle}>确定删除该图片吗</div>
                              <div className={styles.confirmWrap}>
                                <Button type="primary" size="small" onClick={onRemove}>确定</Button>
                                <Button className={styles.cancel} size="small" onClick={() => setDelInfo({ id: '', index: -1 })}>取消</Button>
                              </div>
                            </div>
                          </div>
                        </Spin>
                      )
                    })
                  }
                </div>
              </div>
              :
              <Empty description="暂无数据" className={styles.empty} />
          }
        </div>
      </Spin>
      <Viewer
        visible={visible}
        onClose={() => setVisible(false)}
        images={[{ src: `${getImgUrl()}/${imgList[loadIndex]?.img}`, alt: '' }]}
        changeable={false}
        // zoomable={false}
        showTotal={false}
        noToolbar={true}
        noFooter={true}
        disableMouseZoom={true}
        drag={false}
        onMaskClick={() => setVisible(false)}
      />

      <Modal title="图片信息" open={isModalOpen} onCancel={handleOk}  footer={null}>
        <p>{imgList[info?.index]?.img_info}</p>
      </Modal>

    </>
  )
}



export default ResultList;
