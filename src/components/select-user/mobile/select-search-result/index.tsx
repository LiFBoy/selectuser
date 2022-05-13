import React, { useContext, useMemo } from 'react';
import { Tabs, Accordion } from 'antd-mobile';
import { Radio } from 'antd-mobile-v5';
import classnames from 'classnames';
import { get } from 'lodash';
import { TREE_CONTEXT } from '../../select-user';
import { TAG_TYPE } from '../../../../constants';
// import EMPTYSVG from './empty_02.svg';
import './index.less';

interface PropType {
  search: string; // 搜索的字段
  searchResult: any; // 搜索结果
  onSearchTabChange: (tab: string) => void;
  showTabList: any[];
  multiple: boolean;
  selectType: 'user' | 'dept';
  searchTab: string;
}

const SHOW_TAB_LIST_ITEM_MAP: any = {
  all: '全部',
  dept: '所属部门',
  group: '下属组织',
  innerContacts: '内部通迅录',
  maternalContacts: '母婴通迅录',
  disabledHomeContacts: '残疾人之家',
  equipmentContacts: '资产通迅录',
  memberContacts: '居民',
  memberDeptContacts: '社区通讯录',
  schoolContacts: '家校通迅录',
  groupContacts: '互连微信群',
  tagContacts: '标签',
  orgRel: '行政组织',
};

