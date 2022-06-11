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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkY5MzM3Nl9vOUQ2VXFqNlFFQzJ2ZWpfMTY1NDEyMjc3MiUyRjAlMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJteXR4bCUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTQzNzI1MzQ1MTk0MDI5NDgxMiUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTYlOUQlOEUlRTUlQkIlQkElRTUlQkQlQUMlMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxMzY1NzA4NjQ1MSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzAwMTAwMTAwMTAwMDAwNiUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlOUQlQUQlRTUlQjclOUUlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlRTYlOUMlODklRTklOTklOTAlRTUlODUlQUMlRTUlOEYlQjglRUYlQkMlODglRTYlQUYlOEQlRTUlQTklQjQlRUYlQkMlODklMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDIwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjIlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNDM3MjUzNDUxOTQwMjk0ODEyJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTYlOUQlOEUlRTUlQkIlQkElRTUlQkQlQUMlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzAwMTAwMTAwMTAwMDAwNkAxNDM3MjUzNDUxOTQwMjk0ODEyQGVtcGxveWVlQG5vcm1hbCIsIm9yZ19pZCI6MzAwMTAwMTAwMTAwMDAwNiwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNjU0OTU5NDMyLCJqdGkiOiJhNGRmNzZhMi04ZDJiLTRkNjEtYWQ5MS02YzJlNDM4ZmJmZTkiLCJjbGllbnRfaWQiOiJzaXQifQ.cHIAa7J-fyUtzeKBAtiqh7cSiTv878sx0TWNb9e6ivSY2t47vHWy_VduuZRv0-lQ2hQj6Gk8ScKLUyl43uBdu57oA-E8VlMmWmNzHGacpF04TK_NGqvJTYQO_OjxLZUQyVTokaUoJRTEZOxnu5Zi-X21iy09YgGKDO-ItBRxW24',
      },
      ...otherOptions,
    });
  },
};
