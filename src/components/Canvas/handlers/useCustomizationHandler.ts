// @ts-nocheck
import { useEffect } from 'react'

function useCustomizationHandler() {
  /**
   * Customize fabric controls
   */
  useEffect(() => {
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.borderColor = '#00D9E1'
    fabric.Object.prototype.cornerColor = '#20bf6b'
    fabric.Object.prototype.borderScaleFactor = 2.4
    fabric.Object.prototype.cornerStyle = 'circle'
    fabric.Object.prototype.cornerStrokeColor = '#20bf6b'
    fabric.Object.prototype.borderOpacityWhenMoving = 1
    fabric.Object.prototype.cornerSize = 12

  }, []);
}

export default useCustomizationHandler
