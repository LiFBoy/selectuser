import React from 'react';
import Card from 'suo-base-collapse';
import { Icon } from 'antd-mobile';
import empty02 from './empty.svg';
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
                  // className="customer-class-name"
                  closeText="展开全部"
                  wrapShowMode="normal"
                  // maxHeight={104}
                  maxHeight={75}
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
          <div className="empty-img">
            <img src={empty02} alt="" />
          </div>
          <span>暂无内容</span>
        </div>
      )}
    </div>
  );
};

export default SelectedShowPane;
