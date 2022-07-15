/**
 * 选人组件
 */
import React from 'react';
import { ConfigProvider } from 'antd';
import useTree, { ItreeContext } from './hooks/use-tree';
import SelectUserPc from './select-user-pc';
import SelectUserMobile from './select-user-mobile';
import { PropTypes } from './interface';
import './index.less';
import './common.less';

export const TREE_CONTEXT = React.createContext<ItreeContext | null>(null);

export default function SelectUser({
  defaultValue,
  visible = false,
  noTagLabelPermission = false,
  showTabList,
  onOk,
  target = '',
  modalWidth = 0,
  onCancel,
  userOrigin,
  basePath = 'pc',
  selectType = 'user',
  multiple = true,
  // selectSignature = "5f0ffd880c57dd47648f0e08",
  selectSignature = '',
  isSaveSelectSignature = true,
  searchPlaceholder,
  dialogProps = {},
  unCheckableNodeType = [],
  onlyLeafCheckable = false,
  requestParams,
  selectPaneProps = {},
  getCheckedNodes,
  getTotalCount,
  orgRelAnalysisRange,
}: PropTypes) {
  // 获取treeContext
  const treeContext = useTree({
    basePath,
    requestParams,
    selectType,
    multiple,
    onlyLeafCheckable,
    unCheckableNodeType,
    selectSignature,
    defaultValue,
    isSaveSelectSignature,
    onOk,
    getCheckedNodes,
    getTotalCount,
    orgRelAnalysisRange,
  });
  const Com = basePath === 'pc' ? SelectUserPc : SelectUserMobile;
  const others = {};

  (window as any).userOrigin = userOrigin;
  return (
    <ConfigProvider>
      <TREE_CONTEXT.Provider value={treeContext}>
        <Com
          defaultValue={defaultValue}
          visible={visible}
          showTabList={showTabList}
          onOk={onOk}
          userOrigin={userOrigin}
          onCancel={onCancel}
          getCheckedNodes={getCheckedNodes}
          getTotalCount={getTotalCount}
          basePath={basePath}
          selectType={selectType}
          multiple={multiple}
          target={target}
          modalWidth={modalWidth}
          searchPlaceholder={searchPlaceholder}
          noTagLabelPermission={noTagLabelPermission}
          selectSignature={selectSignature}
          isSaveSelectSignature={isSaveSelectSignature}
          dialogProps={dialogProps}
          selectPaneProps={selectPaneProps}
          unCheckableNodeType={unCheckableNodeType}
          onlyLeafCheckable={onlyLeafCheckable}
          requestParams={requestParams}
          orgRelAnalysisRange={orgRelAnalysisRange}
          {...others}
        />
      </TREE_CONTEXT.Provider>
    </ConfigProvider>
  );
}