const SelectSearchResult: React.FunctionComponent<PropType> = (
  props: PropType
) => {
  const {
    search,
    searchTab,
    searchResult,
    onSearchTabChange,
    multiple,
    showTabList,
    selectType,
  } = props;

  // 获取treeContext
  const { treeState, updateCheckedNode, resetUserCount, clear } =
    useContext(TREE_CONTEXT);
  const {
    userInfoList = [],
    deptInfoList = [],
    orgInfoList = [],
    tagInfoList = [],
    groupInfoList = [],
    orgRelInfoList = [],
  } = treeState;

  // 判断搜索字段是否为纯数字
  const allNumber = /^([0-9])+$/.test(search);

  const renderSearchHint = (list: Array<any>) => {
    if (list && list.length > 19) {
      return (
        <div className="more-text">
          仅展示前 20 个搜索结果，请输入更精确的搜索内容。
        </div>
      );
    }
  };

  const searchResultNameReplace = (content: string) => {
    const __html = {
      __html: !content
        ? null
        : content.replace(
          search,
          `<span style="color: #1786EC;">${search}</span>`
        ),
    };
    return (
      <div
        className="search-result-item-title"
        title={content}
        dangerouslySetInnerHTML={__html}
      />
    );
  };

  // checkbox状态改变事件
  const onCheckBoxChange = (item: any, type: string) => {
    let node: any = {};
    switch (type) {
      case 'USER':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          type: item.type,
          contactType: item.contactType,
          orgId: item.orgId,
          fullName: item.fullName,
          deptName: get(item.userDeptList, [0, 'deptName']),
        };
        break;
      case 'ORG':
        node = {
          id: item.orgId,
          key: item.orgId,
          name: item.orgName,
          type: item.type,
          contactType: item.contactType,
        };
        break;
      case 'GROUP':
        node = {
          id: item.groupId,
          key: item.groupId,
          name: item.groupName,
          type: item.type,
          contactType: item.contactType,
        };
        break;
      case 'DEPT':
        node = {
          id: item.deptId,
          key: item.deptId,
          name: item.deptName,
          type: item.type,
          contactType: item.contactType,
          fullName: item.fullName,
        };
        break;
      case 'TAG':
        node = {
          id: item.tagCode,
          key: item.tagCode,
          name: item.tagName,
          type: item.type,
          contactType: item.contactType,
        };
        break;
      case 'ORG_REL':
        node = {
          id: item.orgId,
          key: item.orgId,
          name: item.orgName,
          type: item.type,
          contactType: item.contactType,
        };
        break;
      default:
    }

    // 获取当前节点是勾选还是取消勾选
    let checked = null;

    // 如果是多选
    if (multiple) {
      // 更新选中节点
      checked = updateCheckedNode(node);
    } else if (treeState.checkedKeys[0] !== node.id) {
      // 如果是单选的情况
      // 先清空所选
      typeof clear === 'function' && clear();
      // 更新选中节点
      checked = updateCheckedNode(node);
    }

    // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
    resetUserCount(node, checked, selectType === 'user');
  };

  // 渲染tab内容
  const renderTabContent = () => {
    const userList: any[] = [];
    const deptList: any[] = [];
    const orgList: any[] = [];
    const tagList: any[] = [];
    const groupList: any[] = [];
    const orgRelList: any[] = [];

    for (const resultItem of searchResult?.dataSource) {
      switch (resultItem.type) {
        case 'USER':
          userList.push(resultItem);
          break;
        case 'DEPT':
          deptList.push(resultItem);
          break;
        case 'ORG':
          orgList.push(resultItem);
          break;
        case 'GROUP':
          groupList.push(resultItem);
          break;
        case 'TAG':
          tagList.push(resultItem);
          break;
        case 'ORG_REL':
          orgRelList.push(resultItem);
          break;
        default:
      }
    }
    console.log(userList, 'userList');

    return (
      <div
        className={classnames('search-result-mobile-box', {
          multiple: multiple === false,
        })}
      >
        {userList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">
                    相关人员({userList.length})
                  </div>
                }
              >
                {userList.map((user, index) => {
                  let checked = false;
                  for (const item of userInfoList) {
                    if (user.userId === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() => onCheckBoxChange(user, user.type)}
                          />
                        </div>
                        <div
                          className="search-result-item"
                          onClick={() => onCheckBoxChange(user, user.type)}
                        >
                          <div className="item-name-icon">
                            {user.userName.substring(user.userName.length - 2)}
                          </div>
                          <div className="search-result-item-detail userList">
                            {searchResultNameReplace(user.userName)}
                            {user.userDeptList?.map(
                              (deptItem: any, index: number) => {
                                return (
                                  <div
                                    className="search-result-item-des"
                                    key={index}
                                  >
                                    {
                                      <div
                                        className="overflow-ellipsis"
                                        title={deptItem.deptName}
                                      >
                                        {user.contactType === '3'
                                          ? '类别'
                                          : '部门'}
                                        : {deptItem.deptName}
                                      </div>
                                    }
                                  </div>
                                );
                              }
                            )}
                            {user.contactType === '3' ? (
                              <div className="search-result-item-des">
                                {
                                  <div
                                    className="overflow-ellipsis"
                                    title={user.orgName}
                                  >
                                    学校: {user.orgName}
                                  </div>
                                }
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(userList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
        {deptList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">
                    相关部门({deptList.length})
                  </div>
                }
              >
                {deptList.map((dept, index) => {
                  let checked = false;

                  for (const item of deptInfoList) {
                    if (dept.deptId === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() => onCheckBoxChange(dept, dept.type)}
                          />
                        </div>
                        <div
                          className="search-result-item-detail"
                          onClick={() => onCheckBoxChange(dept, dept.type)}
                        >
                          {searchResultNameReplace(dept.deptName)}
                          <div className="search-result-item-des">
                            <div
                              className="overflow-ellipsis"
                              title={`${dept.orgName} - ${dept.deptNamePath}`}
                            >
                              位置:{`${dept.orgName} - ${dept.deptNamePath}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(deptList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
        {orgList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">相关组织({orgList.length})</div>
                }
              >
                {orgList.map((org, index) => {
                  let checked = false;
                  for (const item of orgInfoList) {
                    // org也显示在相关组织下
                    if (org.orgId === item.id) {
                      checked = true;
                    }
                  }

                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() => onCheckBoxChange(org, org.type)}
                          />
                        </div>
                        <div
                          className="search-result-item-detail"
                          onClick={() => onCheckBoxChange(org, org.type)}
                        >
                          {searchResultNameReplace(org.orgName)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(orgList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
        {groupList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">
                    相关分组({groupList.length})
                  </div>
                }
              >
                {groupList.map((group, index) => {
                  let checked = false;

                  for (const item of groupInfoList) {
                    if (group.groupId === item.id) {
                      checked = true;
                    }
                  }

                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() => onCheckBoxChange(group, group.type)}
                          />
                        </div>
                        <div
                          className="search-result-item-detail"
                          onClick={() => onCheckBoxChange(group, group.type)}
                        >
                          {searchResultNameReplace(group.groupName)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(groupList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
        {tagList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">相关标签({tagList.length})</div>
                }
              >
                {tagList.map((tag, index) => {
                  let checked = false;

                  for (const item of tagInfoList) {
                    if (tag.tagCode === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() => onCheckBoxChange(tag, tag.type)}
                          />
                        </div>
                        <div
                          className="search-result-item-detail"
                          onClick={() => onCheckBoxChange(tag, tag.type)}
                        >
                          <div>
                            <div className="search-result-item-title">
                              {searchResultNameReplace(tag.tagName)}
                            </div>
                            <div className="search-result-item-des">
                              {TAG_TYPE[tag.tagType]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(tagList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
        {orgRelList.length > 0 ? (
          <React.Fragment>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">
                    相关组织({orgRelList.length})
                  </div>
                }
              >
                {orgRelList.map((orgRel, index) => {
                  let checked = false;

                  for (const item of orgRelInfoList) {
                    if (orgRel.orgId === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div className="line-result">
                        <div className="checkbox-wrap">
                          <Radio
                            checked={checked}
                            onChange={() =>
                              onCheckBoxChange(orgRel, orgRel.type)
                            }
                          />
                        </div>
                        <div
                          className="search-result-item-detail"
                          onClick={() => onCheckBoxChange(orgRel, orgRel.type)}
                        >
                          {searchResultNameReplace(orgRel.orgName)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(orgRelList)}
              </Accordion.Panel>
            </Accordion>
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    );
  };

  const $allNumberAlert = useMemo(() => {
    console.log(allNumber, search, searchResult, 'xxxx');
    return allNumber &&
      selectType === 'user' &&
      !!searchResult &&
      search.length < 8 ? (
        <span className="search-result-tips">
        为保证通讯录安全，手机号码输入超过8位后才能展示相关的人员结果
        </span>
      ) : null;
  }, [allNumber, selectType, search, searchResult]);

  const renderContent = () => {
    return (
      <>
        {/* 标签tab下不展示手机号提示*/}
        {searchTab !== 'tags' && $allNumberAlert}
        {searchResult?.dataSource?.length > 0 ? (
          <React.Fragment>{renderTabContent()}</React.Fragment>
        ) : searchResult?.dataSource?.length === 0 ? (
          <div className="mobile-tree-result-empty">
            <div className="empty-img"></div>
            <div className="text">没有搜索到相关内容</div>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="search-result-wrap">
      {
        // showTabList仅有一个tab时，不展示‘全部’，同时搜索时也不展示tab；
        showTabList.length === 1 ? (
          renderContent()
        ) : (
          <Tabs
            tabs={[
              { title: '全部', key: 'all' },
              ...showTabList.map((item: string) => ({
                title: SHOW_TAB_LIST_ITEM_MAP[item],
                key: item,
              })),
            ]}
            renderTabBar={(item) => <Tabs.DefaultTabBar {...item} page={4} />}
            onChange={(tab: any) => onSearchTabChange(tab)}
            swipeable={false}
          >
            {renderContent()}
          </Tabs>
        )
      }
    </div>
  );
};

export default SelectSearchResult;
