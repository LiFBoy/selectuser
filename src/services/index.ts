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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkYxMTUzMjdfQlNZbWN5OVBULVNhSlJ1XzE2NTYzOTEwMzMlMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIybXl0eGwlMjIlMkMlMjJsb2dpblR5cGUlMjIlM0ElMjJub3JtYWwlMjIlMkMlMjJtZW1iZXJJZCUyMiUzQTE0MzcyNTM0NTE5NDAyOTQ4MTIlMkMlMjJtZW1iZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIybW9iaWxlJTIyJTNBJTIyMTM2NTcwODY0NTElMjIlMkMlMjJvcmdJZCUyMiUzQTMwMDEwMDEwMDEwMDAwMDYlMkMlMjJvcmdOYW1lJTIyJTNBJTIyJUU2JTlEJUFEJUU1JUI3JTlFJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJUU2JTlDJTg5JUU5JTk5JTkwJUU1JTg1JUFDJUU1JThGJUI4JUVGJUJDJTg4JUU2JUFGJThEJUU1JUE5JUI0JUVGJUJDJTg5JTIyJTJDJTIyb3JnVHlwZSUyMiUzQSUyMmdlbmVyYWwlMjIlMkMlMjJyZWdpb25Db2RlJTIyJTNBJTIyMzMwMTAyMDAwMDAwMDAwMDAwJTIyJTJDJTIyc2hvcnROYW1lJTIyJTNBJTIyJUU2JUFEJUEzJUU1JTlEJTlCJUU3JUE3JTkxJUU2JThBJTgwJTIyJTJDJTIydXNlcklkJTIyJTNBMTQzNzI1MzQ1MTk0MDI5NDgxMiUyQyUyMnVzZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIydXNlclR5cGUlMjIlM0ElMjJlbXBsb3llZSUyMiU3RCIsInVzZXJfbmFtZSI6IjMwMDEwMDEwMDEwMDAwMDZAMTQzNzI1MzQ1MTk0MDI5NDgxMkBlbXBsb3llZUBub3JtYWwiLCJvcmdfaWQiOjMwMDEwMDEwMDEwMDAwMDYsInNjb3BlIjpbIndyaXRlIl0sImV4cCI6MTY1ODIzMzE2MywianRpIjoiNDgyMWQxYmUtMjFlOC00MjllLTlhM2EtMjY3MWYyMWU0YzgxIiwiY2xpZW50X2lkIjoic2l0In0.kwg0hzaDkhAgxkQYoR5ZkRFpfc-XgRNlR-rXjbPHzbtE3JVoO3fZeT6mdJR5bq0cDlYSimmG9RdK9jcY2yNGTNQ2BRuW5eOipK_DsHkrMeErtErPBW60UMfk9oJeq4-rzExCSjqOzLbpIkGT6kfdrRq9GGauT-lzUIX2eU6KhW8',
      },
      ...otherOptions,
    });
  },
};
