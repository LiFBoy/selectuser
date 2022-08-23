import { IlistItem } from '../components/select-user/interface';

/**
 * 超过指定长度中间省略号结尾部分展示正常内容
 * @param str 节点或相关名称
 * @param sIndex 前半部分展示内容长度（英文占1个字符，中文占2个字符）「“默认12个字符”」
 * @param eIndex 后半部分要展示内容长度（英文占1个字符，中文占2个字符）「“默认12个字符”」
 */
export const funTransformationSubstr = (
  str: string,
  sIndex?: number,
  eIndex?: number
) => {
  if (!str) {
    return str;
  }
  const START_NUMBER = sIndex || 12;
  const END_NUMBER = eIndex || 12;
  // 字符串长度必须大于(START_NUMBER + END_NUMBER)之和才进行分割中间显示…
  const sumLen = gblen(str);
  if (sumLen <= START_NUMBER + END_NUMBER) {
    return str;
  }
  return (
    str.substr(0, getStrIndex(str, START_NUMBER) + 1) +
    '...' +
    str.substr(getStrIndex(str, END_NUMBER, true), sumLen)
  );
};

/**
 * 获取字符传长度「英文占1个字符，中文占2个字符」
 * @param str 传入字符串
 */
const gblen = (str: string) => {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g, '**').length;
};

/**
 * 返回指定长度的下标位置
 * @param str 原始字符串
 * @param limitLen 字符串限制的最大长度
 * @param fromEnd 是否从尾部开始计算
 */
const getStrIndex = (str: string, limitLen: number, fromEnd?: boolean) => {
  const strLen = str.length; // 字符串长度
  let actualLen = 0; // 计算实际展示的字符串长度
  let index = 0;
  // 判断是否从尾部开始计算
  const actStr = fromEnd ? str.split('').reverse().join('') : str;
  for (let i = 0; i < strLen; i++) {
    actualLen += gblen(actStr[i]); // 通过下标取字符串中字符，再通过gblen方法判断改字符长度
    if (actualLen + 1 === limitLen || actualLen + 2 === limitLen) {
      index = i;
      break;
    }
  }
  return fromEnd ? strLen - (index + 1) : index;
};

/**
 * 返回拼接当前tab类型后的key
 * @param basePath 当前环境 pc | mobile
 * @param treeItem ItreeItem
 * @param tabType tab类型
 * @returns string
 */
export const dealtKey = (
  basePath: string,
  treeItem: IlistItem,
  tabType: string
) => {
  const { id, type } = treeItem;
  /* 当且仅当满足一下所有条件时需要去对id进行拼接
      1.当前是"pc"端环境
      2.当前所处tab为“下属组织“或搜索情况下的”全部“时
      3.当前节点属性为"ORG"
   */
  return basePath === 'pc' &&
    ['all', 'group'].includes(tabType) &&
    type === 'ORG'
    ? `group@${id}`
    : id;
};

/**
 * 返回拼接当前tab类型后的key
 * @param basePath 当前环境 pc | mobile
 * @param treeItem ItreeItem
 * @param type 数据类型 删除单个时，type是node.type；删除组/回显时，type是group.type；
 * @returns string
 */
// 用于数据回显和右侧删除数据
export const dealtKeyByType = (
  basePath: string,
  treeItem: IlistItem,
  type: string
) => {
  const tabTypeMap: { [key: string]: string } = {
    ORG: 'group',
  };
  return dealtKey(basePath, treeItem, tabTypeMap[type]);
};

export const showNameFunc = (data: any, isShowDeptName: boolean) => {
  const { name, deptName, fullName, userDeptList } = data;
  let showName = fullName || name;
  if (isShowDeptName && deptName) {
    showName = `${showName} (${deptName})`;
  } else if (
    isShowDeptName &&
    userDeptList &&
    userDeptList[0] &&
    userDeptList[0].deptName
  ) {
    showName = `${showName} (${userDeptList[0].deptName})`;
  }
  return showName;
};
