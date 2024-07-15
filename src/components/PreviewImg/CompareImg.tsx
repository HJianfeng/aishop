import { useMemo, useState, useRef, useEffect } from "react"
import { Slider } from 'antd'
import Style from './style.module.scss'

interface IProp {
	originImg: any
	previewImg: any
  originImgInfo: {width?: number, height?: number},
  previewImgInfo: {width?: number, height?: number},
	compareTag?: string
}
const CompareImg = ({ originImg, previewImg, originImgInfo, previewImgInfo, compareTag }: IProp) => {
  const [value, setValue] = useState(50)
	const imgContainerRef: any = useRef(null)
	const [originHeight, setOriginHeihgt] = useState()
  function inputChange(e: any) {
    // setValue
    setValue(e)
  }
  const compareLeft = useMemo(() => {
    return `polygon(0% 0%, ${value}% 0%, ${value}% 100%, 0% 100%)`
  }, [value])
  const compareRight = useMemo(() => {
    return `polygon(100% 0%, ${value}% 0%, ${value}% 100%, 100% 100%)`
  }, [value])

  function handleResize(e?: Event) {
		if(imgContainerRef.current) {
			setOriginHeihgt(imgContainerRef.current.offsetWidth)
		}
	}
  useEffect(() => {
		handleResize()
		// container.current.add	
		window.onresize = handleResize;
		return () => {
			window.onresize = null;
		}
	}, []) 
  return (
    <div className="flex justify-center items-center w-full">
      {/* style={{ width: `${originImgInfo.width}px`, height: `${originImgInfo.height}px`, minWidth: '200px', minHeight: '200px' }} */}
      <div ref={imgContainerRef} style={{height: `${originHeight}px`}} className="relative flex-1 max-w-[500px] max-h-[500px]">
        <img src={originImg} className="w-full h-full object-contain absolute" style={{ clipPath: compareLeft }} alt="" />
        <img src={previewImg} className="w-full h-full object-contain absolute" style={{ clipPath: compareRight }} alt="" />
        <Slider className={Style.slider} tooltip={{ open: false }} value={value} onChange={inputChange} />

        <div className="absolute bottom-[-30px] w-full flex justify-between">
          {
            originImgInfo.width && originImgInfo.height?
            <div className='text-[#ACACAC] text-[14px]'>{`原图 ${originImgInfo.width} x ${originImgInfo.height}`}</div>
            : null
          }
          {
            previewImgInfo.width && previewImgInfo.height?
            <div className='text-[#ACACAC] text-[14px]'>{`${compareTag || '扩大'} ${previewImgInfo.width} x ${previewImgInfo.height}`}</div>
            : null
          }
        </div>
      </div>
    </div>
  )
}

export default CompareImg