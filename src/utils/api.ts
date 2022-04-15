const meta = document.querySelector('meta[name="x-server-env"]');
// @ts-ignore
const env = meta?.content || 'sit';
// console.log(document.querySelector('meta[name="x-server-env"]'), 'xxx');
const urlCollect: any = {
  // 开发环境
  dev: 'https://gateway.community-sit.easyj.top/user-center',
  sit: 'https://gateway.community-sit.easyj.top/user-center',
  production: 'https://gateway.suosihulian.com/user-center',
  pre: 'https://gateway.pre.suosihulian.com/user-center',
};
export const URL = () => (window as any).userOrigin || urlCollect[env];
