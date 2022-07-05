import React from 'react';
// @ts-ignore
import { PropType, IgroupItem, ItreeItem } from './interface';
import './index.less';
// import iconMap, { IconType } from './components/tree-node-icon/index';
import Tag from 'antd/es/tag';

const SelectedUserResult: React.FunctionComponent<PropType> = (
  props: PropType
) => {
  const {
    groupList,
    showSelectUser,
    btnUpdate,
    btnDetele,
    funDelAll,
    resultTitle,
  } = props;

  return (
    <div className="select-user-result-wrap">
      <div className="select-user-result-total">
        <div className="title">{resultTitle}</div>
        <div className="option">
          {btnUpdate && (
            <>
              <img src="" />
              <div onClick={showSelectUser}>修改</div>
            </>
          )}
          {btnDetele && btnUpdate && <div className="line"></div>}
          {btnDetele && (
            <>
              <img src="" />
              <div onClick={funDelAll}>删除</div>
            </>
          )}
        </div>
      </div>
      <div className="select-user-result-detail-box">
        {groupList.map((group: IgroupItem) => {
          const { title, itemList } = group;
          // const NodeIcon = iconMap[type as IconType];
          return (
            <div className="select-user-result-group" key={title}>
              <div className="select-user-result-group-top">
                {/* <NodeIcon /> */}
                <i className="select-user-result-group-top-icon">&nbsp;</i>
                <span className="select-user-result-group-total">
                  {title} ({itemList.length})
                </span>
              </div>
              <div className="select-user-result-group-content">
                {itemList.map((item: ItreeItem) => {
                  const { id, name } = item;
                  // console.log(item, 'selected-tag');
                  return (
                    <Tag
                      className="selected-tag"
                      // closable
                      visible
                      key={id}
                      title={name}
                    >
                      {name}
                    </Tag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedUserResult;
