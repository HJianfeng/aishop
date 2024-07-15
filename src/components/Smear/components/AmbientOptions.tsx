import { fabric } from 'fabric'
import { SelectFont, FontColor } from '@/pages/Tool/components/options'

interface IProps {
  canvas: fabric.Canvas | null
  canvasClass: any
}
function AmbientOptions({ canvas, canvasClass }: IProps) {
  const activeObjects = canvas?.getActiveObject()
  console.log(activeObjects)
  const objType = activeObjects?.type
  return (
    <div>
      {
        objType === 'textbox'? <Textbox canvas={canvas} canvasClass={canvasClass} />:null
      }
    </div>
  )
}


function Textbox({ canvas, canvasClass }: IProps) {
  const activeObjects: any = canvas?.getActiveObject()
  if(!activeObjects || !canvas) {
    return (<div></div>)
  }
  return (
    <div>
      <div className='bg-[#EFF2FF] mb-[10px] border border-[#D4DCFF] rounded-[5px] h-[40px] flex items-center justify-center px-[14px]'>
        {activeObjects.text}
      </div>
      <div className='mb-[10px]'>
        <SelectFont canvas={canvas} curSelectObj={activeObjects} />
      </div>
      <div className='mb-[10px]'>
        <FontColor canvas={canvas} curSelectObj={activeObjects} />
      </div>
    </div>
  )
}


export default AmbientOptions