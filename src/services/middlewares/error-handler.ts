// error handler middleware
// @author Pluto <huarse@gmail.com>
// @create 2019/12/18 20:07

import { message } from 'antd';
import { logger } from '@irim/saber';
import { NetOptions } from '../interface';

/**
 * 统一错误处理
 * @param {boolean|string} [ctx.showError=true] 显示错误信息
 * @param {boolean} [ctx.ignoreError] 忽略错误，并返回
 */
export default async function errorHandler(ctx: NetOptions) {
  try {
    await ctx.next();

    const response = ctx.response || {};
    if (response.success === false) {
      throw new Error(ctx.response.message || ctx.response.errorMsg);
    }
  } catch (error) {
    if (ctx.showError !== false) {
      const defaultMessage =
        typeof ctx.showError === 'string'
          ? ctx.showError
          : '请求异常，请稍后再试。';
      // message.warning(error.message || defaultMessage);
      message.error(error || error || defaultMessage);

      logger.error(error || error || defaultMessage);
    }

    if (ctx.ignoreError) {
      logger.warn(`ERROR ignored: ${ctx.api}`, error);
      ctx.body = error || {};
    } else {
      throw error;
    }
  }
}
