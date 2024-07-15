//export const HOST = "http://192.168.3.103:8123";
//export const API_HOST = HOST;

let baseURL = ''
let apiHost = '';
if (process.env.NODE_ENV === 'production') {
  // baseURL = 'http://1.117.56.35:8888'
  apiHost = '/goapi'
} else {
  baseURL = 'http://175.24.180.176:9999'
  apiHost = '/goapi'
}
export const HOST = baseURL;
export const API_HOST = HOST+apiHost;
