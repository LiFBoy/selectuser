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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGd2V3b3JrLnFwaWMuY24lMkZiaXptYWlsJTJGMWlidWY2RkVGRjhaSTJIYW9ueEJrZ0dFZGlhZ3Z4aFA3T010NHo5WGtjVldsRVZxZmxuMEl3aWNBJTJGMCUyMiUyQyUyMmluZHVzdHJ5VHlwZSUyMiUzQSUyMmNvbW11bml0eSUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTQzNzI1MzQ1MTk0MDI5NDgxNiUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTklQUIlOTglRTUlQTglOUMlMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxODg5NjU5ODMyNSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzAwMTAwMTAwMTAwMDAwNiUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlOUQlQUQlRTUlQjclOUUlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlRTYlOUMlODklRTklOTklOTAlRTUlODUlQUMlRTUlOEYlQjglMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDIwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjI2NjYzMyUyMiUyQyUyMnVzZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTYlMkMlMjJ1c2VyTmFtZSUyMiUzQSUyMiVFOSVBQiU5OCVFNSVBOCU5QyUyMiUyQyUyMnVzZXJUeXBlJTIyJTNBJTIyZW1wbG95ZWUlMjIlN0QiLCJ1c2VyX25hbWUiOiIzMDAxMDAxMDAxMDAwMDA2QDE0MzcyNTM0NTE5NDAyOTQ4MTZAZW1wbG95ZWVAbm9ybWFsIiwib3JnX2lkIjozMDAxMDAxMDAxMDAwMDA2LCJzY29wZSI6WyJ3cml0ZSJdLCJleHAiOjE2NDk2MTI5ODEsImp0aSI6Ijc3MmE3NDI4LWI4OWEtNDNkNy1iMmRmLWU4YzFhMWYwMGJkOSIsImNsaWVudF9pZCI6ImRldiJ9.N4aEMD6niFKtFaqo_bir7hJZjEBO_nQhj1IIvn_RDjjPW4n2iaA521hrTk475ZmSr2-rI_KNruBaw5Kinbdw6UOj5z6WK1d8ZhrM4rhXBg1Ds-4Q-h0PcDlGT2ESLp6ASDHo_-Y5UrqgT29aLd1-xl-5_uOWj8pLdHYvKUL-qaU',
      },
      ...otherOptions,
    });
  },
};
