import React from 'react';
import { ItreeItem } from '../school-contacts';
import { RightOutlined } from '@ant-design/icons';
export default (props: any) => {
  const { handleClickBreadcrumb, currentTab, breadcrumb = [], tabmaps } = props;

  if (breadcrumb.length === 0) {
    return null;
  }

  return (
    <div id="breadcrumb" className="breadcrumb">
      <span onClick={() => handleClickBreadcrumb({ key: currentTab })}>
        <span>{tabmaps[currentTab]}</span>
        <span className="separator">
          <RightOutlined />
        </span>
      </span>
      {breadcrumb.map((item: ItreeItem) => {
        return (
          <span onClick={() => handleClickBreadcrumb(item)} key={item.key}>
            <span>{item.name}</span>
            <span className="separator">
              <RightOutlined />
            </span>
          </span>
        );
      })}
    </div>
  );
};
