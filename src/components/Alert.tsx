
interface Iprops {
  onClose: () => void
  text: string
  arrow?: 'top' | 'bottom'
  arrowClass?: string
}
const Alert = ({ onClose, text, arrow, arrowClass }: Iprops) => {
  const topArrow = () => {
    return (
      <div className={`absolute top-[-8px] translate-x-[-50%] ${arrowClass?arrowClass:' left-1/2'}`} style={{
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: '8px solid #ffe58f',
      }}>
      </div>
    )
  }
  const bottomArrow = () => {
    return (
      <div className='absolute left-1/2 bottom-[-8px] translate-x-[-50%]' style={{
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '8px solid #ffe58f',
      }}>
      </div>
    )
  }
  return (
    <div className='relative px-[12px] py-[8px] flex items-center bg-[#fffbe6] border border-[#ffe58f] rounded-[8px] text-[14px]'>
      <div className='flex-1 text-[#000]'>{text}</div>
      <div onClick={() => onClose()} className='text-primary cursor-pointer ml-[10px]'>知道啦</div>
      {
        arrow === 'bottom'?
        bottomArrow()
        :
        topArrow()
      }
    </div>
  )
}

export default Alert