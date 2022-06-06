// api prefix
// @author Pluto <huarse@gmail.com>
// @create 2020/07/01 11:11

import { NetOptions } from '../interface';
const meta = document.querySelector('meta[name="x-server-env"]');
// @ts-ignore
const env = meta?.content || 'sit';

// export const env = 'test';

// 域名配置

/** 是否是相对路径 */
export function isAbsolutePath(url: string) {
  return /^(https?:)?\/\//.test(url);
}

/**
 * 为相对路径请求地址加上 host 前缀
 * @param api 请求地址
 */
export function apiPrefix(api: string) {
  // 如果是绝对路径，则跳过
  if (isAbsolutePath(api)) {
    return api;
  }

  // const domain = domain || 'xxx';
  const urlPrefix = (window as any).userOrigin;

  if (!urlPrefix) {
    return api;
  }

  return `${urlPrefix}${api}`;
}

export default function apiPrefixMiddleware(ctx: NetOptions) {
  ctx.api = apiPrefix(ctx.api);
  return ctx.next();
}

export const URL = (window as any).userOrigin;
