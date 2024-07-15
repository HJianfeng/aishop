import React from 'react';
import Style from './style.module.scss'

interface IProps {
  current: string;
  lists: {key: string, name: string}[]
  onChange: (arg: string) => void;
}

const NavBar: React.FC<IProps> = (props) => {

  const { current, onChange, lists } = props;

  return (
    <div className='flex justify-between items-center text-[#121212] text-[16px] font-bold'>
      {
        lists.map((listItem: { key: string, name: string }) => {
          return (
            <div
              className={`h-[35px] text-center w-[70px] cursor-pointer ${current === listItem.key?Style.navBarActive:''}`}
              key={listItem.key}
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

export default NavBar;