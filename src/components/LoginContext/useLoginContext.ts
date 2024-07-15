
import { Context } from '@/components/LoginContext'
import { useContext } from 'react'
import { checktoken } from '@/service'
import { getLocalStorage } from '@/utils'

async function toCheckToken(toLogin?: () => void) {
  try {
    const user = getLocalStorage('user')
    if(!user || !user.token) {
      throw new Error()
    }
    const res = await checktoken({ token: user.token });
    if(!res || res === 'false') {
      throw new Error()
    }
    
    return Promise.resolve(true)
  } catch (error) {
    toLogin?.()
    return Promise.reject(false)
  }
}
function useLoginContext() {
  const {  toLogin } = useContext(Context)
  return {
    toLogin,
    toCheckToken: async () => { 
      try {
        await toCheckToken(toLogin)
        return Promise.resolve(true)
      } catch (error) {
        return Promise.reject(false)
      }
     }
  }
}

export default useLoginContext