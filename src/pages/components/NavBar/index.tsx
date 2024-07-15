import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from './index.module.scss';

const items: MenuProps['items'] = [
  {
    label: 'AI产品图',
    key: 'task',
  },
  {
    label: 'AI营销',
    key: 'product',
  },
];

const NavBar: React.FC = () => {
  const [current, setCurrent] = useState('task');

  const onSelect: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logoWrap}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img className={styles.logo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA4CAYAAAC7UXvqAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADCgAwAEAAAAAQAAADgAAAAAOcqfbAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAnVJREFUaAXtmM1LVFEYxme0VFppCaLZMBAEQlQgrYUWLgr8C1pIS7et27V34642LdNtVKKrynWClYiLyIURuBIDMfr4PTIzDGfmtTtzzzneq/eFB+75fJ/nfc/M+SiXSqUx8BhcBX9BlqwHMp/APDiwiD2lQcSzjFmLvBRethozVF+1uEjAH6sxQ/UmRwnIteVFwG8ryheshozVT8FHIup89/heBl9BaQFk+R/I4vYF3pW8LCEF2rUJKubyLECCqvU15arLWvkjhNbBTXC3mVxeMvAS0o/Ai2by+s6LgP4a8YG8CnB5N8p5yUCDsPtRCHAjErt8JjJQjh21LvyZHJWBwy4mjD1Eh7e2pp34ORgH14B5caDtNEwB1p140XIuAZvgIWjZJKxBJ9Tr5OjTtHR0mTfnrZ+FftFJyLq1CKkL8EX8FhPdB1XQ4oy6NKblfcedwKeA20z+Boy6TgKWyz73gZnI5BWXbZ8CrgSMdLupP1P5zOcScp28o0IwNyF3QMKygv4DLIHdkALWcPAEBDWfS8glGjI4DV8hBTSchPwoBISMbpK5fWbAPQi65SR8Ou6T5ofWi7dJMAL0bnkdNFuFwjToAztgA/g+XjBl9ybiW0Ck/gdtOheBd0uzhDQ26XiR972hHQcjKYG0kQu2dGIJSBsAc3whwAxNpIYiA5ECbbopMmCGJlJDkYFIgTbdFBkwQxOp4VxnQG+pSZ/mT3ygTZOsNBnYx/H3hM6/0U+XHu+WRsARbFZAkqPyW/pFuWJ2GqFBBnyoibBuZXrwvdTpxDH738DZe9BOwGvqdTcOZr6ueUMwfADugWGgt8tV8Ar8BMHsH0iusLiTGFAXAAAAAElFTkSuQmCC" />
        AIshop
      </div>
      <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
  )
}

export default NavBar;
