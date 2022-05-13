import React, { useMemo, useContext } from 'react';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import MyContext from '../../utils/context';
import { showNameFunc } from '../../utils/index';
import { PropType, IgroupItem } from './interface';
import { ItreeItem } from '../select-user/interface';
import './index.less';

const SelectedShowPane: React.FunctionComponent<PropType> = (
  props: PropType
) => {
  const { groupList, unit, delGroup, delItem, showUserDeptName } = props;

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
  return (
    <div className="selected-show-pane-wrap">
      <div className="selected-show-pane-total">
        已选对象 {total} {unit}
      </div>
      <div className="selected-show-pane-detail-box">
        {groupList.map((group: IgroupItem) => {
          const { title, itemList, count, type } = group;
          console.log(group, 'group2222');
          return (
            <div className="selected-show-pane-group" key={title}>
              <div className="selected-show-pane-group-top">
                {/* <NodeIcon /> */}
                <i className="selected-show-pane-group-top-icon">&nbsp;</i>
                <span className="selected-show-pane-group-total">
                  {title} ({type === 'USER' ? itemList.length : count})
                </span>
                {!itemList.find((_) => _.labelPermission === 2) && (
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
                    <div className="selected-tag" key={id} title={showName}>
                      <span
                        className={
                          isExpand
                            ? 'selected-tag-text-expand'
                            : 'selected-tag-text'
                        }
                      >
                        {showName}
                      </span>
                      {item.labelPermission === 1 && (
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
