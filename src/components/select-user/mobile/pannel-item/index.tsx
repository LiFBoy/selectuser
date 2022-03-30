import { get } from 'lodash';

export interface ItreeItem {
  id: string;
  key: string;
  name: string;
  label: any;
  title: any;
  nodeType: NodeType;
  orgId?: string;
  type?:
    | 'DEPT' // 部门
    | 'GROUP_DEPT' //  虚拟部门
    | 'USER' // 个人
    | 'ORG' // 组织
    | 'TAG' // 标签
    | 'GROUP' // 分组
    | 'ORG_REL'; // 行政组织-精准推送业务
  deptType?:
    | 0 // 基础校区
    | 1; // 自定义校区
  userCount?: number;
  children?: ItreeItem[];
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: any;
  contactType?: string;
  count?: number;
}

import React, { useContext } from 'react';
import { TREE_CONTEXT } from '../../select-user';
import { Radio } from 'antd-mobile-v5';
import classnames from 'classnames';
import { NodeType } from '../../interface';
// import { render } from 'react-dom';
// const CheckboxItem = Checkbox.CheckboxItem;

interface PropType {
  currentTab: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  loadData?: (node: any) => Promise<void>;
  node: any;
  arrow?: boolean;
  accordion: any[];
  breadcrumb: any[];
  className?: string;
  setCurrentTab?: any;
  handleSelect: (nodeItem: any, tab?: string, name?: string) => void;
  selectType: 'user' | 'dept';
}

const PannelItem: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const {
    currentTab,
    multiple,
    node,
    handleSelect,
    arrow = true,
    className,
    selectType,
  } = props;
  // 获取treeContext
  const { treeState, updateCheckedNode, clear, resetUserCount } =
    useContext(TREE_CONTEXT);

  // 树节点选中事件
  const onCheck = (node: any) => {
    if (currentTab === 'innerContacts' && node.type === 'ORG') {
      return;
    }
    if (currentTab === 'tags' && node.isLeaf === false) {
      return;
    }
    const item: any = {
      id: node.key,
      label: node.label,
      name: node.name,
      key: node.key,
      type: node.type,
      nodeType: node?.nodeType,
      orgId: node.orgId,
      contactType: node.contactType,
      fullName: node.fullName,
      deptName: get(node.userViewDeptList, [0, 'name']),
    };
    // 获取当前节点是勾选还是取消勾选
    let checked = null;

    // 如果是多选
    if (multiple) {
      // 更新选中节点
      checked = updateCheckedNode(item);
    } else if (treeState.checkedKeys[0] !== item.id) {
      // 如果是单选的情况
      // 先清空所选
      typeof clear === 'function' && clear();
      // 更新选中节点
      checked = updateCheckedNode(item);
    }

    // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
    resetUserCount(item, checked, selectType === 'user');
  };

  const renderCheckboxItem = (node: {
    type: string;
    key: React.Key;
    isLeaf: boolean;
    checkable: boolean;
  }) => {
    if (!node.checkable) {
      return <div></div>;
    }

    return (
      <div className="line-checkbox">
        <Radio
          key={node.key}
          checked={
            !!treeState.checkedKeys.filter((item) => item === node.key).length
          }
          onChange={() => onCheck(node)}
        ></Radio>
      </div>
    );
  };

  return (
    <div
      className={classnames('panel-header', {
        'panel-user-header': !!className,
      })}
    >
      <div className="line">
        {
          <div
            className={classnames('check-box-item', {
              multiple: multiple === false,
            })}
          >
            {renderCheckboxItem(node)}
          </div>
        }
        <div className="label" onClick={() => onCheck(node)}>
          {node.label}
        </div>
        {arrow && node.type !== 'USER' && !node.isLeaf && (
          <div className="icon" onClick={() => handleSelect(node, currentTab)}>
            <div className="icon-arrow-right" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PannelItem;
