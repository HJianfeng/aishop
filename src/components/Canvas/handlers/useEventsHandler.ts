import {  useEffect } from 'react'
import { useCanvasContext } from '@/components/Canvas/hooks'

function useEventHandlers() {
  const { state, imageOffset } = useCanvasContext();
  const { canvas } = state;
  useEffect(() => {
    if (!canvas) {
      return;
    }

    // 拖拽
    const handleMouseDown = () => {
      // const handleMouseMove = (e: fabric.IEvent<MouseEvent>) => {
      // }

      const handleMouseLeave = (e: any) => {
        const defaultWidth = imageOffset.current.width
        const defaultX = imageOffset.current.x
        const defaultY = imageOffset.current.y
        imageOffset.current = {
          x: e?.target?.left.toFixed(2) || defaultX,
          y: e?.target?.top.toFixed(2) || defaultY,
          width: (e?.target?.width * e?.target?.scaleX) || defaultWidth,
          angle: e?.target?.angle || 0
        }
        console.log(imageOffset.current);
        // @ts-ignore
        // canvas.off('mouse:move', handleMouseMove)
        // @ts-ignore
        canvas.off('mouse:up', handleMouseLeave)
        // @ts-ignore
        canvas.off('mouse:out', handleMouseLeave)
      }
      // canvas.on('mouse:move', handleMouseMove)
      canvas.on('mouse:up', handleMouseLeave)
      canvas.on('mouse:out', handleMouseLeave)
    }

    // canvas.on('object:added', (e: any) => {
    //   console.log('object:added', e);
      
    // })
    canvas.on('mouse:down', handleMouseDown)
    return () => {
      canvas.off("mouse:down", handleMouseDown)
    }
  }, [canvas])
  
}

export default useEventHandlers
