import React from 'react';
// @ts-ignore
// import TitleBar from 'ss-mobile-title-bar';
// @ts-ignore
import Card from 'ss-mobile-card';
import { Icon } from 'antd-mobile';
import { PropType, IgroupItem, ItreeItem } from './interface';
import './index.less';

const SelectedShowPane: React.FunctionComponent<PropType> = (
  props: PropType
) => {
  const { groupList, delItem, setModal, showUserDeptName } = props;

  return (
    <div className="mobile-selected-show-pane-wrap">
      {/* <TitleBar
        showBackbtn
        titleMaxWidth={120}
        title="已选对象"
        onBack={() => setModal(false)}
      /> */}
      {groupList.length > 0 ? (
        <div className="selected-show-pane-detail-box">
          {groupList.map((group: IgroupItem) => {
            const { title, itemList, count, type } = group;
            return (
              <div className="selected-show-pane-group" key={title}>
                <div className="selected-show-pane-group-top">
                  <span className="selected-show-pane-group-total">
                    {title} ({type === 'USER' ? itemList.length : count})
                  </span>
                </div>
                <Card
                  className="customer-class-name"
                  closeText="展开全部"
                  wrapShowMode="normal"
                  maxHeight={104}
                >
                  <div className="selected-show-pane-group-content">
                    {itemList.map((item: ItreeItem) => {
                      const { fullName, name, deptName } = item;
                      const showName = `${fullName || name}${
                        showUserDeptName && deptName ? ` (${deptName})` : ''
                      }`;
                      return (
                        <div
                          key={item.id}
                          className="selected-box"
                          title={showName}
                        >
                          <span className="selected-box_text">{showName}</span>
                          <Icon
                            type="cross"
                            onClick={() => delItem(item, group)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-content">
          <div className="empty-img"></div>
          无任何对象
        </div>
      )}
    </div>
  );
};

export default SelectedShowPane;
