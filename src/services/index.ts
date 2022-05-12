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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkY0ODgxNzdfV2lSOUhCX0ZSTktDMXZfXzE2NTA2Mzg0MTQlMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE1MjI0MTcyODcwNjc2NzI2MzglMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU4JUEyJTgxJUU2JUI1JUI3JUU3JTg3JTk1JTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTM3NTcxOTU2MzElMjIlMkMlMjJvcmdJZCUyMiUzQTMwMDEwMDEwMDEwMDAwMDYlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAyMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyNjY2MzMlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTIyNDE3Mjg3MDY3NjcyNjM4JTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTglQTIlODElRTYlQjUlQjclRTclODclOTUlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzAwMTAwMTAwMTAwMDAwNkAxNTIyNDE3Mjg3MDY3NjcyNjM4QGVtcGxveWVlQG5vcm1hbCIsIm9yZ19pZCI6MzAwMTAwMTAwMTAwMDAwNiwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNjUyMjk4Nzg2LCJqdGkiOiJiNjUxZTk1NS03MDI4LTQ0OTktYTI0Ni1kOTc2OTJmMDIxMzYiLCJjbGllbnRfaWQiOiJkZXYifQ.ayFjX9pHxfXvnOo7xT7xMxZzrhrZssN5_GCQoyfSYQ44SABQQZQLgrWwDzOPL1dN6jxUIr4DMBaWIaw620-DR7iZ04eKlUlVVJWl7Ib7r2HIRjNaF5MdQq3VnVDMUCHWgLoqkXeF87tXaHoS22gHrSFljXeH2dYH7w10ro0Jvrw',
      },
      ...otherOptions,
    });
  },
};
