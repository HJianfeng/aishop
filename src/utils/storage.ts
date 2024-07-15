export default class Storage {
  name: string;
  constructor() {
    this.name = 'storage';
  }

  // 设置缓存
  setItem(params: any) {
    const defaultOptions = {
      name: '',
      value: '',
      expires: '',
      activityStartTime: new Date().getTime(), // 记录何时将值存入缓存，毫秒级
    };
    // 将defaultOptions和传进来的params合并
    const options = Object.assign({}, defaultOptions, params);
    let target = null;

    if (options.activityStartTime && Number(options.expires) > 0) {
      // 如果startTime 和 expires设置了，则以options.name为key，options为值放进去
      target = JSON.stringify(options);
    } else {
      // 如果options.expires没有设置，则认为是默认方式，就判断一下value的类型
      const type = Object.prototype.toString.call(options.value);
      // 如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
      if (type.indexOf('object') >= 0) {
        options.value = JSON.stringify(options.value);
      }
      target = options.value;
    }

    try {
      localStorage.setItem(options.name, target);
    } catch (error) {
      this.removeItem(options.name);
      console.error(`@ali/ltcom-ltao-u-utils setLocalStorage ${options.name}`, error);
    }
  }

  // 获取缓存数据
  getItem(name: string) {
    const sourceStore = localStorage.getItem(name) as string;
    let store = null;
    let result = null;
    // 先将拿到的试着进行json转为对象的形式
    try {
      store = JSON.parse(sourceStore);
    } catch (error) {
      // 如果不行就不是json的字符串，就直接返回
      store = sourceStore;
    }
    // 如果有startTime 和 expires的值，说明设置了失效时间
    if (store?.startTime && Number(store?.expires) > 0) {
      const date = new Date().getTime();
      // 何时将值取出减去刚存入的时间，与store.expires比较，如果大于就是过期了，如果小于或等于就还没过期
      if (date - store.startTime > Number(store.expires)) {
        // 缓存过期，清除缓存，返回false
        this.removeItem(name);
      } else {
        // 缓存未过期，返回值
        result = store?.value;
      }
    } else {
      // 如果没有设置失效时间，直接返回值
      result = store;
    }

    return result;
  }

  // 移出缓存
  removeItem(name: string) {
    localStorage.removeItem(name);
  }

  // 移出全部缓存
  clear() {
    localStorage.clear();
  }
}