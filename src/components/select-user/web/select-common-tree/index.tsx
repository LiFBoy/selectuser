import React, { useContext } from 'react';
import { Tree } from 'antd';
import { TREE_CONTEXT } from '../../select-user';
import { ItreeItem } from '../../interface';
import useSelectExpand from '../../hooks/use-select-expand';
import useCheckedKeys from '../../hooks/use-checked-keys';
import './index.less';
const { TreeNode } = Tree;

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  selectType: 'user' | 'dept';
}

const SelectCommonTree: React.FunctionComponent<PropType> = (
  props: PropType
) => {
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
    loadTreeData: loadData,
  } = useSelectExpand(currentTab);

  const [checkedKeys] = useCheckedKeys(basePath, currentTab);

  // 树节点选中事件
  const onCheck = (_: any, event: any) => {
    const node = event.node.props;

    const item: ItreeItem = {
      ...node,
      title: node.label,
    };

    let checked = null;

    // 如果是多选
    if (multiple) {
      // 更新选中节点
      checked = updateCheckedNode(item, currentTab);
    } else if (treeState.checkedKeys[0] !== item.id) {
      // 如果是单选的情况
      // 先清空所选
      typeof clear === 'function' && clear();
      // 更新选中节点
      checked = updateCheckedNode(item, currentTab);
    } else {
      // 如果是单选的情况，并且点击的是已勾选项，则不做任何计算
      return;
    }

    // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
    resetUserCount(item, checked, selectType === 'user');
  };

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            isLeaf={item.isLeaf}
            {...item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if (!multiple) {
        return <TreeNode className="radio" {...item} />;
      }
      return <TreeNode key={item.key} {...item} />;
    });

  return treeData && treeData.length > 0 ? (
    <>
      <Tree
        className="cf-select-user-tree"
        selectedKeys={[]}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        checkable
        blockNode
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={handleSelect}
        checkStrictly
        loadData={loadData}
      >
        {renderTreeNodes(treeData)}
      </Tree>
      {[
        'equipmentContacts',
        'memberContacts',
        'groupContacts',
        'maternalContacts',
        'disabledHomeContacts',
        'customerManagerContacts',
      ].indexOf(currentTab) > -1 &&
        treeData.length > 19 && (
        <div className="more-text">
            仅展示前20条数据，请输入更精确的搜索内容获取
        </div>
      )}
    </>
  ) : (
    <div className="cf-tree-result-empty no-data-result-empty">暂无内容</div>
  );
};

export default SelectCommonTree;
