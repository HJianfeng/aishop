import React, { useState } from 'react';
import { getUrlParams } from '@/utils';
import { ISelectItem } from '@/interface';
import TaskResultList from './TaskResultList';
import CanvasArea from '../MainContent/CanvasArea';
import Advanced from './Advanced';
import Scene from './Scene';
import DevConfigParams from './DevConfigParams';
import CanvasConfigNavBar from '../MainContent/CanvasConfigNavBar';
import styles from './index.module.scss';

const MainContent: React.FC = () => {
  const [selectItem, setSelectItem] = useState<any>();
  const [current, setCurrent] = useState('normal');
  const urlParams = getUrlParams();

  return (
    <div className={styles.mainContent}>
      <div
        className={`${styles.mainContentLeft} ${urlParams.dev === 'true' ? styles.dev : null}`}
        
      >
        <div className={styles.configWrap}>
          <CanvasConfigNavBar
            current={current}
            onChange={(key: string) => setCurrent(key)}
          />
          <div className={styles.configContent}>
            <div
              className={`${styles.canvasWrap} ${
                current === 'normal' && styles.show
              }`}
            >
              <CanvasArea data={selectItem} />
            </div>
            <div
              className={`${styles.advancedWrap} ${
                current === 'advanced' && styles.show
              }`}
            >
              <Advanced />
            </div>
          </div>
          {urlParams?.dev === 'true' ? <DevConfigParams config={selectItem} /> : null}
          <Scene config={selectItem} />
        </div>
      </div>
      <TaskResultList selectItem={selectItem} />
    </div>
  );
};

export default MainContent;
