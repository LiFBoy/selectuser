import React, { useContext } from 'react';
import { Tree } from 'antd';
import { TREE_CONTEXT } from '../../select-user';
import { ItreeItem } from '../../interface';
import useSelectExpand from '../../hooks/use-select-expand';
import useCheckedKeys from '../../hooks/use-checked-keys';
const { TreeNode } = Tree;
import './index.less';

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  selectType: 'user' | 'dept';
}

const SelectTagTree: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const { currentTab, selectType } = props;
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { treeState, updateCheckedNode, resetUserCount } = treeContext;
  const { treeData, basePath } = treeState;
  const {
    expandedKeys,
    setExpandedKeys,
    handleSelect,
    onExpand,
    loadTreeData: loadData,
  } = useSelectExpand(currentTab);
  const [checkedKeys] = useCheckedKeys(basePath, currentTab);
  console.log(basePath, 'basePath');
  // 树节点选中事件
  const onCheck = (_: any, event: any) => {
    const node = event.node.props;
    console.log(node, 'node333');
    const item: ItreeItem = {
      ...node,
      title: node.label,
    };
    const multiple = node.selectType === 'checkbox';

    // 获取当前节点是勾选还是取消勾选
    let checked = null;

    // 如果是多选
    if (multiple) {
      // 更新选中节点
      checked = updateCheckedNode(item);
      resetUserCount(item, checked, selectType === 'user');
    } else if (treeState.checkedKeys.indexOf(item.id) === -1) {
      // debugger;
      console.log(treeState.checkedKeys, item.id, 'xxxxx');
      // checked = updateCheckedNode(item);
      updateCheckedNode(item);
    } else {
      return;
    }
  };

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      console.log(item, 'item');
      if (item.children) {
        return (
          <TreeNode
            checkable={false}
            // title={renderSearchText(item.title)}
            key={item.id}
            isLeaf={item.isLeaf}
            {...item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if (item.selectType === 'radio') {
        return (
          <TreeNode
            key={item.id}
            // title={renderSearchText(item.title)}
            clssName="radio"
            {...item}
          />
        );
      }
      return (
        <TreeNode
          key={item.id}
          // title={renderSearchText(item.title)}
          {...item}
        />
      );
    });
  console.log(
    'expandedKeys',
    expandedKeys,
    treeData,
    expandedKeys.length > 0
      ? expandedKeys
      : localStorage.getItem('test')
        ? localStorage.getItem('test').split(',')
        : expandedKeys
  );
  // console.log(treeData, 'treeData');
  return treeData && treeData.length > 0 ? (
    <Tree
      className="cf-select-user-tree"
      selectedKeys={[]}
      key={currentTab}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      checkable
      // multiple={multiple}
      blockNode
      expandedKeys={
        expandedKeys.length > 0
          ? expandedKeys
          : localStorage.getItem('test')
            ? localStorage.getItem('test').split(',')
            : expandedKeys
      }
      // expandedKeys={[
      //   '1519884017599488002',
      //   '1519884121001664513',
      //   '1519884206770987010',
      //   '1519886599357177857',
      //   '1519889504036134914',
      // ]}
      onExpand={setExpandedKeys}
      onSelect={handleSelect}
      checkStrictly
      loadData={loadData}
      // height={340}
      treeData={treeData}
    >
      {/* {renderTreeNodes(treeData)} */}
    </Tree>
  ) : (
    <div className="cf-tree-result-empty">暂无内容</div>
  );
};

export default SelectTagTree;
