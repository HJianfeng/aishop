import React, { FC, createContext, useRef} from 'react';
import LoginDialog from '@/components/LoginDialog'
interface IProps {
  children: React.ReactNode
}

export const Context = createContext<{toLogin?: () => void}>({})

export const LoginProvider: FC<IProps> = ({ children }) => {
  const loginRef: React.MutableRefObject<any> = useRef(null);

  function toLogin() {
    loginRef.current?.showModal()
  }
  const context = { toLogin }
  return (
  <Context.Provider value={context}>
    {children}
    <LoginDialog ref={loginRef} />
  </Context.Provider>)
}
