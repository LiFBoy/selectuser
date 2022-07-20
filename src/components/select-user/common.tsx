import React from 'react';
export const commonItem = (item: any) => {
  return {
    id: item.key,
    key: item.key,
    name: item.label,
    orgId: item.orgId,
    childDelete: item.childDelete,
    extendedAttribute: item.extendedAttribute,
  };
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
