import React from 'react';
import SelectTagTree from '../select-tag-tree';
import SelectCommonTree from '../select-common-tree';
import './index.less';

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  target?: string;
  noTagLabelPermission?: boolean;
  selectType: 'dept' | 'user';
}

const SelectArea: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const { currentTab, multiple, selectType, noTagLabelPermission } = props;
  console.log(currentTab, 'currentTab');

  return (
    <>
      {[
        'customerTagContacts',
        'groupTagContacts',
        'circlesTagContacts',
        'contentTagContacts',
      ].indexOf(currentTab) > -1 ? (
          <SelectTagTree
            noTagLabelPermission={noTagLabelPermission}
            multiple={multiple}
            currentTab={currentTab}
            selectType={selectType}
          />
        ) : (
          <div className="select-area-wrap">
            <SelectCommonTree
              selectType={selectType}
              multiple={multiple}
              currentTab={currentTab}
            />
          </div>
        )}
    </>
  );
};

export default SelectArea;
