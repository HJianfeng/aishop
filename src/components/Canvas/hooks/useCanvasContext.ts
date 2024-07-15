import { Context } from '@/components/Canvas'
import { useContext } from 'react'

function useCanvasContext() {
  const {  state, dispatch, imageOffset, canvasInfo } = useContext(Context)
  return {
    state,
    dispatch,
    imageOffset,
    canvasInfo
  }
}

export default useCanvasContext
