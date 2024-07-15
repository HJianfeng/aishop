import { useRef, useEffect } from 'react'

interface Prop {
  contentWidth?: number
  contentHeight?: number
  identifyCode: string
}
const Identify = (prop: Prop) => {
  const sCanvas = useRef<HTMLCanvasElement>(null);
  const { 
    contentWidth = 120,
    contentHeight = 48,
    identifyCode
  } = prop;
  const colorMin = 50;
  const colorMax = 160;
  const fontSizeMin = 16;
  const fontSizeMax = 40;
  const lineColorMin = 40;
  const lineColorMax = 180;
  
  useEffect(() => {
    drawPic();
  }, [identifyCode]);
  function randomNum(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  // 生成一个随机的颜色
  function randomColor(min:number, max:number) {
    const r = 0;
    const g = randomNum(min, max);
    const b = randomNum(min, max);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function drawPic() {
    const ctx = sCanvas.current?.getContext('2d');
    if(!ctx) return;
    ctx.textBaseline = 'bottom';
    // 绘制背景
    // ctx.fillStyle = randomColor(backgroundColorMin, backgroundColorMax);
    const grad = ctx.createLinearGradient(0, 0, 100, 0);
    grad.addColorStop(0, '#f6a7b2');
    grad.addColorStop(1, '#33b5eb');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, contentWidth, contentHeight);
    // ctx.fillStyle = '#93e49c';
    // ctx.fillRect(0, 0, contentWidth, contentHeight);
    // 绘制文字
    for (let i = 0; i < identifyCode.length; i++) {
      drawText(ctx, identifyCode[i], i);
    }
    drawLine(ctx);
    drawDot(ctx);
  }
  function drawText(ctx: CanvasRenderingContext2D, txt: string, i:  number) {
    ctx.fillStyle = randomColor(colorMin, colorMax);
    ctx.font = randomNum(fontSizeMin, fontSizeMax) + 'px SimHei';
    const x = (i + 1) * (contentWidth / (identifyCode.length + 1));
    const y = randomNum(fontSizeMax, contentHeight - 1);
    var deg = randomNum(-1, 1);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  function drawLine(ctx: CanvasRenderingContext2D) {
    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = randomColor(lineColorMin, lineColorMax);
      ctx.beginPath();
      ctx.moveTo(randomNum(0, contentWidth), randomNum(0, contentHeight));
      ctx.lineTo(randomNum(0, contentWidth), randomNum(0, contentHeight));
      ctx.stroke();
    }
  }
  function drawDot(ctx: CanvasRenderingContext2D) {
    // 绘制干扰点
    // for (let i = 0; i < 30; i++) {
    //   ctx.fillStyle = randomColor(0, 255);
    //   ctx.beginPath();
    //   ctx.arc(randomNum(0, contentWidth), randomNum(0, contentHeight), 1, 0, 2 * Math.PI);
    //   ctx.fill();
    // }
  }
  return (
    <div className="s-canvas">
      <canvas ref={sCanvas} className="rounded-[4px]" width={contentWidth} height={contentHeight}  />
    </div>
  )
}

export default Identify;