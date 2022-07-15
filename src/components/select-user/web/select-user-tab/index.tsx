import React from 'react';
import { Tabs } from 'antd';
import { PropTypes, TabTypes } from './interface';
import './index.less';

// tab类型对应的中文名
const TAB_MAPS = {
  innerContacts: '内部通讯录',
  customerManagerContacts: '虚拟客户经理',
  maternalContacts: '母婴通讯录',
  disabledHomeContacts: '残疾人之家',
  equipmentContacts: '资产通讯录',
  memberContacts: '居民',
  memberDeptContacts: '社区通讯录',
  groupContacts: '互连微信群',
  customerTagContacts: '客户标签',
  groupTagContacts: '群标签',
  circlesTagContacts: '圈子标签',
  contentTagContacts: '内容标签',
};

const SelectUserTab: React.FunctionComponent<PropTypes> = (
  props: PropTypes
) => {
  const { onTabChange, showTabList, activeKey } = props;
  const { TabPane } = Tabs;

  let renderTabs: TabTypes[] = [];

  if (showTabList) {
    renderTabs = showTabList;
  } else {
    renderTabs = Object.keys(TAB_MAPS) as TabTypes[];
  }

  return (
    <div>
      {showTabList && showTabList.length <= 1 ? (
        ''
      ) : (
        <Tabs
          activeKey={activeKey}
          onChange={onTabChange}
          className="select-user-tab-tabs"
        >
          {renderTabs.map((tabs: TabTypes) => {
            return <TabPane tab={TAB_MAPS[tabs]} key={tabs} />;
          })}
        </Tabs>
      )}
    </div>
  );
};

export default SelectUserTab;
