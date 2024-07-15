import React from 'react';
import styles from './index.module.scss';

const lists = [
  {
    key: 'normal',
    name: '常规'
  },
  {
    key: 'advanced',
    name: '高级'
  },
]

interface IProps {
  current: string;
  onChange: (arg: string) => void;
}

const CanvasConfigNavBar: React.FC<IProps> = (props) => {

  const { current, onChange } = props;


  return (
    <div className={styles.navBox}>
      {
        lists.map((listItem: { key: string, name: string }, index: number) => {
          return (
            <div
              key={listItem.key}
              className={`${styles.navItem} ${current === listItem.key ? styles.active : null}`}
              onClick={() => { onChange(listItem.key) }}
            >
              {listItem.name}
            </div>
          )
        })
      }
    </div>
  )
};

export default CanvasConfigNavBar;