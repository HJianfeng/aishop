import Storage from './storage';
import { message }from 'antd'

const storageInstance = new Storage();

/**
 * 设置LS
 * @param {*} name
 * @param {*} value
 * @param {*} expires
 */
export const setLocalStorage = (name: string, value: string | number | Record<string, string | number>, expires: string | number = ''): void => {
  try {
    storageInstance.setItem({
      name,
      value,
      expires,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * 获取LS
 * @param {*} name
 */
export const getLocalStorage = (name: string): any => {
  return storageInstance.getItem(name);
};

export function refreshToken(token: string) {
  const user = getLocalStorage('user');
  console.log(user, token);
  if(token && user) {
    setLocalStorage('user', {
      ...user,
      token
    })
  }
}
/**
 * 删除LS
 * @param {*} name
 */
export const removeLocalStorage = (name: string): any => {
  storageInstance.removeItem(name);
};

/**
 * 获取url？后面参数
 */
export const getUrlParams = (url = window.location.href) => {
  const queryArray = url.split(/[?&]/).slice(1);
  const args: any = {};
  for (let index = 0; index < queryArray.length; index++) {
    const element = queryArray[index].split('=');
    try {
      args[element[0]] = element[1] ? element[1] : ''
    } catch (error) {
        console.log(error)
    }
  };

  return args;
}

export const parseJson = (str: any) => {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str);
    } catch (err) {
      console.error(err);
      return str;
    }
  } else {
    return str;
  }
};

export function phoneCheck(rule: any, value: any, callbackFn: (error?: string) => void) {
  // const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/  // 手机号正则
    const reg = /^(1[3456789]|9[28])\d{9}$/; 
   
     if (!reg.test(value)) {
      callbackFn('手机号码格式不正确')
      return
    }
    callbackFn()
 }

 export function onDownloadImg(src: string, options?:{imgName?: string, beforeDownload?: () => void, afterDownload?: () => void}) {
  const { beforeDownload, afterDownload, imgName } = options || {};

  const img = document.createElement("img");
  img.src = src;
  img.crossOrigin = "anonymous";
  img.setAttribute('crossOrigin', 'anonymous')

  beforeDownload && beforeDownload()
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const { naturalWidth, naturalHeight } = img;
   
    // flip and rotate in canvas
    const angle = (0 * Math.PI) / 180;
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    canvas.width =
      Math.abs(naturalWidth * cosAngle) + Math.abs(naturalHeight * sinAngle);
    canvas.height =
      Math.abs(naturalWidth * sinAngle) + Math.abs(naturalHeight * cosAngle);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, 1);
    ctx.rotate(angle);
    ctx.drawImage(img, -naturalWidth / 2, -naturalHeight / 2);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${imgName || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    afterDownload && afterDownload()
  };
  img.onerror = () => {
    afterDownload && afterDownload()
    message.error('下载失败，请稍后再试')
  }
  
  // beforeDownload && beforeDownload()
  // fetch(src)
  //   .then((response) => response.blob())
  //   .then((blob) => {
  //     const url = URL.createObjectURL(new Blob([blob]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'image.png';
  //     document.body.appendChild(link);
  //     link.click();
  //     URL.revokeObjectURL(url);
  //     link.remove();
  //   }).catch((err) => {
  //     message.error('下载失败，请稍后再试')
  //   }).finally(() => {
  //     afterDownload && afterDownload()
  //   })
};

export function throttle(fn: Function, time = 500) {
  let timer: any;
  return function(...args: any[]) {
    if(!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn(...args)
      }, time)
    }
  }
}
export function isNotNill(num?: number | null) {
  return num || num === 0
}
export function debounce(fn: Function, wait = 100) {
  var timeout: any = null;
  return function(...args: any[]) {
    if(timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args)
    }, wait);
  }
}

interface ImgInfo {
  width: number
  height: number
}
/**
 */

/**
 * 把画布的坐标和里面元素宽度 与 最终生成图片的坐标和里面元素宽度 进行互换，因为前端展示的画布大小和最终生成的画布大小可能不一样
 */
/**
 * 
 * @param frontOpt 前端画布的宽高
 * @param resultInfo 最终生成图片的宽高
 * @param x 坐标
 * @param y 坐标
 * @param img_width 画布中元素的宽度
 * @param img_height 画布中元素的高度
 * @param reverse false: 前端画布 转成 最终图片   true: 最终图片 转成 前端画布
 */
export function handleCoordinate(
  { frontOpt, resultInfo = { width: 512, height: 512 }, x = 0, y = 0, reverse = false, img_width = 0,  img_height = 0 }:
  {
    frontOpt: ImgInfo,
    resultInfo?: ImgInfo, 
    x?: number, 
    y?: number, 
    img_width?: number, 
    img_height?: number
    reverse?: boolean, 
  }
) {
  const hRatio = frontOpt.height / resultInfo.height
  const wRatio = frontOpt.width / resultInfo.width
  const result = {
    x,
    y,
    img_width,
    img_height,
  }
  if (!reverse) {
    // 前端画布 转成 最终图片
    result.x = Math.round((x / wRatio))
    result.y = Math.round((y / hRatio))
    result.img_width = Math.round((img_width / wRatio))
    result.img_height = Math.round((img_height / hRatio))
  }
  else {
    // 最终图片 转成 前端画布
    result.x = Math.round((x * wRatio))
    result.y = Math.round((y * hRatio))
    result.img_width = Math.round((img_width * wRatio))
    result.img_height = Math.round((img_height * hRatio))
  }
  return result
}


export function uploadLimit(file: File, widthLimit = 4096) {
  return new Promise((resolve, reject) => {
    const filseSize = file.size / 1024
    if(filseSize > (15 * 1024)) {
      message.error(`文件大小不能超过15M`)
      reject('文件大小不能超过15M')
      return;
    }
    if(file.type.indexOf('svg') >= 0) {
      message.error(`上传的图片格式不对`)
      reject('上传的图片格式不对')
      return;
    }
    if(window.FileReader) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = function() {
        let image = new Image()
        image.src = fr.result as string;
       
        image.onload = function() {
          const width = image.width;
          const height = image.height;
          if(width >= widthLimit || height >= widthLimit) {
            message.error(`上传的图片的长或宽，超过${widthLimit}px哦，请调整后上传`)
            reject(false)
          } else {
            resolve(this)
          }
        }
        image.onerror = function() {
          message.error('上传的图片的长或宽，超过4096px哦，请调整后上传')
          reject(false)
        }
      }
      fr.onerror = function() {
        message.error('上传的图片的长或宽，超过4096px哦，请调整后上传')
        reject(false)
      }
    } else {
      resolve(true)
    }
  })
}

export function copyToClip(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input: HTMLTextAreaElement = document.createElement('textarea')
      input.setAttribute('readonly', 'readonly')
      input.value = text
      document.body.appendChild(input)
      input.select()
      input.focus()
      if (document.execCommand('copy'))
        document.execCommand('copy')
      document.body.removeChild(input)
      resolve(text)
    }
    catch (error) {
      reject(error)
    }
  })
}

export * from './hook'
export * from './canvas'