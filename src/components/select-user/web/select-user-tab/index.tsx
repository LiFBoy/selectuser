import React from 'react';
import { Tabs } from 'antd';
import { PropTypes, TabTypes } from './interface';
import { TAB_MAPS } from '../../../../constants';
import './index.less';

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
