import React, { useMemo, useContext } from 'react';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import MyContext from '../../utils/context';
import { Popover } from 'antd';
import { showNameFunc } from '../../utils/index';
import { PropType, IgroupItem } from './interface';
import { ItreeItem } from '../select-user/interface';
import './index.less';
import { Group } from 'antd/lib/avatar';

const SelectedShowPane: React.FunctionComponent<PropType> = (
  props: PropType
) => {
  const {
    groupList,
    unit,
    delGroup,
    delItem,
    noTagLabelPermission,
    showUserDeptName,
  } = props;

  const total = useMemo(() => {
    let total = 0; // 已选总数

    for (const group of groupList) {
      const itemList = group.itemList;
      if (group.type === 'USER') {
        total += itemList.length;
      } else {
        total += group.count || 0;
      }
    }
    return total;
  }, [groupList]);
  console.log(unit, 'unit');
  const { expand: isExpand } = useContext(MyContext);
  const overlayStyle = {
    maxWidth: '20em',
    fontSize: '12px',
    color: '#666',
    overflow: 'auto',
    backgroud: '#fff',
    maxHeight: '400px',
    boxShadow: '5px 5px 10px rgba(129, 133, 167, 0.2)',
  };
  console.log(groupList, 'groupList');
  return (
    <div className="selected-show-pane-wrap">
      <div className="selected-show-pane-total">
        已选对象 {total} {unit}
      </div>
      <div className="selected-show-pane-detail-box">
        {groupList.map((group: IgroupItem) => {
          const { title, itemList, count, type } = group;
          return (
            <div className="selected-show-pane-group" key={title}>
              <div className="selected-show-pane-group-top">
                {/* <NodeIcon /> */}
                <i className="selected-show-pane-group-top-icon">&nbsp;</i>
                <span className="selected-show-pane-group-total">
                  {title} ({type === 'USER' ? itemList.length : count})
                </span>
                {(itemList.every(
                  (_: ItreeItem) => _.childDelete || _.childDelete === undefined
                ) ||
                  noTagLabelPermission) && (
                  <span
                    className="selected-show-pane-group-clear"
                    onClick={() => delGroup(group)}
                  >
                    <DeleteOutlined />
                  </span>
                )}
              </div>
              <div className="selected-show-pane-group-content selected-tag-container">
                {itemList.map((item: ItreeItem) => {
                  const { id } = item;
                  const showName = showNameFunc(item, showUserDeptName);
                  return (
                    <div className="selected-tag" key={id}>
                      <Popover
                        placement="bottomLeft"
                        overlayStyle={overlayStyle}
                        content={showName}
                        trigger="hover"
                      >
                        <span
                          className={
                            isExpand
                              ? 'selected-tag-text-expand'
                              : 'selected-tag-text'
                          }
                        >
                          {showName}
                        </span>
                      </Popover>
                      {(item.childDelete ||
                        noTagLabelPermission ||
                        item.childDelete === undefined) && (
                        <CloseOutlined
                          className="selected-tag-clear"
                          onClick={() => delItem(item, group)}
                        />
                      )}
                    </div>
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

export default SelectedShowPane;
