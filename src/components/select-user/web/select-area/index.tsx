import React from 'react';
import SelectTagTree from '../select-tag-tree';
import SelectCommonTree from '../select-common-tree';
import './index.less';

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  selectType: 'dept' | 'user';
}

const SelectArea: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const { currentTab, multiple, selectType } = props;

  return (
    <div className="select-area-wrap">
      {currentTab === 'tags' ? (
        <SelectTagTree multiple={multiple} currentTab={currentTab} selectType={selectType} />
      ) : (
        <SelectCommonTree
          selectType={selectType}
          multiple={multiple}
          currentTab={currentTab}
        />
      )}
    </div>
  );
};

export default SelectArea;
