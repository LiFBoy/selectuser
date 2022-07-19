import React from 'react';
import { get } from 'lodash';
const common = (item: any) => {
  return {
    id: item.key,
    key: item.key,
    name: item.label,
    orgId: item.orgId,
    childDelete: item.childDelete,
    extendedAttribute: item.extendedAttribute,
  };
};

// checkbox状态改变事件
export const onCheckBoxChange = (item: any, type: string) => {
  let node: any = {};
  switch (type) {
    case 'USER':
      node = {
        ...common(item),
        deptName: get(item.userDeptList, [0, 'deptName']),
        fullName: item.fullName,
      };
      break;
    case 'GROUP':
      node = {
        ...common(item),
      };
      break;
    case 'DEPT':
      node = {
        ...common(item),
        fullName: item.fullName,
      };
      break;
    case 'EQUIPMENT':
      node = {
        ...common(item),
      };
      break;
    case 'CAMERA':
      node = {
        ...common(item),
      };
      break;
    case 'TV':
      node = {
        ...common(item),
      };
      break;
    case 'WORK_GROUP':
      node = {
        ...common(item),
      };
      break;
    case 'MATERNAL':
      node = {
        ...common(item),
      };
      break;
    case 'TAG':
      node = {
        ...common(item),
      };
      break;
    case 'CONTENT_TAG':
      node = {
        type: item.type,
        ...common(item),
      };
      break;
    case 'CIRCLES_TAG':
      node = {
        ...common(item),
        type: item.type,
      };
      break;
    case 'GROUP_TAG':
      node = {
        ...common(item),
        type: item.type,
      };
      break;
    case 'CUSTOMER_TAG':
      node = {
        ...common(item),
        type: item.type,
      };
      break;
  }
};

export const renderSearchHint = (list: Array<any>) => {
  if (list && list.length > 19) {
    return (
      <div className="more-text">
        仅展示前20个搜索结果，请输入更精确的搜索内容获取
      </div>
    );
  }
};

// const allNumber = /^([0-9])+$/.test(search);

//   // 搜索文案匹配时颜色展示
//   const renderSearchText = (text: string) => {
//     // debugger;
//     if (!text?.includes(search)) return text;
//     const [str1, str2] = text.replace(search, '&').split('&');
//     return (
//       <>
//         {str1}
//         <span className="search-result-item-title_matched">{search}</span>
//         {str2}
//       </>
//     );
//   };
