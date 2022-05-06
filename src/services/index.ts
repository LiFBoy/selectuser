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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjIlMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJkaXNhYmxlZCUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTUyMjQwMDQ0NzM0NjQxNzY2NiUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTUlQjAlOEYlRTQlQjglOEQlRTclODIlQjklMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxMzc1NzE5NTYzMSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzMwMTAwMTAwMDA2OCUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlQjUlOEIlRTglQUYlOTUlRTYlQUUlOEIlRTclOTYlQkUlRTQlQkElQkElRTQlQjklOEIlRTUlQUUlQjYlMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDAwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjIlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTIyNDAwNDQ3MzQ2NDE3NjY2JTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTUlQjAlOEYlRTQlQjglOEQlRTclODIlQjklMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzMwMTAwMTAwMDA2OEAxNTIyNDAwNDQ3MzQ2NDE3NjY2QGVtcGxveWVlQG5vcm1hbCIsIm9yZ19pZCI6MzMwMTAwMTAwMDA2OCwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNjUxODU2NTU3LCJqdGkiOiIyY2ZkN2Q5Ny03MWI4LTQ2MGEtYjJhYS1mZjg2MzMxMmEwZjQiLCJjbGllbnRfaWQiOiJkZXYifQ.SfYH6epqswA1CLnpbI5iJMpCHMXfIprV8i4rVp1aB7qP0ERbY1aRRYjvNr9ppVtqiGdG-f3KRx_3SjrjwPJ-8CnCceddvdFSkg585oAMboJh3GHTfV-uIaXHvLZGfE3M8nKU4TTzsT13oYgZwmSOnNBYiiBSXYmPyHJYotc2uCk',
      },
      ...otherOptions,
    });
  },
};
