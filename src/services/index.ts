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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkYzMjkxNTdfZDBZRDRKUThSS0tyUHVnXzE2NTE4MjA0MDclMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTYlMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU5JUFCJTk4JUU1JUE4JTlDJTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTg4OTY1OTgzMjUlMjIlMkMlMjJvcmdJZCUyMiUzQTMwMDEwMDEwMDEwMDAwMDYlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAyMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJTIyJTJDJTIydXNlcklkJTIyJTNBMTQzNzI1MzQ1MTk0MDI5NDgxNiUyQyUyMnVzZXJOYW1lJTIyJTNBJTIyJUU5JUFCJTk4JUU1JUE4JTlDJTIyJTJDJTIydXNlclR5cGUlMjIlM0ElMjJlbXBsb3llZSUyMiU3RCIsInVzZXJfbmFtZSI6IjMwMDEwMDEwMDEwMDAwMDZAMTQzNzI1MzQ1MTk0MDI5NDgxNkBlbXBsb3llZUBub3JtYWwiLCJvcmdfaWQiOjMwMDEwMDEwMDEwMDAwMDYsInNjb3BlIjpbIndyaXRlIl0sImV4cCI6MTY1MjIxMjg0MiwianRpIjoiYTFmZjMyZjMtMjdmYi00ZDgzLTg1NmEtYzdhYTk3MTAxMjIxIiwiY2xpZW50X2lkIjoic2l0In0.ivkNTh601OXsAkjg8ljRyh_poKQym0BZGZsRRMWWXUw59yCRQivIjLbZW4xjuzNn51cDFesgDQ6loX7u64Q_8Pwl7nGOxRbVGk7kWW860Akmu3DukkNQo-WkNTxlasOb_36JavPzzN0NAem-Qd3PhZIFKzgrBI-k8TwmLWKUBUY',
      },
      ...otherOptions,
    });
  },
};
