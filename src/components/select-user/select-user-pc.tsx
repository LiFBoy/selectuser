import React, { useCallback, useState, useEffect, useContext } from 'react';
import SelectUserTab from './web/select-user-tab';
import { TabTypes } from './web/select-user-tab/interface';
import SearchResult from './web/search-result';
import RightPane from './web/right-pane';
import SelectArea from './web/select-area';
import { PropTypes } from './interface';
import SelectedPane from './web/selected-pane';
import classnames from 'classnames';
import { Modal, Input, Spin, Button } from 'antd';
import { TREE_CONTEXT } from './select-user';

const SelectUserPc: React.FunctionComponent<PropTypes> = ({
  dialogProps = {},
  selectPaneProps = {},
  target,
  modalWidth,
  noTagLabelPermission,
  visible = false,
  multiple = true,
  onCancel,
  requestParams,
  showTabList,
  selectType = 'user',
  searchPlaceholder = '搜索',
}) => {
  const { Search } = Input;
  const [tab, setTab] = useState<TabTypes | ''>('');
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { treeState, loading, clear, getTreeRoot, getSearchResult, handleOk } =
    treeContext;

  const { searchResult, userCount } = treeState;
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTab, setSearchTab] = useState<string>('all');
  const [lineHeigth, setLineHeigth] = useState<any>([]);

  // 搜索的回调
  const handleSearch = useCallback(
    (nextSearchValue: string) => {
      if (!nextSearchValue) {
        localStorage.clear();
      } else {
        localStorage.setItem('nextSearchValue', nextSearchValue);
      }

      // 搜索图标点击事件
      const params = {
        keyword: nextSearchValue,
        types: searchTab === 'all' ? showTabList : [searchTab],
        ...requestParams,
      };
      getSearchResult(params);
      setSearchValue(nextSearchValue);
      setLineHeigth([]);
    },
    [searchTab, showTabList, getSearchResult, setSearchValue]
  );

  // 当tab切换时重新获取树
  useEffect(() => {
    if (tab) {
      getTreeRoot(tab);
    }
    if (
      tab === 'customerTagContacts' &&
      (searchValue || lineHeigth?.length > 0)
    ) {
      getTreeRoot(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (!searchValue) {
      // 如果搜索字段被清空，tab默认恢复选择到all
      setSearchTab('all');
    }
  }, [searchValue]);

  // 当 showTabList 变更时，重置高亮的 tab
  useEffect(() => {
    if (showTabList && showTabList.length > 0) {
      setTab(showTabList[0]);
    }
  }, []);

  useEffect(() => {
    clear();
    localStorage.clear();
  }, [visible]);

  // 处理关闭
  const handleCancel = () => {
    onCancel();
  };

  // 选择tab切换
  const onTabChange = (selectTab: TabTypes) => {
    setTab(selectTab);
  };

  // 当搜索的tab改变
  const onSearchTabChange = (nextTab: string) => {
    setSearchTab(nextTab);

    const params = {
      keyword: searchValue,
      types: nextTab === 'all' ? showTabList : [nextTab],
      ...requestParams,
    };
    getSearchResult(params);
  };
  useEffect(() => {
    switch (localStorage.getItem('tagType')) {
      case 'GROUP_TAG':
      case 'GROUP_TAG_GROUP':
        setTab('groupTagContacts');
        break;
      case 'CUSTOMER_TAG':
      case 'CUSTOMER_TAG_GROUP':
        setTab('customerTagContacts');
        break;
      case 'CIRCLES_TAG':
      case 'CIRCLES_TAG_GROUP':
        setTab('circlesTagContacts');
        break;
      case 'CONTENT_TAG':
      case 'CONTENT_TAG_GROUP':
        setTab('contentTagContacts');
        break;
    }
  }, [localStorage.getItem('tagType')]);

  const isinnerdeptuser =
    showTabList?.find((item) => item === 'innerContacts') &&
    requestParams?.selectTypeList.find((_) => _ === 'dept_user');

  return (
    <Modal
      {...dialogProps}
      title={
        <div style={target ? { fontSize: '14px' } : {}}>
          {dialogProps.title || '请选择'}
        </div>
      }
      okText="确认"
      cancelText="取消"
      wrapClassName={classnames('select-user-pc-modal', {
        'ct-modal-close': target,
      })}
      destroyOnClose
      maskClosable={false}
      bodyStyle={{ padding: 0 }}
      visible={visible}
      onOk={handleOk}
      width={target ? modalWidth : 720}
      onCancel={handleCancel}
      footer={
        <div className="footer-box">
          <div className="user-count">
            {target && (
              <>
                <span className="pl8">已选对象</span>
                {userCount.tagCount +
                  userCount.customerTagCount +
                  userCount.groupTagCount}
              </>
            )}
          </div>

          <Button key="back" onClick={handleCancel}>
            取消
          </Button>

          <Button key="submit" type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      }
    >
      <div className="select-user-pc-content">
        <div
          className={classnames('left-pane', {
            'tool-box': target,
          })}
          style={target ? { width: modalWidth } : {}}
        >
          {!target && (
            <div className="select-user-pc-search-wrapper">
              <Search
                allowClear
                className="select-user-pc-search"
                onSearch={handleSearch}
                placeholder={
                  showTabList.length > 1 ? '搜索' : searchPlaceholder
                }
              />
            </div>
          )}
          {searchValue && lineHeigth?.length === 0 ? (
            <SearchResult
              currentTab={searchTab}
              search={searchValue}
              searchResult={searchResult}
              selectType={selectType}
              onSearchTabChange={onSearchTabChange}
              showTabList={showTabList}
              multiple={multiple}
              onExpandedKeys={(v: any) => setLineHeigth(v)}
            />
          ) : (
            <>
              <SelectUserTab
                activeKey={tab}
                onTabChange={onTabChange}
                showTabList={showTabList}
              />
              <SelectArea
                currentTab={tab}
                target={target}
                multiple={multiple}
                noTagLabelPermission={noTagLabelPermission}
                selectType={selectType}
              />
            </>
          )}
          <Spin
            spinning={loading}
            tip="正在加载"
            delay={200}
            className="cf-select-user-spin"
          />
        </div>
        {target ? null : (
          <RightPane>
            <SelectedPane
              noTagLabelPermission={noTagLabelPermission}
              selectType={selectType}
              showUserDeptName={isinnerdeptuser}
              selectTypeList={requestParams.selectTypeList}
              selectPaneProps={selectPaneProps}
            />
          </RightPane>
        )}
      </div>
    </Modal>
  );
};

export default SelectUserPc;
