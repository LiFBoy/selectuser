import React, { useEffect, useRef, useContext } from 'react';
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
  noTagLabelPermission?: boolean;
  selectType: 'user' | 'dept';
}

const SelectTagTree: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const { currentTab, selectType, noTagLabelPermission } = props;
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { treeState, updateCheckedNode, resetUserCount } = treeContext;
  const { treeData, basePath } = treeState;
  const {
    expandedKeys,
    setExpandedKeys,
    handleSelect,
    loadTreeData: loadData,
  } = useSelectExpand(currentTab);
  const [checkedKeys] = useCheckedKeys(basePath, currentTab);
  const pageView = useRef(null);

  useEffect(() => {
    if (pageView.current) {
      if (localStorage.getItem('labelPath')) {
        const list = localStorage.getItem('labelPath').split('-');

        const index = treeData.findIndex((item) => item.key === list[0]);
        pageView.current.scrollTop = index * 33;
      }
      if (!localStorage.getItem('nextSearchValue')) {
        pageView.current.scrollTop = 0;
      }
    }
  }, [
    localStorage.getItem('labelPath'),
    localStorage.getItem('nextSearchValue'),
  ]);

  // 树节点选中事件
  const onCheck = (_: any, event: any) => {
    const node = event.node.props;
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
      updateCheckedNode(item);
    } else {
      return;
    }
  };

  const setDisiabled = (
    noTagLabelPermission: boolean,
    LbPermission: number
  ) => {
    if (noTagLabelPermission) {
      return !noTagLabelPermission;
    }

    if (LbPermission) {
      return LbPermission === 2;
    }
    return false;
  };

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      // console.log(item, 'item222');

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
            // disabled={true}
            disabled={setDisiabled(noTagLabelPermission, item.labelPermission)}
            {...item}
            className="radio"
          />
        );
      }
      return (
        <TreeNode
          key={item.id}
          disabled={setDisiabled(noTagLabelPermission, item.labelPermission)}
          {...item}
        />
      );
    });

  // console.log(treeData, 'treeData');
  return treeData && treeData.length > 0 ? (
    <div ref={pageView} className="select-area-wrap">
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
          expandedKeys.length > 1
            ? expandedKeys
            : localStorage.getItem('labelPath')
              ? localStorage.getItem('labelPath').split('-')
              : expandedKeys
        }
        // expandedKeys={['3001001001000006', '1526430746303733762']}
        onExpand={setExpandedKeys}
        onSelect={handleSelect}
        checkStrictly
        loadData={loadData}
        // height={340}
        // treeData={treeData}
      >
        {renderTreeNodes(treeData)}
      </Tree>
      {[
        'equipmentContacts',
        'memberContacts',
        'groupContacts',
        'maternalContacts',
        'disabledHomeContacts',
      ].indexOf(currentTab) > -1 &&
        treeData.length > 19 && (
        <div className="more-text">
            仅展示前20条数据，请输入更精确的搜索内容获取
        </div>
      )}
    </div>
  ) : (
    <div className="cf-tree-result-empty no-data-result-empty">暂无内容</div>
  );
};

export default SelectTagTree;
