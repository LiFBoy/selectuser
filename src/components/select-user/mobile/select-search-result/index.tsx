import React, { useContext, useMemo } from 'react';
import { Tabs, Accordion } from 'antd-mobile';
import { Radio } from 'antd-mobile-v5';
import classnames from 'classnames';
import { get } from 'lodash';
import { TREE_CONTEXT } from '../../select-user';
import { TAG_TYPE } from '../../../../constants';
import EMPTYSVG from './icon_empty_03.svg';
import BUSER from '../../../tree-node-icon/user.svg';
import BDEPT from '../../../tree-node-icon/dept.svg';
import TAGIMG from '../../../tree-node-icon/tag.svg';

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
  innerContacts: '内部通迅录',
  maternalContacts: '母婴通迅录',
  disabledHomeContacts: '残疾人之家',
  equipmentContacts: '资产通迅录',
  memberContacts: '居民',
  memberDeptContacts: '社区通讯录',
  groupContacts: '互连微信群',
  customerTagContacts: '客户标签',
  groupTagContacts: '群标签',
  circlesTagContacts: '圈子标签',
  contentTagContacts: '内容标签',
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
    tagInfoList = [],
    circlesTagInfoList = [],
    groupInfoList = [],
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
          `<span style="color: #508CFF;">${search}</span>`
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
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          contactType: item.contactType,
          extendedAttribute: item.extendedAttribute,
          orgId: item.orgId,
          fullName: item.fullName,
          deptName: get(item.userDeptList, [0, 'deptName']),
        };
        break;

      case 'GROUP':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          contactType: item.contactType,
        };
        break;
      case 'DEPT':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          contactType: item.contactType,
          fullName: item.fullName,
        };
        break;
      case 'TAG':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          childDelete: item.childDelete,
          orgId: item.orgId,
        };
        break;
      case 'CONTENT_TAG':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          childDelete: item.childDelete,
          orgId: item.orgId,
        };
        break;
      case 'CIRCLES_TAG':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          childDelete: item.childDelete,
          orgId: item.orgId,
        };
        break;
      case 'GROUP_TAG':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          childDelete: item.childDelete,
          orgId: item.orgId,
        };
        break;
      case 'CUSTOMER_TAG':
        node = {
          id: item.key,
          key: item.key,
          name: item.label,
          type: item.type,
          extendedAttribute: item.extendedAttribute,
          childDelete: item.childDelete,
          orgId: item.orgId,
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

        case 'CUSTOMER_TAG':

        case 'GROUP_TAG':

        case 'CIRCLES_TAG':

        case 'CONTENT_TAG':
          tagList.push(resultItem);
          break;
        case 'ORG_REL':
          orgRelList.push(resultItem);
          break;
        default:
      }
    }

    return (
      <div
        className={classnames('search-result-mobile-box', {
          multiple: multiple === false,
        })}
      >
        {userList.length > 0 ? (
          <>
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
                    if (user.key === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div
                        className="line-result"
                        onClick={() => onCheckBoxChange(user, user.type)}
                      >
                        <div className="checkbox-wrap">
                          <Radio checked={checked} />
                        </div>
                        <div className="search-result-item">
                          <div className="item-name-icon">
                            <img src={BUSER} alt="" />
                          </div>
                          <div className="search-result-item-detail userList">
                            {searchResultNameReplace(user.label)}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(userList)}
              </Accordion.Panel>
            </Accordion>
          </>
        ) : (
          ''
        )}
        {deptList.length > 0 ? (
          <>
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
                    if (dept.key === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div
                        className="line-result"
                        onClick={() => onCheckBoxChange(dept, dept.type)}
                      >
                        <div className="checkbox-wrap">
                          <Radio checked={checked} />
                        </div>
                        <div className="item-name-icon">
                          <img src={BDEPT} alt="" />
                        </div>
                        <div className="search-result-item-detail">
                          {searchResultNameReplace(dept.label)}
                          <div className="search-result-item-des">
                            <div
                              className="overflow-ellipsis"
                              title={`${dept.orgName} - ${dept.labelPath}`}
                            >
                              位置:{`${dept.orgName} - ${dept.labelPath}`}
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
          </>
        ) : (
          ''
        )}

        {groupList.length > 0 ? (
          <>
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
                    if (group.key === item.id) {
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
                          {searchResultNameReplace(group.label)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(groupList)}
              </Accordion.Panel>
            </Accordion>
          </>
        ) : (
          ''
        )}
        {tagList.length > 0 ? (
          <>
            <Accordion defaultActiveKey="0" className="result-accordion">
              <Accordion.Panel
                header={
                  <div className="custome-name">相关标签({tagList.length})</div>
                }
              >
                {tagList.map((tag, index) => {
                  let checked = false;
                  for (const item of circlesTagInfoList) {
                    if (tag.key === item.id) {
                      checked = true;
                    }
                  }
                  return (
                    <div className="search-result-group-item" key={index}>
                      <div
                        className="line-result"
                        onClick={() => onCheckBoxChange(tag, tag.type)}
                      >
                        <div className="checkbox-wrap">
                          <Radio checked={checked} />
                        </div>
                        <div className="item-name-icon">
                          <img src={TAGIMG} alt="" />
                        </div>
                        <div className="search-result-item-title">
                          {searchResultNameReplace(tag.label)}
                        </div>
                        {/* <div className="search-result-item-des">
                          {TAG_TYPE[tag.tagType]}
                        </div> */}
                      </div>
                    </div>
                  );
                })}
                {renderSearchHint(tagList)}
              </Accordion.Panel>
            </Accordion>
          </>
        ) : (
          ''
        )}
      </div>
    );
  };

  const $allNumberAlert = useMemo(() => {
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
          <>{renderTabContent()}</>
        ) : searchResult?.dataSource?.length === 0 ? (
          <div className="mobile-tree-result-empty">
            <div className="empty-img">
              <img src={EMPTYSVG} alt="" />
            </div>
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
