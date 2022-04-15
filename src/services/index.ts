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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGd2V3b3JrLnFwaWMuY24lMkZiaXptYWlsJTJGSFFLYU83WGVOd0F4R3czb3ZTNTU2Z2Z6d1J6WTlUTzdOSlppYzJDcWRLVFFpYTdEMXlVM0ZnVXclMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIyY29tbXVuaXR5JTIyJTJDJTIybG9naW5UeXBlJTIyJTNBJTIybm9ybWFsJTIyJTJDJTIybWVtYmVySWQlMjIlM0ExNDM3MjUzNDUxOTQwMjk0ODEyJTJDJTIybWVtYmVyTmFtZSUyMiUzQSUyMiVFNiU5RCU4RSVFNSVCQiVCQSVFNSVCRCVBQyUyMiUyQyUyMm1vYmlsZSUyMiUzQSUyMjEzNjU3MDg2NDUxJTIyJTJDJTIyb3JnSWQlMjIlM0EzMDAxMDAxMDAxMDAwMDA2JTJDJTIyb3JnTmFtZSUyMiUzQSUyMiVFNiU5RCVBRCVFNSVCNyU5RSVFNiVBRCVBMyVFNSU5RCU5QiVFNyVBNyU5MSVFNiU4QSU4MCVFNiU5QyU4OSVFOSU5OSU5MCVFNSU4NSVBQyVFNSU4RiVCOCUyMiUyQyUyMm9yZ1R5cGUlMjIlM0ElMjJnZW5lcmFsJTIyJTJDJTIycmVnaW9uQ29kZSUyMiUzQSUyMjMzMDEwMjAwMDAwMDAwMDAwMCUyMiUyQyUyMnNob3J0TmFtZSUyMiUzQSUyMiVFNiVBRCVBMyVFNSU5RCU5QiVFNyVBNyU5MSVFNiU4QSU4MCUyMiUyQyUyMnVzZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTIlMkMlMjJ1c2VyTmFtZSUyMiUzQSUyMiVFNiU5RCU4RSVFNSVCQiVCQSVFNSVCRCVBQyUyMiUyQyUyMnVzZXJUeXBlJTIyJTNBJTIyZW1wbG95ZWUlMjIlN0QiLCJ1c2VyX25hbWUiOiIzMDAxMDAxMDAxMDAwMDA2QDE0MzcyNTM0NTE5NDAyOTQ4MTJAZW1wbG95ZWVAbm9ybWFsIiwib3JnX2lkIjozMDAxMDAxMDAxMDAwMDA2LCJzY29wZSI6WyJ3cml0ZSJdLCJleHAiOjE2NTAwMzI0MDcsImp0aSI6ImVkMjY3ZTk4LWFiNjYtNGFjMi1hMzZlLWRjNjNmZjNhNTJkZiIsImNsaWVudF9pZCI6InNpdCJ9.ElRRuPBxi5RITeQp8LKO-EL-MfnzYh5h1jIY0LEJ2pksUldtKRtv3Py2P8h5hB6gxIrTVlBylLux76RZCbpkQgI5GNj8sq0ChsqGmCfejQGhVcuHXVusKQNte4JlpCEBeNnFmTjaWnMlORu94eSDCBP1GOFCk2YZwDO0fzaRCOE',
      },
      ...otherOptions,
    });
  },
};
