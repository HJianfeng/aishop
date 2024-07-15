import { useEffect, useRef, useState } from 'react'
import { Image, Button } from 'antd'
import { ZoomInOutlined } from '@ant-design/icons';
import { onDownloadImg } from '@/utils'
import BgIcon from '@/assets/bg.jpeg'
import { fabric } from 'fabric'
import { useDispatch } from 'react-redux'
import { hideTooltip } from '@/store/toolSlice'
import CompareImg from './CompareImg';

interface IProp {
	originImg: any
	previewImg: any
	originImgTag?: string
	previewImgTag?: string
	uploadButton: any
	buttonSlot?:any
	root: string
	type?: string
	className?: string
	afterDownload?: (url: string) => void
	isCompare?: boolean
	compareTag?: string
	hdMultiple?: number
}
const PreviewImg = (prop: IProp) => {
  const dispatch = useDispatch()
	const imgContainerRef: any = useRef(null)
	const [originHeight, setOriginHeihgt] = useState()
	const [originImgInfo, setOriginImgInfo] = useState<{width?: number, height?: number}>({})
	const [previewImgInfo, setPreviewImgInfo] = useState<{width?: number, height?: number}>({})

	function dowmloadImg() {
		const downData: any = {
      url: prop.previewImg?.img,
			action_type: 'tool',
			root: prop.root
    }
		prop.afterDownload?.(downData.url)
		onDownloadImg(prop.previewImg?.img)
		dispatch(hideTooltip(prop.type || 'hd'))
	}
  const maskRender: any = () => {
    return (
      <div className='w-full h-full relative'>
        <div className='absolute left-1/2 top-1/2 m-[-10px]'><ZoomInOutlined className='text-[20px]' /></div>
      </div>
    )
  }
	function handleResize(e?: Event) {
		if(imgContainerRef.current) {
			setOriginHeihgt(imgContainerRef.current.offsetWidth)
		}
	}
	useEffect(() => {
		if(prop.type === 'hd') {
			getImgInfo(prop.originImg, (img) => {
				setOriginImgInfo({
					width: img.width,
					height: img.height,
				})
				if(prop.hdMultiple) {
					setPreviewImgInfo({
						width: img.width * prop.hdMultiple,
						height: img.height * prop.hdMultiple,
					})
				}
			})
			getImgInfo(prop.previewImg.img, (img) => {
				setPreviewImgInfo({
					width: img.width,
					height: img.height,
				})
			})
		}
		handleResize()
		// container.current.add	
		window.onresize = handleResize;
		return () => {
			window.onresize = null;
		}
	}, []) 

	function getImgInfo(url: string, callback: (img: any) => void){
		fabric.Image.fromURL(url, (img: any) => {
			callback(img)
		})
	}
	return (
		<div className={`${prop.className || ''} w-full h-full pt-[40px] px-[20px]`}>
			{
				<div className='flex justify-center items-center w-full'>
					{
						prop.isCompare? 
							<CompareImg 
								originImg={prop.originImg} previewImg={prop.previewImg.tbn_img} 
								originImgInfo={originImgInfo} 
								previewImgInfo={previewImgInfo}
								compareTag={prop.compareTag}
							/>
						:
						<>
							<div ref={imgContainerRef} style={{height: `${originHeight}px`}} className='relative bg-white flex-1 max-w-[500px] max-h-[500px]'>
								<Image
									width={'100%'}
									height={'100%'}
									style={{
										width: '100%',
										height: '100%',
									}}
									className='object-contain'
									src={prop.originImg} 
									preview={{
										mask: maskRender()
									}}/>
									<div className='absolute top-[5px] right-[5px]  bg-black px-[11px] py-[5px] text-white rounded-[4px] bg-opacity-80 text-[14px]'>
										原图
									</div>
									{
										prop.type === 'hd' && originImgInfo.width && originImgInfo.height?
										<div className='text-[#ACACAC] text-[14px]'>{`原图 ${originImgInfo.width} x ${originImgInfo.height}`}</div>
										: null
									}
							</div>
							<div className='w-[20px]'></div>
							<div style={{height: `${originHeight}px`}} className='relative bg-white flex-1 max-w-[500px] max-h-[500px]'>
								<Image
									width={'100%'}
									height={'100%'}
									style={{
										width: '100%',
										height: '100%',
										background: prop.type === 'cutout'?`url(${BgIcon}) repeat`:''
									}}
									className='object-contain'
									src={prop.previewImg.img} 
									preview={{
										mask: maskRender()
									}}/>
									<div className='absolute top-[5px] right-[5px]  bg-black px-[11px] py-[5px] text-white rounded-[4px] bg-opacity-80 text-[14px]'>
										{prop.previewImgTag || '抠完'}
									</div>
									{
										prop.type === 'hd' && previewImgInfo.width && previewImgInfo.height?
										<div className='text-[#ACACAC] text-[14px]'>{`高清 ${previewImgInfo.width} x ${previewImgInfo.height}`}</div>
										: null
									}
							</div>
						</>
					}
					
				</div>
			}
			
			<div className='flex justify-center mt-[50px]'>
				{prop.uploadButton}
				<Button onClick={() => dowmloadImg()} className='ml-[22px] w-[130px] h-[51px] text-[16px] text-[#fff]' type='primary'>下载图片</Button>
				{prop.buttonSlot}
			</div>
		</div>

	)
}

export default PreviewImg;