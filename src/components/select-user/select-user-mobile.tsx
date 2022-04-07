import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import SelectPannel from './mobile/select-pannel';
import SelectSearchResult from './mobile/select-search-result';
import SelectFooter from './mobile/select-footer';
// @ts-ignore
// import TitleBar from 'ss-mobile-title-bar';

import './index.less';
import { Modal, Toast, Icon } from 'antd-mobile';
import { SearchBar } from 'antd-mobile-v5';
import net from '../../services/index';
import SelectedPane from './mobile/selected-pane';
import { IlistItem, SelectUserCountRequestItem } from './interface';
import { IsaveResultParams, PropTypes, IdefaultValue } from './interface';
import { TREE_CONTEXT } from './select-user';
import classnames from 'classnames';
import { URL } from '../../utils/api';

const SelectUserMobile: React.FunctionComponent<PropTypes> = ({
  defaultValue,
  dialogProps = {},
  visible = false,
  multiple = true,
  onOk,
  onCancel,
  getCheckedNodes,
  getTotalCount,
  basePath = 'mobile',
  selectSignature = '',
  isSaveSelectSignature = true,
  requestParams = { campusType: 'base_school_type' },
  showTabList = [
    'dept',
    'group',
    'memberContacts',
    'memberDeptContacts',
    'innerContacts',
    'maternalContacts',
    'equipmentContacts',
    'schoolContacts',
    'tagContacts',
    'orgRel',
    'groupContacts',
  ],
  selectType = 'user',
  unCheckableNodeType = [],
  searchPlaceholder = '搜索姓名、部门名称、手机号',
  onlyLeafCheckable = false,
  orgRelAnalysisRange,
  ...others
}) => {
  // const [loading, setLoading] = useState<boolean>(false);
  const [hoverSearch, setHoverSearch] = useState<boolean>(false);

  // 当前的搜索字段
  const [searchValue, setSearchValue] = useState<string>('');
  // 当前的搜索结果
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchTab, setSearchTab] = useState<string>('all');

  const [modal1, setModal] = useState<boolean>(false);

  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);

  // blur
  const handleBlur = () => {
    // debugger;
    setHoverSearch(false);
    // setSearchResult(null);
    // setSearchValue('');
  };
  const handleFocus = () => {
    setHoverSearch(true);
    setSearchResult(null);
    setSearchValue('');
  };
  const {
    treeState,
    setBasePath,
    setCorpidAppId,
    setSelectedData,
    setUserCount,
    clear,
    setRequest,
  } = treeContext;
  // const {
  //   deptInfoList,
  //   orgInfoList,
  //   userInfoList,
  //   groupInfoList,
  //   orgRelInfoList,
  //   tagInfoList
  // } = treeState;

  // 当搜索的tab改变
  const onSearchTabChange = (nextTab: any) => {
    const { key } = nextTab;
    setSearchTab(key);
    const params = {
      search: searchValue,
      types: key === 'all' ? showTabList : [key],
      ...requestParams,
    };
    getSearchResult(params);
  };

  useEffect(() => {
    clear();
    setBasePath(basePath);
    setCorpidAppId({ appId: others?.appId, corpid: others?.corpid });
  }, []);

  useEffect(() => {
    /**
     * 对defaultValue或者请求获取的数据源进行处理
     * @param data
     */
    // if (!visible) return;
    function resolveData(data: IdefaultValue) {
      const {
        deptInfoList = [],
        orgInfoList = [],
        userInfoList = [],
        tagInfoList = [],
        groupInfoList = [],
        orgRelInfoList = [],
      } = data;
      const checkedKeys: string[] = [];

      let selectCountRequestList: SelectUserCountRequestItem[] = [];

      // 存储所有部门id
      const deptObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'DEPT',
      };
      for (const item of deptInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'DEPT';

        deptObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有组织id
      const orgObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'ORG',
      };
      for (const item of orgInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'ORG';

        orgObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有标签id
      const tagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'TAG',
      };
      for (const item of tagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'TAG';

        tagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有分组id
      const groupObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'GROUP',
      };
      for (const item of groupInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'GROUP';

        groupObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有行政组织id
      const orgRelObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'ORG_REL',
      };
      for (const item of orgRelInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'ORG_REL';

        orgRelObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      selectCountRequestList = [
        deptObject,
        orgObject,
        tagObject,
        groupObject,
        orgRelObject,
      ];

      // selectType设置为dept则计算已选节点数量，否则计算可选节点的总人数
      if (selectType === 'dept') {
        const count = {
          orgCount: orgObject.selectNodeList.length,
          deptCount: deptObject.selectNodeList.length,
          tagCount: tagObject.selectNodeList.length,
          groupCount: groupObject.selectNodeList.length,
          orgRelCount: groupObject.selectNodeList.length,
        };
        setUserCount(count);
      } else {
        // 获取已选用户总人数
        getUserCount(selectCountRequestList, userInfoList);
      }

      /**
       * @param list
       */
      const generateKey = (list: IlistItem[]) => {
        list.forEach((item: IlistItem) => {
          checkedKeys.push(item.id);
        });
      };

      generateKey(deptInfoList);
      generateKey(orgInfoList);
      generateKey(userInfoList);
      generateKey(tagInfoList);
      generateKey(groupInfoList);
      generateKey(orgRelInfoList);

      // 更新
      setSelectedData({
        deptInfoList,
        orgInfoList,
        userInfoList,
        tagInfoList,
        groupInfoList,
        orgRelInfoList,
        checkedKeys,
      });
    }

    // 如果传入了默认值
    if (defaultValue) {
      // 处理默认值
      resolveData(defaultValue);
    }

    // if (selectSignature) {
    //   // 拉取数据并更新treeState中的已选数据
    //   // tslint:disable-next-line: no-floating-promises

    //   net
    //     .request(
    //       `${URL()}/select/component/result?corpid=${others?.corpid}&appId=${
    //         others?.appId
    //       }`,
    //       {
    //         method: 'POST',
    //         data: {
    //           selectSignature,
    //           ...requestParams,
    //         },
    //       }
    //     )
    //     .then((result: any) => {
    //       if (result.data) {
    //         resolveData(result.data);
    //         if (typeof getCheckedNodes === 'function') {
    //           getCheckedNodes({
    //             ...result.data,
    //             selectSignature: result.data.id,
    //           });
    //         }
    //       }
    //       // 处理响应数据
    //     });
    // }
  }, [selectSignature, visible]);

  // 获取用户人数
  const getUserCount = (selectCountRequestList: any, userInfoList: any) => {
    // tslint:disable-next-line: no-floating-promises
    net
      .request(
        `/select/compent/getUserCount?corpid=${others?.corpid}&appId=${others?.appId}`,
        {
          method: 'POST',
          data: {
            corpId: requestParams?.corpId,
            selectCountRequestList,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        const count = {
          orgCount: 0,
          deptCount: 0,
          tagCount: 0,
          groupCount: 0,
          orgRelCount: 0,
          userCount: 0,
        };

        for (const item of data) {
          switch (item.type) {
            case 'DEPT':
              count.deptCount = item.userCount;
              break;
            case 'ORG':
              count.orgCount = item.userCount;
              break;
            case 'GROUP':
              count.groupCount = item.userCount;
              break;
            case 'TAG':
              count.tagCount = item.userCount;
              break;
            case 'ORG_REL':
              count.orgRelCount = item.userCount;
            default:
          }
        }
        setUserCount(count);

        if (typeof getTotalCount === 'function') {
          let totalCount = userInfoList?.length || 0; // 已选总数
          for (const key in data) {
            totalCount += data[key].userCount || 0;
          }
          count.userCount = userInfoList?.length || 0;
          getTotalCount({ totalCount, count });
        }
      });
  };

  const handleOk = useCallback(() => {
    setRequest(true);
    /**
     * 保存快照参数格式化，主要是为了把之前组装的key还原
     * @param list 存储在treeState中的各种list
     */
    const formatParam = (list: IlistItem[]) => {
      const finalList: any[] = [];
      for (const item of list) {
        const obj: any = {};

        obj.id = item.id;
        obj.name = item.name;

        if (item.orgId) {
          obj.orgId = item.orgId;
        }

        if (item.orgName) {
          obj.orgName = item.orgName;
        }

        if (item.contactType) {
          obj.contactType = item.contactType;
        }

        if (item?.nodeType) {
          obj.nodeType = item.nodeType;
        }

        finalList.push(obj);
      }
      return finalList;
    };

    const {
      deptInfoList,
      orgInfoList,
      userInfoList,
      groupInfoList,
      tagInfoList,
      orgRelInfoList,
      userCount,
      equipmentInfoList,
    } = treeState;

    let totalCount = userInfoList?.length || 0; // 已选总数
    for (const key in userCount) {
      totalCount += userCount[key] || 0;
    }
    userCount.userCount = userInfoList?.length || 0;

    // 保存参数
    const params: IsaveResultParams = {
      deptInfoList: formatParam(deptInfoList),
      orgInfoList: formatParam(orgInfoList),
      userInfoList: formatParam(userInfoList),
      groupInfoList: formatParam(groupInfoList),
      tagInfoList: formatParam(tagInfoList),
      orgRelInfoList: formatParam(orgRelInfoList),
      equipmentInfoList: formatParam(equipmentInfoList),
      id: null,
      totalCount,
    };

    // 如果不需要保存快照，则直接返回结果
    if (!isSaveSelectSignature) {
      onOk({
        deptInfoList: params.deptInfoList,
        userInfoList: params.userInfoList,
        tagInfoList: params.tagInfoList,
        orgInfoList: params.orgInfoList,
        groupInfoList: params.groupInfoList,
        orgRelInfoList: params.orgRelInfoList,
        totalCount: params.totalCount,
        equipmentInfoList: params.equipmentInfoList,
        count: userCount,
      });
      return;
    }

    // 如果有selectSignature字端，则是更新，把原来的selectSignature作为id传回服务端
    if (selectSignature) {
      params.id = selectSignature;
    }

    // 配置行政组织解析参数orgRelAnalysisRange
    if (orgRelAnalysisRange) {
      params.orgRelRange = orgRelAnalysisRange;
    }

    // tslint:disable-next-line: no-floating-promises
    net
      .request(
        `${URL()}/select/component/result?corpid=${others.corpid}&appId=${
          others?.appId
        }`,
        {
          method: 'POST',
          data: {
            ...params,
            ...requestParams,
          },
        }
      )
      .then((result) => {
        setRequest(false);
        console.log(result, 'result333');
        onOk({
          selectSignature: result.data,
          deptInfoList: params.deptInfoList,
          userInfoList: params.userInfoList,
          tagInfoList: params.tagInfoList,
          orgInfoList: params.orgInfoList,
          groupInfoList: params.groupInfoList,
          orgRelInfoList: params.orgRelInfoList,
          equipmentInfoList: params.equipmentInfoList,
          totalCount: params.totalCount,
          count: userCount,
        });
      });
  }, [onOk, treeState]);

  // 请求获取搜索结果
  const getSearchResult = (params: any) => {
    Toast.loading('加载中…', 0);
    // tslint:disable-next-line: no-floating-promises
    net
      .request(
        `${URL()}/select/component/search?corpid=${others?.corpid}&appId=${
          others?.appId
        }`,
        {
          method: 'POST',
          data: params,
        }
      )
      .then((res) => {
        Toast.hide();
        const data = res.data;

        setSearchResult(data);
      })
      .catch(() => {
        Toast.hide();
      })
      .finally(() => {
        Toast.hide();
      });
  };
  console.log(searchValue, searchResult, 'xxxxx');

  return (
    <>
      {visible && (
        <div className="selected-mobile-model">
          <div
            className={classnames('select-user-mobile', {
              'select-user-mobile-visible': !!visible,
            })}
          >
            <div className="left-pane">
              <div className="ss-mobile-title-bar">
                <div className="btn-wrap">
                  <div className="left-wrap">
                    <div className="left-back-btn" onClick={() => onCancel()}>
                      <Icon type="left" style={{ height: '100% !important' }} />
                    </div>
                  </div>
                </div>
                <div className="title-wrap">选择对象</div>
              </div>
              <div className="column-top">
                <SearchBar
                  // value={searchValue}
                  onCancel={() => {
                    setSearchValue('');
                  }}
                  onSearch={(value) => {
                    const params = {
                      search: value.replace(/\s+/g, ''),
                      types: searchTab === 'all' ? showTabList : [searchTab],
                      ...requestParams,
                    };
                    getSearchResult(params);
                    setSearchValue(value.replace(/\s+/g, ''));
                  }}
                  // onChange={(value) => setSearchValue(value)}
                  className="search"
                  placeholder="请输入关键词进行搜索"
                  showCancelButton
                />
              </div>
              {/* <div
                className={`${
                  hoverSearch || searchValue
                    ? 'hover-search-show'
                    : 'hover-search-hidden'
                }`}
              >
                <SearchBar
                  value={searchValue}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onClear={() => setSearchValue('')}
                  className="select-user-mobile-search"
                  onChange={(value) => setSearchValue(value)}
                  onSubmit={(value: any) => {
                    const params = {
                      search: value,
                      types: searchTab === 'all' ? showTabList : [searchTab],
                      ...requestParams,
                    };
                    getSearchResult(params);
                    setSearchValue(value);
                  }}
                  placeholder={
                    showTabList.length > 1 ? '搜索' : searchPlaceholder
                  }
                />
                <div
                  onClick={() => {
                    const params = {
                      search: searchValue,
                      types: searchTab === 'all' ? showTabList : [searchTab],
                      ...requestParams,
                    };
                    getSearchResult(params);
                    setSearchValue(searchValue);
                  }}
                  className="my-search-btn am-search-cancel am-search-cancel-show am-search-cancel-anim"
                >
                  搜索
                </div>
              </div> */}
              {searchValue && !!searchResult ? (
                <SelectSearchResult
                  searchResult={searchResult}
                  multiple={multiple}
                  search={searchValue}
                  searchTab={searchTab}
                  selectType={selectType}
                  onSearchTabChange={onSearchTabChange}
                  showTabList={showTabList}
                />
              ) : (
                <React.Fragment>
                  <SelectPannel
                    visible={visible}
                    showTabList={showTabList}
                    multiple={multiple}
                    selectType={selectType}
                    basePath={basePath}
                    requestParams={requestParams}
                    unCheckableNodeType={unCheckableNodeType}
                    onlyLeafCheckable={onlyLeafCheckable}
                    {...others}
                  />
                </React.Fragment>
              )}
            </div>
            <SelectFooter
              onOk={handleOk}
              className="mobile-footer"
              open={() => setModal(true)}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              searchResult={searchResult}
            />
            {
              <Modal
                className="selected-model"
                visible={modal1}
                transparent
                maskClosable={false}
                footer={[
                  {
                    text: '确定',
                    style: 'primary',
                    onPress: () => {
                      setModal(false);
                    },
                  },
                ]}
              >
                <SelectedPane
                  setModal={setModal}
                  showUserDeptName={requestParams?.strictUser}
                  selectType={selectType}
                />
              </Modal>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default SelectUserMobile;
