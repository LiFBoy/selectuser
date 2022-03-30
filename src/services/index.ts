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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGd2V3b3JrLnFwaWMuY24lMkZiaXptYWlsJTJGSFFLYU83WGVOd0F4R3czb3ZTNTU2Z2Z6d1J6WTlUTzdtek1neFpvZ1RBVnVoUlVQaWJrdFIwZyUyRjAlMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJzdXBlcnZpc2UlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTAlMkMlMjJtb2JpbGUlMjIlM0ElMjIxMzY1NzA4NjQ1MSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzMwMTAwMTAwMDAwMSUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTglQkYlOTAlRTglOTAlQTUlRTclQUUlQTElRTclOTAlODYlRTclQkIlODQlRTclQkIlODclRUYlQkMlODglRTUlOEIlQkYlRTUlODglQTAlRUYlQkMlODklMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyc3VwZXJ2aXNlJTIyJTJDJTIycmVnaW9uQ29kZSUyMiUzQSUyMjMzMDEwMDAwMDAwMDAwMDAwMCUyMiUyQyUyMnNob3J0TmFtZSUyMiUzQSUyMiVFOCVCRiU5MCVFOCU5MCVBNSVFNyVBRSVBMSVFNyU5MCU4NiUyMiUyQyUyMnVzZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTMlMkMlMjJ1c2VyTmFtZSUyMiUzQSUyMiVFNiU5RCU4RSVFNSVCQiVCQSVFNSVCRCVBQyUyMiUyQyUyMnVzZXJUeXBlJTIyJTNBJTIyZW1wbG95ZWUlMjIlN0QiLCJ1c2VyX25hbWUiOiIzMzAxMDAxMDAwMDAxQDE0MzcyNTM0NTE5NDAyOTQ4MTNAZW1wbG95ZWVAbm9ybWFsIiwib3JnX2lkIjozMzAxMDAxMDAwMDAxLCJzY29wZSI6WyJ3cml0ZSJdLCJleHAiOjE2NDc0NDM5MzEsImp0aSI6ImJkOTZlNDM5LWFlMWMtNGYzZS04NmY1LTA0NDg1NWZiMmM3ZCIsImNsaWVudF9pZCI6InNpdCJ9.ZGaNz5fG44HA3taXp0lDDRYsG8cnDo6NaJtesG7IubwLKNP3cuEtFq48gz98lOBIlMuQpTxoMN4nDJciDyP735hAEAtCmmkPqX4LzJfq1JjQZjnP-cE8kzRDGLywAtuCEmLN5lLuziIfL27ULcqp_scbtYQuOPJzI3BCy87CPbE',
      },
      ...otherOptions,
    });
  },
};
