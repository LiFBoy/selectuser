import React, { useContext, useMemo, useState } from 'react';
import { Tabs, Checkbox, Typography, Radio } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { TREE_CONTEXT } from '../../select-user';
import { funTransformationSubstr } from '../../../../utils';
import { get } from 'lodash';
import {
  TagIcon,
  UserIcon,
  DeptIcon,
  OrgIcon,
  GroupIcon,
  OrgRelIcon,
  EQUIPMENTICON,
} from '../../../../components/tree-node-icon';
import './index.less';

const { Text } = Typography;
const { TabPane } = Tabs;

interface PropType {
  currentTab: string;
  search: string; // 搜索的字段
  searchResult: any[]; // 搜索结果
  onSearchTabChange: (tab: string) => void;
  showTabList: any[];
  multiple: boolean;
  selectType: 'user' | 'dept';
}

const SHOW_TAB_LIST_ITEM_MAP: any = {
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

const TAGTYPELIST: any = { '0': '个人标签', '1': '通用标签', '2': '系统标签' };

// 信息展示条数限制，超过INFO_LIMIT_NUM则以鼠标悬浮框展示
const INFO_LIMIT_NUM = 2;

// 搜索结果展示
const SearchResult: React.FunctionComponent<PropType> = (props: PropType) => {
  const {
    search,
    searchResult,
    onSearchTabChange,
    multiple,
    showTabList,
    selectType,
    currentTab,
  } = props;

  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { treeState, updateCheckedNode, resetUserCount, clear } = treeContext;
  const {
    userInfoList,
    deptInfoList,
    orgInfoList,
    tagInfoList,
    equipmentInfoList,
    tvInfoList,
    maternalInfoList,
    cameraInfoList,
    workGroupInfoList,
    groupInfoList,
    orgRelInfoList,
    requestParams,
  } = treeState;
  console.log(requestParams, 'requestParams');

  // 更多信息展开后悬浮框的位置
  const [moreInfoStyle, setMoreInfoStyle] = useState({});

  // 判断搜索字段是否为纯数字
  const allNumber = /^([0-9])+$/.test(search);

  const renderSearchHint = (list: Array<any>) => {
    if (list && list.length > 19) {
      return (
        <div className="more-text">
          仅展示前20个搜索结果，请输入更精确的搜索内容获取
        </div>
      );
    }
  };

  // const funStitching = (id: string, key: string, name: string, orgId: string, type: string, contactType: string) => {
  //   return { id, key, name, orgId, type, contactType };
  // };

  // checkbox状态改变事件
  const onCheckBoxChange = (item: any, type: string) => {
    let node: any = {};
    switch (type) {
      case 'USER':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
          deptName: get(item.userDeptList, [0, 'deptName']),
          fullName: item.fullName,
        };
        break;
      case 'ORG':
        node = {
          id: item.orgId,
          key: item.orgId,
          name: item.orgName,
        };
        break;
      case 'GROUP':
        node = {
          id: item.groupId,
          key: item.groupId,
          name: item.groupName,
          orgId: item.orgId,
        };
        break;
      case 'DEPT':
        node = {
          id: item.deptId,
          key: item.deptId,
          name: item.deptName,
          orgId: item.orgId,
          fullName: item.fullName,
        };
        break;
      case 'EQUIPMENT':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
        };
        break;
      case 'CAMERA':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
        };
        break;
      case 'TV':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
        };
        break;
      case 'WORK_GROUP':
        node = {
          id: item.groupId,
          key: item.groupId,
          name: item.groupName,
          orgId: item.orgId,
        };
        break;
      case 'MATERNAL':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
        };
        break;
      case 'TAG':
        node = {
          id: item.userId,
          key: item.userId,
          name: item.userName,
          orgId: item.orgId,
        };
        break;
      case 'ORG_REL':
        node = {
          id: item.orgId,
          key: item.orgId,
          name: item.orgName,
          nodeType: item.orgType,
        };
        break;
    }

    node.type = item.type;
    node.contactType = item.contactType;
    const _multiple =
      currentTab === 'tagContacts' ? item?.selectType === 'checkbox' : multiple;
    // 获取当前节点是勾选还是取消勾选
    let checked = null;
    // 如果是多选
    if (_multiple) {
      // 更新选中节点
      checked = updateCheckedNode(node, currentTab);
    } else if (treeState.checkedKeys[0] !== node.id) {
      // 如果是单选的情况
      // 先清空所选
      typeof clear === 'function' && clear();
      // 更新选中节点
      checked = updateCheckedNode(node, currentTab);
    } else {
      // 如果是单选的情况，并且点击的是已勾选项，则不做任何计算
      return;
    }

    // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
    resetUserCount(node, checked, selectType === 'user');
  };

  const funTranName = (meName: string, isEllipsis: boolean) => {
    // isEllipsis为false说明是在详情弹窗中，展示完整信息 否则超过指定超度两边截取中间…的形式展示
    return isEllipsis ? funTransformationSubstr(meName, 21, 21) : meName;
  };

  const renderSearchDept = (
    info: any = {},
    type: string,
    isEllipsis: boolean
  ) => {
    const { deptName = '', deptPath = '' } = info;
    const isCategory = type === '3';
    const content = isCategory ? deptName : deptPath;
    const label = isCategory ? '类别: ' : '部门: ';
    const title = `${label}${content}`;
    return (
      <div
        className={isEllipsis ? 'search-result-item-des' : 'overflow-auto-box'}
        key={info.id}
      >
        {isEllipsis ? (
          <div className="search-result-info-dept" title={title}>
            {`${label}${funTranName(content, isEllipsis)}`}
          </div>
        ) : (
          <div className="overflow-auto" title={title}>
            {title}
          </div>
        )}
      </div>
    );
  };

  // 搜索文案匹配时颜色展示
  const renderSearchText = (text: string) => {
    if (!text?.includes(search)) return text;
    const [str1, str2] = text.replace(search, '&').split('&');
    return (
      <>
        {str1}
        <span className="search-result-item-title_matched">{search}</span>
        {str2}
      </>
    );
  };

  const handleShowMore = (e: any) => {
    const { clientX, clientY } = e;
    setMoreInfoStyle({
      left: `${clientX}px`,
      top: `${clientY + 10}px`,
    });
  };

  const renderDom = (list: any, title: string, infoList: any, icon: any) => {
    return (
      <React.Fragment>
        <div className="search-result-group-title">
          {title}({list.length})
        </div>
        {list.map((user: any, index: number) => {
          let checked = false;

          for (const item of infoList) {
            if ((user.userId || user.groupId) === item?.id) {
              checked = true;
            }
          }
          return (
            <div
              className="search-result-group-item"
              key={`${user.userId}-${index}`}
            >
              {icon}
              <div className="search-result-item-detail">
                <div
                  className="search-result-item-title overflow-ellipsis"
                  title={user.userName}
                >
                  {renderSearchText(user.userName || user.groupName)}
                </div>
              </div>
              <div className="checkbox-wrap">
                <Checkbox
                  checked={checked}
                  onChange={() => onCheckBoxChange(user, user.type)}
                />
              </div>
            </div>
          );
        })}
        {renderSearchHint(list)}
      </React.Fragment>
    );
  };

  // 渲染tab内容
  const renderTabContent = () => {
    const userList: any[] = [];
    const equipmentList: any[] = [];
    const tvList: any[] = [];
    const cameraList: any[] = [];
    const workGroupList: any[] = [];
    const maternalList: any[] = [];
    const deptList: any[] = [];
    const orgList: any[] = [];
    const tagList: any[] = [];
    const groupList: any[] = [];
    const orgRelList: any[] = [];

    for (const resultItem of searchResult) {
      console.log(resultItem.type, 'console.log(resultItem.type)');
      switch (resultItem.type) {
        case 'EQUIPMENT':
          equipmentList.push(resultItem);
          break;
        case 'TV':
          tvList.push(resultItem);
          break;
        case 'CAMERA':
          cameraList.push(resultItem);
          break;
        case 'WORK_GROUP':
          workGroupList.push(resultItem);
          break;
        case 'MATERNAL':
          maternalList.push(resultItem);
          break;
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
      }
    }
    console.log(maternalList, 'maternalList');

    return (
      <div className="search-result-box">
        {workGroupList.length > 0
          ? renderDom(
            workGroupList,
            '相关告警群',
            workGroupInfoList,
            <GroupIcon />
          )
          : ''}
        {cameraList.length > 0
          ? renderDom(
            cameraList,
            '相关摄像头',
            cameraInfoList,
            <EQUIPMENTICON />
          )
          : ''}
        {maternalList.length > 0
          ? renderDom(maternalList, '相关母婴', maternalInfoList, <UserIcon />)
          : ''}
        {tvList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关广告电视({tvList.length})
            </div>
            {tvList.map((user, index) => {
              let checked = false;

              for (const item of tvInfoList) {
                if (user.userId === item?.id) {
                  checked = true;
                }
              }
              return (
                <div
                  className="search-result-group-item"
                  key={`${user.userId}-${index}`}
                >
                  <UserIcon />
                  <div className="search-result-item-detail">
                    <div
                      className="search-result-item-title overflow-ellipsis"
                      title={user.userName}
                    >
                      {renderSearchText(user.userName)}
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(user, user.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(userList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {equipmentList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关设备({equipmentList.length})
            </div>
            {equipmentList.map((user, index) => {
              let checked = false;

              for (const item of equipmentInfoList) {
                if (user.userId === item?.id) {
                  checked = true;
                }
              }
              return (
                <div
                  className="search-result-group-item"
                  key={`${user.userId}-${index}`}
                >
                  <UserIcon />
                  <div className="search-result-item-detail">
                    <div
                      className="search-result-item-title overflow-ellipsis"
                      title={user.userName}
                    >
                      {renderSearchText(user.userName)}
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(user, user.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(userList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {userList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关人员({userList.length})
            </div>
            {userList.map((user, index) => {
              let checked = false;

              for (const item of userInfoList) {
                if (user.userId === item?.id) {
                  checked = true;
                }
              }
              return (
                <div
                  className="search-result-group-item"
                  key={`${user.userId}-${index}`}
                >
                  <UserIcon />
                  <div className="search-result-item-detail">
                    <div
                      className="search-result-item-title overflow-ellipsis"
                      title={user.userName}
                    >
                      {renderSearchText(user.userName)}
                    </div>
                    {user.userDeptList?.map((deptItem: any, index: number) => {
                      if (index < INFO_LIMIT_NUM) {
                        return renderSearchDept(
                          deptItem,
                          user.contactType,
                          true
                        );
                      }
                    })}
                    {user.userDeptList?.length > INFO_LIMIT_NUM && (
                      <div className="more-info-container">
                        <span
                          className="more-info-number"
                          onMouseOver={handleShowMore}
                        >
                          等共<i>{user.userDeptList?.length}</i>个部门
                        </span>
                        <div
                          className="more-info-content"
                          style={moreInfoStyle}
                        >
                          {user.userDeptList?.map(
                            (deptItem: any, index: number) => {
                              return renderSearchDept(
                                deptItem,
                                user.contactType,
                                false
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {user.contactType === '3' ? (
                      <div className="search-result-item-des">
                        {
                          <div
                            className="search-result-info-dept"
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
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(user, user.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(userList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {deptList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关部门({deptList.length})
            </div>
            {deptList.map((dept: any, index: number) => {
              let checked = false;
              // const _selectType = dept.selectType
              //   ? dept.selectType === 'checkbox'
              //   : multiple;
              for (const item of deptInfoList) {
                if (dept.deptId === item?.id) {
                  checked = true;
                }
              }
              const deptNameAndOrgName = `${dept.orgName} - ${dept.deptNamePath}`;
              return (
                <div
                  className="search-result-group-item"
                  key={`${dept.deptId}-${index}`}
                >
                  <DeptIcon />
                  <div className="search-result-item-detail">
                    <div className="search-result-item-title">
                      <div className="overflow-ellipsis" title={dept.deptName}>
                        {renderSearchText(dept.deptName)}
                      </div>
                    </div>
                    <div className="search-result-item-des">
                      <div
                        className="search-result-info-dept"
                        title={deptNameAndOrgName}
                      >
                        {`位置: ${funTranName(`${deptNameAndOrgName}`, true)}`}
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    {multiple ? (
                      <Checkbox
                        checked={checked}
                        onChange={() => onCheckBoxChange(dept, dept.type)}
                      />
                    ) : (
                      <Radio
                        checked={checked}
                        onChange={() => onCheckBoxChange(dept, dept.type)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {renderSearchHint(deptList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {orgList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关组织({orgList.length})
            </div>
            {orgList.map((org: any, index: number) => {
              let checked = false;
              for (const item of orgInfoList) {
                // org也显示在相关组织下
                if (org.orgId === item?.id) {
                  checked = true;
                }
              }

              return (
                <div
                  className="search-result-group-item"
                  key={`${org.orgId}-${index}`}
                >
                  <OrgIcon />
                  <div className="search-result-item-detail">
                    <div className="search-result-item-title">
                      <div className="overflow-ellipsis" title={org.orgName}>
                        {renderSearchText(org.orgName)}
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(org, org.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(orgList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {groupList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关分组({groupList.length})
            </div>
            {groupList.map((group: any, index: number) => {
              let checked = false;

              for (const item of groupInfoList) {
                if (group.groupId === item?.id) {
                  checked = true;
                }
              }

              return (
                <div
                  className="search-result-group-item"
                  key={`${group.groupId}-${index}`}
                >
                  <GroupIcon />
                  <div className="search-result-item-detail">
                    <div className="search-result-item-title">
                      <div
                        className="overflow-ellipsis"
                        title={group.groupName}
                      >
                        {renderSearchText(group.groupName)}
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(group, group.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(groupList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {tagList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关标签({tagList.length})
            </div>
            {tagList.map((tag: any, index: number) => {
              let checked = false;

              for (const item of tagInfoList) {
                if (tag.userId === item?.id) {
                  checked = true;
                }
              }
              return (
                <div
                  className="search-result-group-item"
                  key={`${tag.userId}-${index}`}
                >
                  <TagIcon />
                  <div className="search-result-item-detail">
                    <div className="search-result-item-title">
                      <div className="overflow-ellipsis" title={tag.userName}>
                        {renderSearchText(tag.userName)}
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(tag, tag.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(tagList)}
          </React.Fragment>
        ) : (
          ''
        )}
        {orgRelList.length > 0 ? (
          <React.Fragment>
            <div className="search-result-group-title">
              相关组织({orgRelList.length})
            </div>
            {orgRelList.map((orgRel: any, index: number) => {
              let checked = false;

              for (const item of orgRelInfoList) {
                if (orgRel.orgId === item?.id) {
                  checked = true;
                }
              }

              return (
                <div
                  className="search-result-group-item"
                  key={`${orgRel.orgId}-${index}`}
                >
                  {orgRel?.orgType === 'REGULATORY' ? (
                    <OrgRelIcon />
                  ) : (
                    <OrgIcon />
                  )}
                  <div className="search-result-item-detail">
                    <div className="search-result-item-title">
                      <div className="overflow-ellipsis" title={orgRel.orgName}>
                        {renderSearchText(orgRel.orgName)}
                      </div>
                    </div>
                  </div>
                  <div className="checkbox-wrap">
                    <Checkbox
                      checked={checked}
                      onChange={() => onCheckBoxChange(orgRel, orgRel.type)}
                    />
                  </div>
                </div>
              );
            })}
            {renderSearchHint(orgRelList)}
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    );
  };

  const $allNumberAlert = useMemo(() => {
    return allNumber && selectType === 'user' && search.length < 8 ? (
      <div className="search-result-tips">
        <InfoCircleFilled className="search-result-tips-icon" />
        <Text type="secondary">
          为保证通讯录安全，手机号码输入超过8位后才能展示相关的人员结果
        </Text>
      </div>
    ) : null;
  }, [allNumber, selectType, search]);

  const renderContent = () => {
    return (
      <>
        {$allNumberAlert}
        <React.Fragment>{renderTabContent()}</React.Fragment>
      </>
    );
  };

  const handleDefault = () => {
    return searchResult.length === 0 ? (
      <div className="cf-tree-result-empty">未搜索到相关内容</div>
    ) : null;
  };

  return (
    <div className="search-result-wrap">
      {showTabList.length === 1 ? (
        <div className="search-result-tab">
          {renderContent()}
          {handleDefault()}
        </div>
      ) : (
        <Tabs className="search-result-tab" onChange={onSearchTabChange}>
          {
            <TabPane tab="全部" key="all">
              {renderContent()}
              {handleDefault()}
            </TabPane>
          }
          {showTabList.map((item: string) => {
            return (
              <TabPane tab={SHOW_TAB_LIST_ITEM_MAP[item]} key={item}>
                {renderContent()}
                {handleDefault()}
              </TabPane>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default SearchResult;
