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
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGd2V3b3JrLnFwaWMuY24lMkZiaXptYWlsJTJGSFFLYU83WGVOd0F4R3czb3ZTNTU2Z2Z6d1J6WTlUTzc2cFJZbkp0cG11NTQ3ZFdDaWNpYklIRHclMkYwJTIyJTJDJTIyaW5kdXN0cnlUeXBlJTIyJTNBJTIyY29tbXVuaXR5JTIyJTJDJTIybG9naW5UeXBlJTIyJTNBJTIybm9ybWFsJTIyJTJDJTIybWVtYmVySWQlMjIlM0ExNDM3MjUzNDUxOTQwMjk0ODEyJTJDJTIybWVtYmVyTmFtZSUyMiUzQSUyMiVFNiU5RCU4RSVFNSVCQiVCQSVFNSVCRCVBQyUyMiUyQyUyMm1vYmlsZSUyMiUzQSUyMjEzNjU3MDg2NDUxJTIyJTJDJTIyb3JnSWQlMjIlM0EzMDAxMDAxMDAxMDAwMDA2JTJDJTIyb3JnTmFtZSUyMiUzQSUyMiVFNiU5RCVBRCVFNSVCNyU5RSVFNiVBRCVBMyVFNSU5RCU5QiVFNyVBNyU5MSVFNiU4QSU4MCVFNiU5QyU4OSVFOSU5OSU5MCVFNSU4NSVBQyVFNSU4RiVCOCUyMiUyQyUyMm9yZ1R5cGUlMjIlM0ElMjJnZW5lcmFsJTIyJTJDJTIycmVnaW9uQ29kZSUyMiUzQSUyMjMzMDEwMjAwMDAwMDAwMDAwMCUyMiUyQyUyMnNob3J0TmFtZSUyMiUzQSUyMjY2NjMzJTIyJTJDJTIydXNlcklkJTIyJTNBMTQzNzI1MzQ1MTk0MDI5NDgxMiUyQyUyMnVzZXJOYW1lJTIyJTNBJTIyJUU2JTlEJThFJUU1JUJCJUJBJUU1JUJEJUFDJTIyJTJDJTIydXNlclR5cGUlMjIlM0ElMjJlbXBsb3llZSUyMiU3RCIsInVzZXJfbmFtZSI6IjMwMDEwMDEwMDEwMDAwMDZAMTQzNzI1MzQ1MTk0MDI5NDgxMkBlbXBsb3llZUBub3JtYWwiLCJvcmdfaWQiOjMwMDEwMDEwMDEwMDAwMDYsInNjb3BlIjpbIndyaXRlIl0sImV4cCI6MTY0OTI1MTI1NSwianRpIjoiYzY5OGU3OWQtZjg5YS00M2E5LTljNjctMzY4ZDE4MGM3MTBmIiwiY2xpZW50X2lkIjoiZGV2In0.kN0-E0NjdKDIG27K6T8tbjBAk1OlltIraFZmiWfxzXTGWsS8xBqaD4UWMx1Yu4y8FjO2iRAK_QE6uUM2RFmj-qS2xo9CYvRvpkYQ5ghkxQMfm2SuLgj1OtkV1XrNGJkAnYw8UvGmeKYvNGr1RjRIWMs4OjROjj1K5oCag19xOks',
      },
      ...otherOptions,
    });
  },
};
