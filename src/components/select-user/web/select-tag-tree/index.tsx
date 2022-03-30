import React, { useContext } from 'react';
import { Tree } from 'antd';
import { TREE_CONTEXT } from '../../select-user';
import { ItreeItem } from '../../interface';
import useSelectExpand from '../../hooks/use-select-expand';
import useCheckedKeys from '../../hooks/use-checked-keys';

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  selectType: 'user' | 'dept';
}

const SelectTagTree: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const { currentTab, multiple, selectType } = props;
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { treeState, updateCheckedNode, clear, resetUserCount } = treeContext;
  const { treeData, basePath } = treeState;
  const {
    expandedKeys,
    setExpandedKeys,
    handleSelect,
    loadTreeData: loadData
  } = useSelectExpand(currentTab);
  const [checkedKeys] = useCheckedKeys(basePath, currentTab);

  // 树节点选中事件
  const onCheck = (_: any, event: any) => {
    const node = event.node.props;
    const item: ItreeItem = {
      ...node,
      title: node.label,
    };

    // 获取当前节点是勾选还是取消勾选
    let checked = null;

    // 如果是多选
    if (multiple) {
      // 更新选中节点
      checked = updateCheckedNode(item);
    } else if (treeState.checkedKeys[0] !== item.id) { // 如果是单选的情况
      // 先清空所选
      (typeof clear === 'function') && clear();
      // 更新选中节点
      checked = updateCheckedNode(item);
    }

    // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
    resetUserCount(item, checked, selectType === 'user');
  };
  return treeData && treeData.length > 0 ? (
    <Tree
      className="cf-select-user-tree"
      selectedKeys={[]}
      key={currentTab}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      checkable
      multiple={multiple}
      blockNode
      expandedKeys={expandedKeys}
      onExpand={setExpandedKeys}
      onSelect={handleSelect}
      checkStrictly
      loadData={loadData}
      // height={340}
      treeData={treeData}
    />
  ) : (
    <div className="cf-tree-result-empty">暂无内容</div>
  );
};

export default SelectTagTree;
