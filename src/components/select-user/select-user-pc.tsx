import React, { useCallback, useState, useEffect, useContext } from 'react';
import SelectUserTab from './web/select-user-tab';
import { TabTypes } from './web/select-user-tab/interface';
import SearchResult from './web/search-result';
import RightPane from './web/right-pane';
import SelectArea from './web/select-area';
import { PropTypes } from './interface';
import SelectedPane from './web/selected-pane';
import { Modal, Input, Spin, Button } from 'antd';
import { TREE_CONTEXT } from './select-user';

const SelectUserPc: React.FunctionComponent<PropTypes> = ({
  dialogProps = {},
  selectPaneProps = {},
  target,
  modalWidth,
  visible = false,
  multiple = true,
  onCancel,
  requestParams = { campusType: 'base_school_type' },
  showTabList = [
    'dept',
    'group',
    'innerContacts',
    'maternalContacts',
    'equipmentContacts',
    'memberContacts',
    'memberDeptContacts',
    'schoolContacts',
    'tagContacts',
    'orgRel',
  ],
  selectType = 'user',
  searchPlaceholder = '搜索姓名、部门名称、手机号',
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

  // 搜索的回调
  const handleSearch = useCallback(
    (nextSearchValue: string) => {
      // 搜索图标点击事件
      const params = {
        search: nextSearchValue,
        types: searchTab === 'all' ? showTabList : [searchTab],
        ...requestParams,
      };
      getSearchResult(params);
      setSearchValue(nextSearchValue);
    },
    [searchTab, showTabList, getSearchResult, setSearchValue]
  );

  // 当tab切换时重新获取树
  useEffect(() => {
    if (tab) {
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
    } else {
      setTab('dept');
    }
  }, []);

  useEffect(() => {
    clear();
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
      search: searchValue,
      types: nextTab === 'all' ? showTabList : [nextTab],
      ...requestParams,
    };
    getSearchResult(params);
  };

  console.log(target, 'selectPaneProps');
  return (
    <Modal
      {...dialogProps}
      okText="确认"
      cancelText="取消"
      // confirmLoading={true}
      wrapClassName="select-user-pc-modal"
      destroyOnClose
      // closable={false}
      maskClosable={false}
      bodyStyle={{ padding: 0 }}
      visible={visible}
      onOk={handleOk}
      width={target ? modalWidth : 720}
      onCancel={handleCancel}
      footer={
        <div className="footer-box">
          <div className="user-count">
            {target && <span>已选{userCount.tagCount}对象</span>}
          </div>

          <Button key="back" onClick={handleCancel}>
            取消
          </Button>

          <Button
            key="submit"
            type="primary"
            // loading={loading}
            onClick={handleOk}
          >
            确认
          </Button>
        </div>
      }
    >
      <div className="select-user-pc-content">
        <div className="left-pane" style={target ? { width: modalWidth } : {}}>
          {!target && (
            <div className="select-user-pc-search-wrapper">
              <Search
                allowClear
                className="select-user-pc-search"
                onSearch={handleSearch}
                // onChange={onSearchChange}    // 这里暂时取消onChange时搜索,以后有机会再用上吧
                placeholder={
                  showTabList.length > 1 ? '搜索' : searchPlaceholder
                }
              />
            </div>
          )}
          {searchValue ? (
            <SearchResult
              currentTab={searchTab}
              search={searchValue}
              searchResult={searchResult}
              selectType={selectType}
              onSearchTabChange={onSearchTabChange}
              showTabList={showTabList}
              multiple={multiple}
            />
          ) : (
            <React.Fragment>
              <SelectUserTab
                activeKey={tab}
                onTabChange={onTabChange}
                showTabList={showTabList}
              />
              <SelectArea
                currentTab={tab}
                target={target}
                multiple={multiple}
                selectType={selectType}
              />
            </React.Fragment>
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
              selectType={selectType}
              showUserDeptName={requestParams?.strictUser}
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
