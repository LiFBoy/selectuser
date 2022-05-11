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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjIlMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJkaXNhYmxlZCUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTUyMzU4NDA1ODU0MzEyNDQ4MSUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTklQUIlOTglRTUlQTglOUMlMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxODg5NjU5ODMyNSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzMwMTAwMTAwMDA2OSUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlQUUlOEIlRTclOTYlQkUlRTQlQkElQkElRTclQkIlODQlRTclQkIlODdnbjIlMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDAwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjIlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTIzNTg0MDU4NTQzMTI0NDgxJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTklQUIlOTglRTUlQTglOUMlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzMwMTAwMTAwMDA2OUAxNTIzNTg0MDU4NTQzMTI0NDgxQGVtcGxveWVlQG5vcm1hbCIsIm9yZ19pZCI6MzMwMTAwMTAwMDA2OSwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNjUyMjQyOTk1LCJqdGkiOiIzOWNhZjQ2ZC0xYzIwLTRiNWItOWZmZS02ZGEwM2E1OGE4ODAiLCJjbGllbnRfaWQiOiJzaXQifQ.UEXTFVmUsQ_YbPCsu7VyInoDwix4xoocZ3Iqh56UKXetPuwDVnjVWs4igpK0j5WVnEpqq70lqC6Z1AhDz9pjX_QztdM3AWKjTUPr19txvStYM7lWMn73UCobatnhRvJRG2LP1VOk_-ggxRNoEGSNCd9oCNhxLDoTVVGcRETzFJs',
      },
      ...otherOptions,
    });
  },
};
