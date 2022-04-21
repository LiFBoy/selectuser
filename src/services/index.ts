import Saber from '@irim/saber';
import { NetOptions } from './interface';
import optionsFilling from './middlewares/option-filling';
import apiPrefix from './middlewares/api-prefix';
// import mock from './middlewares/mock';

interface ExternalContext {
  /** 是否显示加载中 */
  showLoading: boolean | string;
  /** 是否显示错误信息 */
  showError: boolean | string;
  /** 是否在出错时仍然正确返回 */
  ignoreError: boolean;
}

const saber = Saber.singleton<ExternalContext>();

// saber.use(mock);
saber.use(apiPrefix);
saber.use(optionsFilling);
// saber.use(loadingMessage);

saber.request = saber.request.bind(saber);

export { saber };

export default {
  /** 增加 formatter */
  request: async (api: string, options: Omit<NetOptions, 'api' | 'next'>) => {
    const { formatter, data, ...otherOptions } = options;
    let _data = data || {};
    if (formatter) {
      try {
        _data = await formatter(_data);
      } catch (err) {
        console.warn('请求中断：' + err);
        return;
      }
    }
    return saber.request(api, {
      data: _data,
      headers: {
        // Authorization: window.Authorization
        Authorization:
          (window as any).token ||
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGd2V3b3JrLnFwaWMuY24lMkZiaXptYWlsJTJGSFFLYU83WGVOd0F4R3czb3ZTNTU2Z2Z6d1J6WTlUTzc2cFJZbkp0cG11NTQ3ZFdDaWNpYklIRHclMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTIlMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTM2NTcwODY0NTElMjIlMkMlMjJvcmdJZCUyMiUzQTMwMDEwMDEwMDEwMDAwMDYlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAyMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyNjY2MzMlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNDM3MjUzNDUxOTQwMjk0ODEyJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTYlOUQlOEUlRTUlQkIlQkElRTUlQkQlQUMlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzAwMTAwMTAwMTAwMDAwNkAxNDM3MjUzNDUxOTQwMjk0ODEyQGVtcGxveWVlQG5vcm1hbCIsIm9yZ19pZCI6MzAwMTAwMTAwMTAwMDAwNiwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNjUwNjI2ODEwLCJqdGkiOiJmMTNjY2Q2ZS1mZmRlLTRhZjMtYTE4OC03Yjg2MDMzZmU3YjAiLCJjbGllbnRfaWQiOiJkZXYifQ.JuiQXBiPaxzxkaIKstsyblUJjGMVJYx2bfAzmDCpcZoVCLa6usftt7i2Q4GhJufTMJF9YcRRt32QzgzOkM-n3D-r1w9RO5g6Js6Saodywza_eHcoC7g0poZxGIqq5cKTRJZ2F9h1yuXGGvK551bPPQwY8MPzjZ6XJYgpDaiBEM0',
      },
      ...otherOptions,
    });
  },
};
